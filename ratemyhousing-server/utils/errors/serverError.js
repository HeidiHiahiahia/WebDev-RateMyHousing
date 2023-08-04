class ServerError extends Error {
    constructor(status,statusCode,message){
        super(message);
        this.statusCode = statusCode //general http code
        this.status = status; //internal code
        this.message = message;
    }
}

module.exports = ServerError;