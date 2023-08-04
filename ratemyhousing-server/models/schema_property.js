const mongoose = require('mongoose');
const AddressSchema = require('./schema_address').AddressSchema;
const Schema = mongoose.Schema;


const PropertySchema = new Schema({
  name:String,
  propertyType:{
    type:String,
    required:true,
  },
  landlord:String,
  propertyManagement:String,
  propertyWebsite:String,
  approval:{
    type: Boolean,
    required: true,
    default:false
  },
  address: {
    type: AddressSchema,
    required:true
  },
  overallRating:{
    type:Number,
    required:true,
    default:0
  },
  datePost:{
    type: Date,
  },
  ratingBreakDown: {
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
  },
  amenities:[
    {
      amenity: String,
      available: Boolean
    }
  ],
  pictures:[String],
  totalReviewCount:{
    type: Number,
    required: true,
    default:0
  }
});

PropertySchema.methods.addReview = function() {
  this.totalReviewCount = this.totalReviewCount+1;
}

PropertySchema.methods.removeReview = function() {
  this.totalReviewCount = this.totalReviewCount-1;
}

PropertySchema.index({ 'address.street': 'text','address.city' : 'text', 'address.state':'text', name: 'text' });
const Property = mongoose.model('Property', PropertySchema);
Property.createIndexes();
module.exports = {
  Property,
  PropertySchema,
}
