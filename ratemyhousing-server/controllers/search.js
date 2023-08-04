const Property = require('../models/schema_property').Property
const ServerError = require('../utils/errors/serverError');
const ResponseBody = require('../utils/respBody');


async function searchProperty(req, res) {
  const searchString = req.query.q;
  let result;
  try{
    result = await Property.find({ $text : { $search: searchString}})
    .select('_id name propertyType address overallRating pictures totalReviewCount');
  }catch(e){
    throw new ServerError(err.code,500,"Error occurred while searching");
  }
  const resp = new ResponseBody(200,result,"success",true);
  res.status(200).json(resp);
}


module.exports = {
  searchProperty
};
