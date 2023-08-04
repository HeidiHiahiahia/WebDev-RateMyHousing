const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *  FlaggedReviewListSchema:
 *      parent_property_id:
 *          type: string
 *      parent_review_id:
 *          type: string
 *      required:
 *          - parent_property_id
 *          - parent_review_id
 *  
 */

const FlaggedReviewSchema = new Schema({    
        parent_property_id:{
            type: String,
            required: true
        },
        review_id:{
            type:String,
            required: true
        }
});

const FlaggedReview = mongoose.model('FlaggedReview',FlaggedReviewSchema);
module.exports = {
    FlaggedReview,
    FlaggedReviewSchema
}