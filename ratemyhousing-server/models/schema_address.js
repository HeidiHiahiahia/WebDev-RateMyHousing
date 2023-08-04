const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//TODO: RMP:93 Develop a custom equality check function for comparing address equality between properties

const validatePostalCode = function(postalCode) {
  var re = /^[A-Z][0-9][A-Z] [0-9][A-Z][0-9]$/;
  return re.test(postalCode);
};

const AddressSchema = new Schema({
      country:{
        type:String,
        required:true,
        default:'Canada'
      },
      state:{
        type:String,
        required:true
      },
      city:{
        type:String,
        required:true
      },
      street:{
        type:String,
        required:true
      },
      unitNum:{
        type:String,
        required:false,
        default:'00'
      },
      postalCode:{
        type:String,
        required:true,
        validator: validatePostalCode
      }
});

const Address = mongoose.model('Address',AddressSchema);
module.exports = {
    Address,
    AddressSchema,
    validatePostalCode
}
