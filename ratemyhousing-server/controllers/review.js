const Property = require('../models/schema_property').Property
const Review = require('../models/schema_propertyReview').PropertyReview
const ServerError = require('../utils/errors/serverError');
const ResponseBody = require('../utils/respBody');
const mongoId = require('mongoose').Types.ObjectId;
const mongoose = require('mongoose');


/**Overall Rating formula - avg - Sumof(overallRatings)/Num(reviews of that property)
  Always call this function as a part of a transaction - never call standalone!
**/
async function calcPropRatings(prop,session){
  const noOfReviews = await Review.where({'parent_property_id': prop.id}).count().session(session);
  const aggregate = await Review.aggregate([{ $match: {parent_property_id: prop.id} },{ $group: { _id:null,count: { $sum: "$overallRatingReview" }}}],{session:session});
  if(noOfReviews > 0){
  const sumOfRatings = aggregate[0].count;
    prop.overallRating = Math.round(((sumOfRatings/noOfReviews) + Number.EPSILON) * 100) / 100;
    prop.ratingBreakDown.awesome = await Review.count({ parent_property_id: prop.id, overallRatingReview: { $gt: 4, $lte: 5 } }).session(session); 
    prop.ratingBreakDown.great   = await Review.count({ parent_property_id: prop.id, overallRatingReview: { $gt: 3, $lte: 4 } }).session(session);
    prop.ratingBreakDown.good    = await Review.count({ parent_property_id: prop.id, overallRatingReview: { $gt: 2, $lte: 3 } }).session(session);
    prop.ratingBreakDown.ok      = await Review.count({ parent_property_id: prop.id, overallRatingReview: { $gt: 1, $lte: 2 } }).session(session);
    prop.ratingBreakDown.aweful  = await Review.count({ parent_property_id: prop.id, overallRatingReview: { $gt: 0, $lte: 1 } }).session(session);
  }else{
    prop.overallRating = 0;
    prop.ratingBreakDown.awesome = 0; 
    prop.ratingBreakDown.great   = 0;
    prop.ratingBreakDown.good    = 0;
    prop.ratingBreakDown.ok      = 0;
    prop.ratingBreakDown.aweful  = 0;
  }
  await prop.save(session);
}
/**read review function */
async function readReview(req, res) {
  const review_id = req.params.review_id;
  if (mongoId.isValid(review_id)) {
    let reviewFound;
    try {
      reviewFound = await Review.findById(review_id);
    } catch (err) {
      throw new ServerError(err.code, 500, "Error read review");
    }
    if(!reviewFound){
      throw new ServerError(404, 404, "Review not found", false);
    } else {
      const status = 200;
      const resp = new ResponseBody(
        status,
        reviewFound,
        "Review found successful",
        true
      );
      res.status(status).json(resp);
    }
  } else {
    throw new ServerError(400, 400, "Invalid review id", false);
  }
}


/**create review function */
async function createReview(req, res) {
  const property_id = req.params.parent_property_id;
  if (mongoId.isValid(property_id)) {
    let prop;
    try{
      prop = await Property.findById(property_id);
    }catch(err){
      throw new ServerError(err.code, 500, "Error matching review to a valid parent property");
    }
    if(!prop)
      throw new ServerError(404, 404, "No valid parent property found");
    const newReview = new Review(req.body);
    newReview.datePosted = Date.now();
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      await newReview.save(session);
      prop.addReview();
      await calcPropRatings(prop,session);
      await session.commitTransaction();
      session.endSession();

      const status = 201;
      const resp = new ResponseBody(
        status,
        newReview.id,
        "Review creation success",
        true
      );
      res.status(status).json(resp);
    } catch (err) {
      throw new ServerError(err.code, 500, "Error creating review");
    }
  } else {
    throw new ServerError(400, 400, "Invalid property id", false);
  }
}

/**update review function */
async function updateReview(req, res) {
  const review_id = req.params.review_id;
  const parent_property_id = req.params.parent_property_id;
  req.body.review.datePosted = Date.now();
  if (mongoId.isValid(review_id) && mongoId.isValid(parent_property_id)) {
    let prop;
    try{
      prop = await Property.findById(parent_property_id);
    }catch(err){
      throw new ServerError(err.code, 500, "Error matching review to a valid parent property");
    }
    if(!prop)
      throw new ServerError(404, 404, "No valid parent property found");
    let review;
    try{
      const session = await mongoose.startSession();
      session.startTransaction();
       review = await Review.findOneAndUpdate( {_id: review_id, parent_property_id: parent_property_id }, {...req.body.review}, {session:session, new: true});
       await calcPropRatings(prop,session);
       await session.commitTransaction();
      session.endSession();
    }catch(err){
      throw new ServerError(err.code,500,"Error Updating review");
    }
    if(review){
      const respBody = new ResponseBody(200,review,"Successfully updated review",true);
      res.status(200).json(respBody);
    } else {
      throw new ServerError(404,404,"Review not found");
    }
  } else{
    throw new ServerError(400,400,"Invalid review id");
  }
}

/**delete review function */
async function deleteReview(req, res) {
  const review_id = req.params.review_id;
  const parent_property_id = req.params.parent_property_id;
  if (mongoId.isValid(review_id) && mongoId.isValid(parent_property_id)) {
    let prop;
    try{
      prop = await Property.findById(parent_property_id);
    }catch(err){
      throw new ServerError(err.code, 500, "Error matching review to a valid parent property");
    }
    if(!prop)
      throw new ServerError(404,404,"No valid parent property found");
    let review;
    try {
      const session = await mongoose.startSession();
      session.startTransaction();
        review = await Review.findOneAndDelete({ _id:review_id, parent_property_id: parent_property_id },{session: session});  
        prop = await Property.findById(parent_property_id);
        await calcPropRatings(prop,session);
        prop.removeReview();
        await prop.save(session);
        await session.commitTransaction();
      session.endSession();
    } catch (err) {
      console.log("Delete Review issue:142",err);
      throw new ServerError(err.code, 500, err.message);
    }
    if (review) {
      const respBody = new ResponseBody(200, review, "Successfully deleted review", true);
      res.status(200).json(respBody);
    } else {
      throw new ServerError(404, 404, "Review not found");
    }
  } else {
    throw new ServerError(400, 400, "Invalid review id");
  }
}

async function getAllReviewsofProperty(req,res){
  const property_id = req.params.parent_property_id;
  if (mongoId.isValid(property_id)) {
    let prop = await Property.findById(property_id);
    if(!prop)
      throw new ServerError(404,404,"No valid parent property found");
    let reviews
    try{
      reviews = await Review.find({parent_property_id: property_id});
    }catch(err){
      throw new ServerError(err.code, 500, "Error fetching all reviews");
    }
    const resp = new ResponseBody(200,reviews,"success",true);
    res.status(200).json(resp);
  }else{
    throw new ServerError(400, 400, "Invalid review id");
  }
}

async function voteReview(req,res){
  const review_id = req.params.review_id;
  const parent_property_id = req.params.parent_property_id;
  if (!mongoId.isValid(parent_property_id)) {
    throw new ServerError(400, 400, "Invalid property id");
  }
  const vote = req.body.vote;
  if (mongoId.isValid(review_id)) {
    prop = await Property.findById(parent_property_id);
    if(prop){
      // vote down
      if(vote == 0){
        try{
          review = await Review.findOneAndUpdate({_id: review_id, parent_property_id: prop.id}, {$inc: {'voteDown': 1}},{new: true});
        } catch(err){
          throw new ServerError(err.code, 500, "Error vote down");
        }
        if(review){
          const respBody = new ResponseBody(200,review,"Successfully updated voteDown for review",true);
          res.status(200).json(respBody);
        }else{
          throw new ServerError(404,404,"Review not found for vote Down");
        }
      }
      // vote up
      else{
        try{
          review = await Review.findOneAndUpdate({_id: review_id, parent_property_id: prop.id}, {$inc: {'voteUp': 1}},{new: true});
        }catch(err){
          throw new ServerError(err.code, 500, "Error vote up");
        }
        if(review){
          const respBody = new ResponseBody(200,review,"Successfully updated voteup for review",true);
          res.status(200).json(respBody);
        }else{
          throw new ServerError(404,404,"Review not found for vote Up");
        }
      }
    } else{
      throw new ServerError(404,404,"property not found for vote Up");
    }
  }else{
    throw new ServerError(400, 400, "Invalid review id");
  }
}

module.exports = {
  readReview,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsofProperty,
  voteReview
};
