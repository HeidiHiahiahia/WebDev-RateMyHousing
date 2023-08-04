/**
 * Documentation structure-
 * https://swagger.io/docs/specification/2-0/basic-structure/
 */
 "use strict";
const config = require('config');
const port  = config.get('app.port');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan')
const auth = require('./controllers/routes/auth');
const property_route = require('./controllers/routes/property_route');
const search_route = require('./controllers/routes/search_route');
const review_route = require('./controllers/routes/review_route');
const flag_route = require('./controllers/routes/flag_route');
const admin_route = require('./controllers/routes/admin_route');
const user_route = require('./controllers/routes/user_route');
const ServerError = require('./utils/errors/serverError');
const ErrorResponseBody = require('./utils/errorResp');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();


app.use(express.json());
app.use(cors());

app.use(morgan('tiny'));


app.get("/",(req,res)=>{
    res.json({
        title: "RatemyHousing Backend"
    })
})

app.use('/auth',auth);

app.use("/property", property_route);

app.use('/search', search_route);

app.use('/review', review_route);

app.use('/flag', flag_route);

app.use('/admin', admin_route);

app.use('/user', user_route);

/**Documentation route */
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "RMH Server API",
			version: "1.0.0",
			description: "Backend APIs for RatemyHousing",
		},
		servers: [
			{
				url: `http://34.218.112.35:${port}`,
			},
		],
	},
	apis: ["./controllers/routes/*.js"],
};

const spec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

/**********Error Handling********/

//Error handler for invalid routes
app.all('*',(req,res,next)=>{
  next(new ServerError(404,"Route Not Found"));
});

//General error handler function for any internal errors while performing db operations
app.use((err,req,res,next)=>{
    console.log(err);
    let error;
    const {status,  statusCode = 500 , message = "Internal Server Error"} = err;
    error = new ErrorResponseBody(status,message,false);
    res.status(statusCode).json(error);
})

module.exports = app;
