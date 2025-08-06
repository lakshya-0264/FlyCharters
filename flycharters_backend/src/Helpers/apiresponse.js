class ApiResponse{
    constructor(status,success,Message,data){
        this.status=status,
        this.success=success,
        this.Message=Message,
        this.data=data
    }
}
export {ApiResponse}