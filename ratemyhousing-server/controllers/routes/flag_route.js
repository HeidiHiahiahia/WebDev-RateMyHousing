"use strict";
const express = require("express");
const flagged = require('../flagged');
const catchAsync = require('../../utils/catchAsync');
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Flag APIs
 *  description: Endpoints to allow for flagging
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
  *
  */

  

/**
 * @swagger
 * /flag/{parent_property_id}/{review_id}:
 *  put:
 *      summary: Fetch all reviews that are flagged
 *      tags: [Flag APIs]
 *      responses:
 *          200:
 *              description: Get Review successful
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/reviewList'
 */
router
  .route("/:parent_property_id/:review_id")
  .put(catchAsync(flagged.flagReview));


/**
 * @swagger
 * /flag:
 *  get:
 *      summary: Fetch all reviews that are flagged
 *      tags: [Flag APIs]
 *      responses:
 *          200:
 *              description: Get Review successful
 *              content:
 *                  application/json:
 *                   schema:
 *                    $ref: '#/components/schemas/reviewList'
 */
router
  .route("/")
  .get(catchAsync(flagged.getAllFlaggedReview));



module.exports = router;
