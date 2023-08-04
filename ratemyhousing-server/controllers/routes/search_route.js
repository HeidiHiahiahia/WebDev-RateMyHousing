"use strict";
const express = require('express');
const search = require('../search');
const catchAsync = require('../../utils/catchAsync');
const router = express.Router();
/**
 * @swagger
 * tags:
 *  name: Search
 *  description: Search docs
 */

  /**
  *@swagger
  *components:
  *  schemas:
  *      searchResponse:
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
   * /search:
   *  get:
   *      summary: Search for properties using any keywords in address
   *      description: >-
   *         This api takes in a query parameter as follows
   *         **"http://baseUrl/search?q=Anything"** 
   *      tags: [Search]
   *      parameters:
   *          - in: query
   *            name: q
   *            schema:
   *              type: string
   *      responses:
   *          '200':
   *            description: When search returns a result
   *            content:
   *              application/json:  
   *                schema:
   *                  $ref: '#/components/schemas/searchResponse'
   *
   */
 
router
  .route("/")
  .get(catchAsync(search.searchProperty));


module.exports = router;
