const Property = require('../models/schema_property').Property
const ServerError = require('../utils/errors/serverError');
const ResponseBody = require('../utils/respBody');
const mongoId = require('mongoose').Types.ObjectId;

/**get property function */
async function readProperty(req, res) {
  const property_id = req.params.id;
  if (mongoId.isValid(property_id)) {
    let propertyFound;
    try {
      propertyFound = await Property.findById(property_id);
    } catch (err) {
      throw new ServerError(err.code, 500, err.message);
    }
    if (!propertyFound) {
      throw new ServerError(404, 404, "Property not found", false);
    } else {
      const status = 200;
      const resp = new ResponseBody(
        status,
        propertyFound,
        "Property found successful",
        true
      );
      res.status(status).json(resp);
    }
  } else {
    throw new ServerError(400, 400, "Invalid id", false);
  }
}
/**Create property function */
async function createProperty(req, res) {
  const newProperty = new Property(req.body);
  newProperty.datePost = Date.now()
  try {
    await newProperty.save();
    const status = 201;
    const resp = new ResponseBody(status, newProperty.id, "Property creation success", true);
    res.status(status).json(resp);
  } catch (err) {
    throw new ServerError(err.code, 500, err.message);
  }
}

/**Update property function */
async function updateProperty(req, res) {
  const property_id = req.params.id;
  let prop;
  try{
    prop = await Property.findByIdAndUpdate(property_id, {...req.body.property}, {runValidators:true, new: true})
  }catch(err){
    throw new ServerError(err.code,500,"Error Updating property");
  }
  if(prop){
    const respBody = new ResponseBody(200,prop,"Successfully updated",true);
    res.status(200).json(respBody);
  }else{
    throw new ServerError(400,400,"Property not found");
  }
};

/**Delete property function */
async function deleteProperty(req, res) {
  const property_id = req.params.id;
  let prop
  try{
    prop = await Property.findByIdAndDelete(property_id);
  }catch(err){
    throw new ServerError(err.code,500,"Error deleting property");
  }
  if(prop){
    const respBody = new ResponseBody(200,prop,"Successfully deleted",true);
    res.status(200).json(respBody);
  }else{
    throw new ServerError(400,400,"Property not found");
  }
}

module.exports = {
  readProperty,
  createProperty,
  updateProperty,
  deleteProperty
};
