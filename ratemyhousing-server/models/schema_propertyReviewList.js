const mongoose = require('mongoose');
const PropertyReviewSchema = require('./schema_propertyReview').PropertyReviewSchema;
const Schema = mongoose.Schema;


const PropertyReviewListSchema = new Schema({
  reviews:{
    type:[PropertyReviewSchema]
  }
});

const PropertyReviewList = mongoose.model('PropertyReviewList', PropertyReviewListSchema);
module.exports = {
  PropertyReviewList,
  PropertyReviewListSchema
}
