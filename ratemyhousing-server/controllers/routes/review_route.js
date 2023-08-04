"use strict";
const express = require('express');
const review = require('../review');
const catchAsync = require('../../utils/catchAsync');
const router = express.Router();


/**
 * @swagger
 * tags:
 *  name: Review APIs
 *  description: Review API docs
 */

 /**
  *@swagger
  *components:
  *  securitySchemes:
  *      bearerAuth:
  *          type: http
  *          scheme: bearer
  *          bearerFormat: JWT
  *  schemas:
  *      readReview:
  *          type: object
  *          required:
  *              - review ID
  *          properties:
  *              review_ID:
  *                  type: string
  *                  description: Get the review with the given review id
  *          example:
  *              review ID: 621d40f6562f1ed0366a2a4b
  *
  *      createReview:
  *          type: object
  *          required:
  *              - review
  *              - property ID
  *          properties:
  *              review:
  *                  type: review_schema
  *                  description: All details of a review that need to be insert to database
  *              property ID:
  *                  type: string
  *                  description: Get the property and add one review to the given property id
  *
  *          example:
  *              "parent_property_id": "621d3f4d754997df73208f27"
  *              "bedNum": 1
  *              "bathNum": 1
  *              "landlordData" : "im landlord"
  *              "costReview": 1000,
  *              "overallRatingReview": 5
  *              "landlordRating": 2
  *              "neighborhood": false
  *              "crowdedness": true
  *              "cleanliness": false
  *              "accessibility": true
  *              "textReview": "this is textReview"
  *              "voteUp": 0
  *              "voteDown": 0
  *              "flags": 0
  *              "datePosted": "2021-1-1"
  *              "pictures": ["pic1"]
  *              "comments": ["com1"]
  *
  *      updateReview:
  *          type: object
  *          required:
  *              - review ID
  *              - review
  *          properties:
  *              review_ID:
  *                  type: string
  *                  description: Using the reviewID to update the review
  *              review:
  *                  type: review_schema
  *                  description: All details of a review that need to be insert to database
  *          example:
  *              "parent_property_id": "621d3f4d754997df73208f27"
  *              "bedNum": 1
  *              "bathNum": 12
  *              "landlordData" : "im landlord"
  *              "costReview": 1000
  *              "overallRatingReview": 5
  *              "landlordRating": 2
  *              "neighborhood": false
  *              "crowdedness": true
  *              "cleanliness": false
  *              "accessibility": true
  *              "textReview": "this is textReview"
  *              "voteUp": 0
  *              "voteDown": 0
  *              "flags": 0
  *              "datePosted": "2021-1-1"
  *              "pictures": ["pic1"]
  *              "comments": ["com1"]
  *
  *      deleteReview:
  *          type: object
  *          required:
  *              -  review_ID
  *          properties:
  *              review_ID:
  *                  type: string
  *                  description: Delete the review with the given review id
  *          example:
  *              review ID: 6211b5b3db8a7c19561c2202
  *
  *      reviewList:
  *          type: object
  *          properties:
  *              parent_property_id:
  *                  type: String
  *                  description: id of the parent property
  *              bedNum:
  *                  type: array
  *                  description: Number of bedrooms
  *              bathNum:
  *                  type: string
  *                  description: Number of bathrooms
  *              costReview:
  *                  type: Number
  *                  description: Cost of the place
  *              overallRatingReview:
  *                  type: Number
  *                  description: Overall Rating of the place
  *              landlordRating:
  *                  type: Number
  *                  description: Is the landlord good enough ?
  *              neighborhood:
  *                  type: Number
  *                  description: Is the neighbour hood good enough ?
  *              crowdedness:
  *                   type: Number
  *              cleanliness:
  *                   type: Number
  *              accessibility:
  *                   type: Number
  *              textReview:
  *                   type: Number
  *              voteUp:
  *                   type: Number
  *              voteDown:
  *                   type: Number
  *              datePosted:
  *                   type: Date
  *              pictures:
  *                   type: [String]
  *          example:
  *              "status": 200
  *              "data":
  *                 -  "parent_property_id": "6634123be6dc48f6f86e23d"
  *                    "_id": "6634123be6dc48f6f86e23d"
  *                    "bedNum": 3
  *                    "bathNum": 4
  *                    "landlondData": "Bad landlord"
  *                    "costReview": 4
  *                    "overallRatingReview": 3
  *                    "landlordRating": 3
  *                    "neighborhood": 2
  *                    "crowdedness": 3
  *                    "cleanliness": 5
  *                    "accessibility": 4
  *                    "textReview": "This house is horrible"
  *                    "voteUp": 4
  *                    "voteDown": 30
  *                    "datePosted": "12341225"
  *                    "pictures": ['http://pichostedonsomesite.jpg']
  *                 -  "parent_property_id": "6634123be6dc48f6f86e23d"
  *                    "_id": "6634123be6dc48f6f86e23d"
  *                    "bedNum": 3
  *                    "bathNum": 4
  *                    "landlondData": "Bad landlord"
  *                    "costReview": 4
  *                    "overallRatingReview": 3
  *                    "landlordRating": 3
  *                    "neighborhood": 2
  *                    "crowdedness": 3
  *                    "cleanliness": 5
  *                    "accessibilit  y": 4
  *                    "textReview": "This house is horrible"
  *                    "voteUp": 4
  *                    "voteDown": 30
  *                    "datePosted": "12341225"
  *                    "pictures": ['http://pichostedonsomesite.jpg']
  *              "message": "success"
  *              "success": true
  *
  *      voteReview:
  *          type: object
  *          required:
  *              - review ID
  *              - parent_property_id
  *              - vote
  *          properties:
  *              review_ID:
  *                  type: string
  *                  description: Using the reviewID to update the review
  *              parent_property_id:
  *                  type: string
  *                  description: Using the parent_property_id to get parent property
  *              vote:
  *                  type: Number
  *                  description: 0 stands for voteDown, 1 stands for voteUp
  *          example:
  *              "vote": 1
  *
  */


  /**
   * @swagger
   * /review/{parent_property_id}/{review_id}:
   *  get:
   *      summary: Getting the specific review with given id
   *      tags: [Review APIs]
   *      responses:
   *          200:
   *              description: Get Review successful
   *              content:
   *                  application/json:
   *                   schema:
   *                    $ref: '#/components/schemas/readReview'
   *
   */
router
  .route("/:parent_property_id/:review_id")
  .get(catchAsync(review.readReview));


  /**
   * @swagger
   * /review/{parent_property_id}:
   *  post:
   *      summary: Create the review with given property id
   *      tags: [Review APIs]
   *      parameters:
   *          - in: params, body
   *            name: Review POST API
   *            schema:
   *                $ref: '#/components/schemas/createReview'
   *      responses:
   *          201:
   *              description: Add Review successful
   *              content:
   *                  application/json
   */
router
  .route("/:parent_property_id")
  .post(catchAsync(review.createReview));


  /**
   * @swagger
   * /review/{parent_property_id}/{review_id}:
   *  put:
   *      summary: Update the review with given review details
   *      tags: [Review APIs]
   *      parameters:
   *          - in: prams, body
   *            name: Review PUT API
   *            schema:
   *                $ref: '#/components/schemas/updateReview'
   *      responses:
   *          200:
   *              description: Update review successful
   *              content:
   *                  application/json
   *
   */
router
  .route("/:parent_property_id/:review_id")
  .put(catchAsync(review.updateReview));


  /**
   * @swagger
   * /review/{parent_property_id}/{review_id}:
   *  delete:
   *      summary: Delete the review with given id
   *      tags: [Review APIs]
   *      parameters:
   *          - in: prams, body
   *            name: Review DELETE API
   *            schema:
   *                $ref: '#/components/schemas/deleteReview'
   *      responses:
   *          200:
   *              description: Delete review successful
   *              content:
   *                  application/json
   */
router
  .route("/:parent_property_id/:review_id")
  .delete(catchAsync(review.deleteReview));

/**
 * @swagger
 * /review/{parent_property_id}:
 *  get:
 *      summary: Fetch all reviews under the given property id
 *      tags: [Review APIs]
 *      responses:
 *          200:
 *              description: Get Review successful
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/reviewList'
 */
router
  .route("/:parent_property_id")
  .get(catchAsync(review.getAllReviewsofProperty));

  /**
   * @swagger
   * /review/vote/{parent_property_id}/{review_id}:
   *  patch:
   *      summary: vote up or down for a review
   *      tags: [Review APIs]
   *      parameters:
   *          - in: parameters
   *            name: Review PATCH API
   *            schema:
   *                $ref: '#/components/schemas/voteReview'
   *      responses:
   *          200:
   *              description: Successfully updated voteDown/voteUp for review
   *              content:
   *                  application/json
   */
router
  .route("/vote/:parent_property_id/:review_id")
  .patch(catchAsync(review.voteReview))

module.exports = router;
