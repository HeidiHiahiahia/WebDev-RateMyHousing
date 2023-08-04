const router = require('express').Router();
const { ROLE } = require('../../models/roles');
const catchAsync = require('../../utils/catchAsync');
const authController = require('../auth');

//TODO: Suhail: 13th Feb2022 -> user role permission


/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: User management APIs
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
 *      RefreshToken:
 *          type: object
 *          required:
 *              - token
 *          properties:
 *              token:
 *                  type: string
 *                  description: Refresh token of the currently logged in user
 *          example:
 *              token: 3c48m132u9-09c1rucm01cnrm1304mu01cu48m14c18
 * 
 *      UserLogout:
 *          type: object
 *          required:
 *              - token
 *          properties:
 *              token:
 *                  type: string
 *                  description: Bearer token of the currently logged in user
 *          example:
 *              token: 3c48m132u9-09c1rucm01cnrm1304mu01cu48m14c18
 *      UserLogin:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: A unique identifier for each user
 *              password:
 *                  type: string
 *                  description: Account password
 *          example:
 *              email: john@test.com
 *              password: john123
 * 
 *      UserLogoutResponse:
 *          type: object
 *          required:
 *              - token
 *              - refreshToken
 *          properties:
 *              message: string
 *              status: Number
 *              token:
 *                  type: string
 *                  description: User access token with limited validity
 *              refreshToken:
 *                  type: string
 *                  description: User refresh token to obtain new access tokens
 *          example:
 *              status: 200
 *              data: 
 *                  deletedToken: 6a48m132u9-09c1rucm01cnrm1304mu01cu48m14c093
 *              message: Logout Success!
 *              success: true
 *      UserLoginResponse:
 *          type: object
 *          required:
 *              - token
 *              - refreshToken
 *          properties:
 *              message: string
 *              status: Number
 *              token:
 *                  type: string
 *                  description: User access token with limited validity
 *              refreshToken:
 *                  type: string
 *                  description: User refresh token to obtain new access tokens
 *          example:
 *              status: 200
 *              data: 
 *                  token: 3c48m132u9-09c1rucm01cnrm1304mu01cu48m14c18
 *                  refreshToken: 6a48m132u9-09c1rucm01cnrm1304mu01cu48m14c093
 *              message: reason message
 *              success: true
 *      RefreshTokenResponse:
 *          type: object
 *          required:
 *              - token
 *              - refreshToken
 *          properties:
 *              message: string
 *              status: Number
 *              token:
 *                  type: string
 *                  description: User access token with limited validity
 *          example:
 *              status: 200
 *              data: 
 *                  token: 3c48m132u9-09c1rucm01cnrm1304mu01cu48m14c18
 *              message: New access token generated
 *              success: true
 * 
 *      UserSignUp:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              name:
 *                  type: string 
 *                  description: Username for the user
 *              email:
 *                  type: string
 *                  description: A unique identifier for each user
 *              password:
 *                  type: string
 *                  description: Account password
 *              phone:
 *                  type: string
 *                  description: User phone number
 *          example:
 *              name: john
 *              email: john@test.com
 *              password: john123
 *              phoneNo: "123-456-789"
 * 
 *      UserSignUpResponse:
 *          type: object
 *          required:
 *              - email
 *              - password
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
 *              status: 201
 *              message: User creation success
 *              success: true
 * 
 * 
 */


router.use(function(req,res,next) {
    console.log(`Accessing auth route..${Date.now()}`);
    next();
});


/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Allows user login functionality
 *      tags: [Authentication]
 *      parameters:
 *          - in: body
 *            name: UserLogin
 *            schema:
 *                $ref: '#/components/schemas/UserLogin'
 *      responses:
 *          200:
 *              description: User login was successfull
 *              content:
 *                  application/json:
 *                   schema:
 *                    $ref: '#/components/schemas/UserLoginResponse'
 * 
 */
router.route('/login')
.post(catchAsync(authController.loginUser));


/**
 * @swagger
 * /auth/logout:
 *  post:
 *      summary: Allows user logout functionality
 *      tags: [Authentication]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: body
 *            name: UserLogout
 *            schema:
 *                $ref: '#/components/schemas/UserLogout' 
 *      responses:
 *          200:
 *              description: User logout was successfull
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/UserLogoutResponse'
 * 
 */
 router.route('/logout')
 .post(catchAsync(authController.logoutUser));
 

/**
 * @swagger
 * /auth/signup:
 *  post:
 *      summary: Allows user to signup to RMH
 *      tags: [Authentication]
 *      parameters:
 *          - in: body
 *            name: UserSignUp
 *            schema:
 *               $ref: '#/components/schemas/UserSignUp'
 *      responses:
 *          200:
 *              description: User login was successfull
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/UserSignUpResponse'
 * 
 */
router.route('/signup')
.post(catchAsync(authController.createUser));

/**
 * @swagger
 * /auth/token:
 *  post:
 *      summary: Allows client to get a new access token
 *      tags: [Authentication]
 *      parameters:
 *          - in: body
 *            name: RefreshToken
 *            schema:
 *               $ref: '#/components/schemas/RefreshToken'
 *      responses:
 *          200:
 *              description: Token generation was successful
 *              content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/RefreshTokenResponse'
 * 
 */
router.route('/token')
.post(catchAsync(authController.refreshToken));


if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
    router
      .route("/admintest")
      .get(authController.validateToken,authController.authRole(ROLE.ADMIN),(req,res)=>{
        res.status(200).json("Success");
      });
  }

module.exports = router;