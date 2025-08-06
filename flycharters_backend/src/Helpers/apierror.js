class ApiError extends Error {
    constructor(statuscode, message = "Something went wrong", details = null) {
        super(message);
        this.statuscode = statuscode;
        this.message = message;
        this.success = false;
        if (details) {
            this.details = details;
        }
    }
}

export { ApiError };
