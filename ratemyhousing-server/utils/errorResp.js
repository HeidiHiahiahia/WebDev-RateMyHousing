class ErrorResponseBody {
    constructor(status,message,success){
        this.status = status;
        this.message = message;
        this.success = success;
    }
}

module.exports = ErrorResponseBody