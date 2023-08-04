const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * @swagger
 * definitions:
 *  cmtOfRev:
 *      properties:
 *          textReview:
 *              type: string
 *          datePosted:
 *              type: Date
 *          postedBy:
 *              type: string
 *          parent_property_id:
 *              type: string
 *          parent_review_id:
 *              type: string
 *      required:
 *          - textReview
 *          - datePosted
 *          - postedBy
 *          - parent_property_id
 *          - parent_review_id 
 */

const CmtOfRevSchema = new Schema({
    parent_property_id: {
        type:String,
        required: true
    },
    parent_review_id:{
        type:String,
        required: true
    },
    textReview:{
        type:String,
        required:true
    },
    datePosted:{
        type:Date,
        required:true
    },
    postedBy: { //this can be a random user-id for users that are not logged in
        type:String,
        required:true
    }
});


const CmtOfRev = mongoose.model('CmtOfRev',CmtOfRevSchema);

module.exports = {
    CmtOfRev,
    CmtOfRevSchema
}