"use strict";
const express = require('express');
const catchAsync = require('../../utils/catchAsync');
const { sendMail } = require('../../utils/mailer');
const { validateToken } = require('../auth');
const { resetPassword, sendResetPasswordLink } = require('../user');
const router = express.Router();
/**
 * @swagger
 * tags:
 *  name: User APIs
 *  description: User API docs
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
 *      ForgotPasswordRequest:
 *          type: object
 *          required:
 *              - email
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email of the user requesting password reset
 *          example:
 *              email: example@test.com
 *      ForgotPasswordResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: Number 
 *                  description: Status code
 *              message:
 *                  type: string
 *                  description: Reason message
 *              success:
 *                  type: Boolean
 *                  description: Success flag
 *          example:
 *              status: 200
 *              message: Mail sent successfully to user
 *              success: true
 * 
 *      ResetPassRequest:
 *          type: object
 *          required:
 *              - newPass
 *          properties:
 *              newPass:
 *                  type: string
 *                  description: The new password the user wants
 *          example:
 *              newPass: test@123
 *      ResetPassResponse:
 *          type: object
 *          properties:
 *              status:
 *                  type: Number 
 *                  description: Status code
 *              message:
 *                  type: string
 *                  description: Reason message
 *              success:
 *                  type: Boolean
 *                  description: Success flag
 *          example:
 *              status: 200
 *              message: Password reset successfully
 *              success: true
 */


/**
 * @swagger
 * /user/forgotPassword:
 *  post:
 *      summary: Allows client to get a new access token
 *      tags: [User APIs]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: body
 *            name: RefreshToken
 *            schema:
 *               $ref: '#/components/schemas/ForgotPasswordRequest'
 *      responses:
 *          200:
 *              description: Token generation was successful
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/ForgotPasswordResponse'
 * 
 */

 
router
  .route("/forgotPassword")
  .post((req,res,next) => {
   catchAsync(sendResetPasswordLink(req,res,next,sendMail));
});


/**
 * @swagger
 * /user/resetPassword:
 *  post:
 *      summary: Allow user with valid token to password
 *      tags: [User APIs]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: body
 *            name: newPass
 *            schema:
 *               $ref: '#/components/schemas/ResetPassRequest'
 *      responses:
 *          200:
 *              description: Token generation was successful
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/ResetPassResponse'
 * 
 */
router
  .route("/resetPassword")
  .post(validateToken,catchAsync(resetPassword));

module.exports = router;
