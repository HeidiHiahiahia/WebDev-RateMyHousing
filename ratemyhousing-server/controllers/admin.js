const Property = require('../models/schema_property').Property
const Review = require('../models/schema_propertyReview').PropertyReview;
const ServerError = require('../utils/errors/serverError');
const ResponseBody = require('../utils/respBody');
const mongoId = require('mongoose').Types.ObjectId;
const approve = 'approve';
const reject = 'reject';


async function judgeReview(req, res) {
  const review_id = req.params.review_id;
  const parent_property_id = req.params.parent_property_id;
  const decision = req.query.decision;
  if(mongoId.isValid(review_id) && mongoId.isValid(parent_property_id)) {

    let review;
    if(decision === approve) {
      try{
        review = await Review.findOneAndUpdate({_id: review_id, parent_property_id: parent_property_id }, {flags: 0, flagged: false  }, {new:true});
      }
      catch(err){
        throw new ServerError(500, 500, "Error while approving review")
      }
    } else if(decision === reject) {
      try{
        review = await Review.findOneAndDelete({_id: review_id, parent_property_id: parent_property_id });
      }
      catch(err){
        throw new ServerError(500, 500, "Error while rejecting review")
      }
    } else {
      throw new ServerError(400, 400, "Invalid decision", false)
    }

    if(review){
      const respBody = new ResponseBody(200, review, `Successfully ${decision}ed review`, true)
      res.status(200).json(respBody);
    }else{
      throw new ServerError(404, 404, "Unable to find review");
    }

  } else{
    throw new ServerError(400, 400, "Invalid flag id", false)
  }
}

async function fetchProperties(req, res) {
  let properties;
  try{
    properties = await Property.find({"approval" : false}).select('_id name propertyType address overallRating pictures');
  } catch(err){
    throw new ServerError(500, 500, "Error in fetching all un-aproved properties", false)
  }
  const respBody = new ResponseBody(200, properties, "Successfully fetched all properties that are not approved", true)
  res.status(200).json(respBody);
}

async function judgeProperty(req, res){
  const property_id = req.params.property_id;
  const decision = req.query.decision;
  if(mongoId.isValid(property_id)){
    let prop;
    if(decision === approve){
      try{
        prop = await Property.findByIdAndUpdate(property_id, {"approval" : true}, {new: true});
      }catch(err){
        throw new ServerError(500, 500, "Error in approving property", false)
      }
    } else if (decision === reject){
      try{
        prop = await Property.findByIdAndDelete(property_id);
      }catch(err){
        throw new ServerError(500, 500, "Error in rejecting property", false)
      }
    } else {
      throw new ServerError(400, 400, "Invalid decision", false)
    }
    if(prop){
      const respBody = new ResponseBody(200, prop, `Successfully ${decision}ed property with given id`, true);
      res.status(200).json(respBody);
    }else{
      throw new ServerError(404, 404, "Property not found", false)
    } 
  } else {
    throw new ServerError(400, 400, "Invalid property id", false)
  }
}

async function fetchFlagreviews(req, res){
  let flagreviews;
  try{
    flagreviews = await Review.find({flagged: true});
  } catch(err){
    throw new ServerError(500, 500, "Error in fetching all un-aproved properties", false)
  }
  const respBody = new ResponseBody(200, flagreviews, "Successfully fetched all flagged reviews", true)
  res.status(200).json(respBody);
}

module.exports = {
  fetchProperties,
  judgeProperty,
  fetchFlagreviews,
  judgeReview
};
