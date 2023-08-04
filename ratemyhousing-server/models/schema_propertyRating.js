const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertyRatingSchema = new Schema({
  awesome:{
    type:Number,
    required:true,
    default:0
  },
  great:{
    type:Number,
    required:true,
    default:0
  },
  good:{
    type:Number,
    required:true,
    default:0
  },
  ok:{
    type:Number,
    required:true,
    default:0
  },
  aweful:{
    type:Number,
    required:true,
    default:0
  }

});

const PropertyRating = mongoose.model("PropertyRating",PropertyRatingSchema);
module.exports = {
  PropertyRating,
  PropertyRatingSchema
}

