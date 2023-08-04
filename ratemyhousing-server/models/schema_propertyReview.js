const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PropertyReviewSchema = new Schema({
  parent_property_id:{
    type:String,
    required:true
  },
  bedNum:Number,
  bathNum:Number,
  landlordData:String,
  costReview:{
    type: Number,
    required: true
  },
  overallRatingReview:{
    type: Number,
    required: true
  },
  landlordRating:{
    type: Number,
    required: true
  },
  neighborhood:{
    type: Number,
    required: true
  },
  crowdedness:{
    type: Number,
    required: true
  },
  cleanliness:{
    type: Number,
    required: true
  },
  accessibility:{
    type: Number,
    required: true
  },
  textReview:{
    type:String,
    required:true,
    default: ''
  },
  voteUp:{
    type:Number,
    required:true,
    default:0
  },
  voteDown:{
    type:Number,
    required:true,
    default:0
  },
  flags: {
    type:Number,
    required: true,
    default: 0
  },
  datePosted:{
    type:Date,
  },
  pictures:[String],
  flagged: {
    type: Boolean,
    required: true,
    default: false
  }
});

const PropertyReview = mongoose.model('PropertyReview', PropertyReviewSchema)
module.exports = {
  PropertyReview,
  PropertyReviewSchema
}
