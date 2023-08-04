"use strict";
const express = require("express");
const admin = require('../admin');
const catchAsync = require('../../utils/catchAsync');
const router = express.Router();
const {validateToken, authRole} = require('../auth');
const { ROLE } = require("../../models/roles");

/**
 * @swagger
 * tags:
 *  name: Admin APIs
 *  description: Admin API docs
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
  *      RejectflaggedReview:
  *          type: object
  *          required:
  *              - flagged review ID
  *          properties:
  *              flagged review_ID:
  *                  type: string
  *                  description: Reject flagged review with the given flagged review id, meaning remove the review from database
  *          example:
  *              flagged review ID: 621d40f6562f1ed0366a2a4b
  *
  *      ApprovalflaggedReview:
  *          type: object
  *          required:
  *              - flagged review ID
  *          properties:
  *              flagged review ID:
  *                  type: string
  *                  description: Approve flagged review with the given flagged review id, meaning making this review not flagged
  *
  *          example:
  *              flagged review ID: 621d40f6562f1ed0366a2a4b
  *
  *      ApproveProperty:
  *          type: object
  *          properties:
  *              property_id:
  *                  type: String
  *                  description: id of the property
  *          example:
  *              property ID: 621d40f6562f1ed0366a2a4b
  *
  *      RejectProperty:
  *          type: object
  *          properties:
  *              property_id:
  *                  type: String
  *                  description: id of the property
  *          example:
  *              property ID: 621d40f6562f1ed0366a2a4b

  *      FlaggedReviewList:
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
  *                    "flags": 5
  *                    "flagged": true
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
  *                    "flags": 5
  *                    "flagged": true
  *                    "voteDown": 30
  *                    "datePosted": "12341225"
  *                    "pictures": ['http://pichostedonsomesite.jpg']
  *              "message": "success"
  *              "success": true
  *      NonApprovedPropertyList:
  *          type: object
  *          properties:
  *              status:
  *                  type: Number
  *                  description: Response status code
  *              data:
  *                  type: array
  *                  description: List of properties found
  *              message:
  *                  type: string
  *                  description: Explaination message
  *              success:
  *                  type: boolean
  *                  description: flag for success
  *          example:
  *              "status": 200
  *              "data":  
  *                 - "_id": "6634123be6dc48f6f86e23d"
  *                   "name": "Awesome House on Beach"
  *                   "propertyType": "Villa"
  *                   "address": 
  *                       "country": "Canada"
  *                       "state": "Ontario"
  *                       "city": "Waterloo"
  *                       "street": "350 Columbia Street West"
  *                       "unitNum": "92" 
  *                       "postalCode": "N2L 6G8"                    
  *                   "overallRating": 4.0
  *                   "pictures": ['http://pichostedonsomesite.jpg']
  *                 - "_id": "62301937be6dc48f6f86e23d"
  *                   "name": "Bad House on Sea"
  *                   "propertyType": "Apartment"
  *                   "address": 
  *                       "country": "Canada"
  *                       "state": "British Columbia"
  *                       "city": "Some City"
  *                       "street": "350 Some Street West"
  *                       "unitNum": "92" 
  *                       "postalCode": "N2L 6G8"                    
  *                   "overallRating": 4.0
  *                   "pictures": ['http://pichostedonsomesite.jpg']
  *              "message": "success"
  *              "success": true
  *
  */



  /**
   * @swagger
   * /admin/judge/review/{parent_property_id}/{review_id}:
   *  post:
   *      summary: Approving/Rejecting reviews
   *      tags: [Admin APIs]
   *      security:
   *          - bearerAuth: []
   *      description: >-
   *         This api takes in a query parameter as follows
   *         **"http://baseUrl/admin/judge/review/{parent_property_id}/{review_id}?decision={approve/reject}"** 
   *      parameters:
   *          - in: query
   *            name: decision
   *            schema:
   *              type: string
   *      responses:
   *          200:
   *              description: Returns reviews that have been flagged above the max-flag limit
   *              content:
   *                  application/json
   *
   */
router
  .route("/judge/review/:parent_property_id/:review_id")
  .post(validateToken,authRole(ROLE.ADMIN),catchAsync(admin.judgeReview));


  /**
   * @swagger
   * /admin/judge/property/{property_id}:
   *  post:
   *      summary: Approving/Rejecting a property
   *      tags: [Admin APIs]
   *      security:
   *         - bearerAuth: []
   *      description: >-
   *          This api takes in a query parameter as follows
   *          **"http://baseUrl/admin/judge/property/{property_id}?decision={approve/reject}"** 
   *      parameters:
   *          - in: query
   *            name: decision
   *            schema:
   *              type: string
   *      responses:
   *          200:
   *              description: Successfully approved review
   *              content:
   *                  application/json
   * 
   */ 
router
  .route("/judge/property/:property_id")
  .post(validateToken,authRole(ROLE.ADMIN),catchAsync(admin.judgeProperty))


  /**
   * @swagger
   * /admin/properties:
   *  get:
   *      summary: Getting all properties that have not been approved
   *      security:
   *          - bearerAuth: []
   *      tags: [Admin APIs]
   *      responses:
   *          '200':
   *            description: Returns all properties yet to be approved
   *            content:
   *              application/json:  
   *                schema:
   *                  $ref: '#/components/schemas/NonApprovedPropertyList'
   *
   */
router
  .route("/properties")
  .get(validateToken,authRole(ROLE.ADMIN),catchAsync(admin.fetchProperties));


  /**
   * @swagger
   * /admin/reviews:
   *  get:
   *      summary: Get all flagged reviews
   *      tags: [Admin APIs]
   *      security:
   *          - bearerAuth: []
   *      responses:
   *          '200':
   *            description: When search returns a result
   *            content:
   *              application/json:  
   *                schema:
   *                  $ref: '#/components/schemas/FlaggedReviewList'
   *
   */
router
  .route("/reviews")
  .get(validateToken,authRole(ROLE.ADMIN),catchAsync(admin.fetchFlagreviews));

module.exports = router;
