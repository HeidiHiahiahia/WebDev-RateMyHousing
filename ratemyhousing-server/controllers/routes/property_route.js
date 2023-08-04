"use strict";
const express = require("express");
const property = require('../property');
const catchAsync = require('../../utils/catchAsync');
const { validateToken, authRole } = require("../auth");
const { ROLE } = require("../../models/roles");
const router = express.Router();
const auth = require('../auth').validateToken;



/**
 * @swagger
 * tags:
 *  name: Property APIs
 *  description: Property CRUD docs
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
  *      readProperty:
  *          type: object
  *          required:
  *              - property ID
  *          properties:
  *              property_ID:
  *                  type: string
  *                  description: Get the property with the given property id
  *          example:
  *              property ID: 6211b5b3db8a7c19561c2202
  *
  *      createProperty:
  *          type: object
  *          required:
  *              - property
  *          properties:
  *              property:
  *                  type: property_schema
  *                  description: All details of a property that need to be insert to database, the minimal required field is propertyType, address, state, city, street, and postalCode
  *          example:
  *              "name": "myproperty"
  *              "propertyType": "house"
  *              "landlord": "houseOwner1"
  *              "propertyManagement": "accomod8me"
  *              "propertyWebsite": "owner@test.com"
  *              "address":
  *                  "country": "Canada"
  *                  "state": "ON"
  *                  "city": "waterloo"
  *                  "street": "Albert street"
  *                  "unitNum": "1"
  *                  "postalCode": "n4l2t7"
  *              "cost": 1000
  *              "amenities":
  *                 - "amenity": "Pool"
  *                   "available": false
  *              "pictures": ["pic1"]
  *
  *      updateProperty:
  *          type: object
  *          required:
  *              - property ID
  *              - property
  *          properties:
  *              property_ID:
  *                  type: string
  *                  description: Using the propertyID to update the property
  *              property:
  *                  type: property_schema
  *                  description: All details of a property that need to be insert to database, the minimal required field is propertyType, address, state, city, street, and postalCode
  *          example:
  *              "_id": 6211b5b3db8a7c19561c2202
  *              "name": "myproperty"
  *              "propertyType": "house"
  *              "address":
  *                  "country": "Canada"
  *                  "state": "ON"
  *                  "city": "waterloo"
  *                  "street": "Albert street"
  *                  "unitNum": "1"
  *                  "postalCode": "n4l2t7"
  *              "cost": 1000
  *              "overallRating": 2.5
  *              "amenitiesList":
  *                 - "amenity": "Pool"
  *                   "available": false
  *              "ratingDetails":
  *                   "awesome": 1
  *                   "great": 1
  *                   "good": 0
  *                   "ok": 3
  *                   "aweful": 1
  *              "pictures": ["pic1"]
  *              "reviews": ["somereview"]
  *
  *      deleteProperty:
  *          type: object
  *          required:
  *              -  Property_ID
  *          properties:
  *              property_ID:
  *                  type: string
  *                  description: Get the property with the given property id
  *          example:
  *              property ID: 6211b5b3db8a7c19561c2202
  *
  */


  /**
   * @swagger
   * /property/{id}:
   *  get:
   *      summary: Getting the specific property with given id
   *      tags: [Property APIs]
   *      responses:
   *          200:
   *              description: Get property successful
   *              content:
   *                  application/json:
   *                    schema:
   *                      $ref: '#/components/schemas/readProperty'
   *
   */
router
  .route("/:id")
  .get(catchAsync(property.readProperty));


  /**
   * @swagger
   * /property:
   *  post:
   *      summary: Create the property with given property details
   *      tags: [Property APIs]
   *      security:
   *          - bearerAuth: []
   *      parameters:
   *          - in: body
   *            name: Property POST API
   *            schema:
   *                $ref: '#/components/schemas/createProperty'
   *      responses:
   *          201:
   *              description: Add property successful
   *              content:
   *                  application/json
   */
router
  .route("/")
  .post(validateToken,catchAsync(property.createProperty));

  /**
   * @swagger
   * /property/{id}:
   *  put:
   *      summary: Update the property with given property details
   *      tags: [Property APIs]
   *      parameters:
   *          - in: body
   *            name: Property PUT API
   *            schema:
   *                $ref: '#/components/schemas/updateProperty'
   *      responses:
   *          200:
   *              description: Update property successful
   *              content:
   *                  application/json
   */
router
  .route("/:id")
  .put(catchAsync(property.updateProperty));

  /**
   * @swagger
   * /property/{id}:
   *  delete:
   *      summary: Delete the property with given id
   *      tags: [Property APIs]
   *      parameters:
   *          - in: body
   *            name: Property DELETE API
   *            schema:
   *                $ref: '#/components/schemas/deleteProperty'
   *      responses:
   *          200:
   *              description: Delete property successful
   *              content:
   *                  application/json
   */
router
  .route("/:id")
  .delete(catchAsync(property.deleteProperty));

module.exports = router;
