class Success {
    constructor(statusCode = 200, status = "Success", message = "" , isToastMessage = false, data = []) {
        this.statusCode = statusCode;
        this.status = status;
        this.messageData = message;
        this.isToastMessage = isToastMessage;
        this.data = data;
    }
}

module.exports = Success;
