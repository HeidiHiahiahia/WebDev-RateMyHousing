const mongoose = require('mongoose');
const FlaggedReviewSchema = require('./schema_flaggedReview').FlaggedReviewSchema;
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *  FlaggedReviewListSchema:
 *      flaggedReviewList:
 *          type: array
 *  
 */

const FlaggedReviewListSchema = new Schema({
    flaggedReviewList:{
        type: [FlaggedReviewSchema]
    }
});

const FlaggedReviewList = mongoose.model('FlaggedReviewList',FlaggedReviewListSchema);

module.exports = {
    FlaggedReviewList,
    FlaggedReviewListSchema
};