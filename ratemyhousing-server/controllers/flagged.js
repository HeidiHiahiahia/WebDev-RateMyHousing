const Review = require('../models/schema_propertyReview').PropertyReview;
const ServerError = require('../utils/errors/serverError');
const ResponseBody = require('../utils/respBody');
const mongoId = require('mongoose').Types.ObjectId;
const maxflags = require('config').get('app.settings.reviews.maxflags');
const mongoose = require('mongoose');

async function flagReview(req, res) {
  const parent_property_id = req.params.parent_property_id;
  const review_id = req.params.review_id;
  if (mongoId.isValid(review_id) && mongoId.isValid(parent_property_id)) {
    let review = await Review.findOne({_id:review_id, parent_property_id: parent_property_id });
    if(!review)
      throw new ServerError(404,404,"Unable to find review");
    try{
      const session = await mongoose.startSession();
      session.startTransaction();
        review = await Review.findOneAndUpdate({_id:review_id, parent_property_id: parent_property_id }, {$inc : {'flags' : 1}}, {new: true});
        if(review.flags >= maxflags) 
          review = await Review.findOneAndUpdate({_id:review_id, parent_property_id: parent_property_id }, {'flagged' : true}, {new: true, session: session});
      await session.commitTransaction();
      session.endSession();    
    } catch(err) { 
      throw new ServerError(err.code,500,"Error Updating review");
    }
    const respBody = new ResponseBody(200,review,"Successfully flagged review",true);
    res.status(200).json(respBody);
  } else{
    throw new ServerError(400,400,"Invalid flagged review id");
  }
}


async function getAllFlaggedReview(req, res){
  try{
    flaggedReviews = await Review.find({flagged: true});
    const status = 200;
    const resp = new ResponseBody(
      status,
      flaggedReviews,
      "All reviews found successful",
      true
    );
    res.status(status).json(resp);
  }catch(err){
    throw new ServerError(err.code, 500, "Error getting all flagged reviews");
  }
}


module.exports = {
  flagReview,
  getAllFlaggedReview
};
