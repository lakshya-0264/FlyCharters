import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiError } from "../../Helpers/apierror.js";
import { Operator_Model } from "../../Models/operatorModel.js";
import { uploadfile } from "../../Helpers/cloudinary_utils/cloud_utils.js";
import User from "../../Models/userModel.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { DocumentReceivedemail, DocumentVerificationemail, DocumentVerificationRejectionemail } from "../../Helpers/email.js";
const getOperatorbyId = asynchandler(async (req, res) => {
    const { operator_id } = req.params
    const operator = await Operator_Model.findById(operator_id).populate("operatorid")
    if (!operator) {
        throw new ApiError(400, "Operator not found")
    }
    return res.json(new ApiResponse(200, true, "operator fetched successfully", operator))
})
const getOperator_login_user=asynchandler(async(req,res)=>{
    const operator=await Operator_Model.findOne({operatorid:req.user._id}).populate("operatorid")
    if(!operator){
        return res.json(new ApiResponse(400,false,"failed to fetch operator id"))
    }
    return res.json(new ApiResponse(200,true,"operator fetched successfully",operator))
})
const getAllOperators = asynchandler(async (req, res) => {
    const operators = await Operator_Model.find().populate("operatorid")
    if (!operators) {
        throw new ApiError(400, "Operators not found")
    }
    return res.json(new ApiResponse(200, true, "all operator fetched successfully", operators))
})
const createOperator = asynchandler(async (req, res) => {
    const { name, pointOfContact, location, aopNo, aopValidity, numAircraft, nsopBase,company_name} = req.body;

    if (!name || !pointOfContact || !location || !aopNo || !aopValidity || !numAircraft || !nsopBase || !company_name) {
        throw new ApiError(400, "All fields (Name, Point of Contact, Location, AOP No, Validity, No. of Aircraft, NSOP Base) are required");
    }

    if (!req.files || req.files.length === 0) {
        throw new ApiError(400, "Documents images are missing");
    }

    let document_response = [];
    for (let i = 0; i < req.files.length; i++) {
        const file = await uploadfile(req.files[i].path);
        document_response.push(file.url);
    }
    const Operator = await Operator_Model.create({
        operatorid: req.user._id,
        uploaded_time: Date.now(),
        documents: document_response,
        name,
        pointOfContact,
        location,
        aopNo,
        aopValidity,
        numAircraft,
        nsopBase,
        company_name:company_name
    });
    await DocumentReceivedemail(req.user.email);
    return res.json(new ApiResponse(200, true, "Operator created successfully"));
});
const getOptDetailsByOperator=asynchandler(async(req,res)=>{
    const {operator_id}=req.params
    if(!operator_id){
        throw new ApiError(400,"Operator_id not found")
    }
    const document = await Operator_Model.find({ operatorid: operator_id });
    if(!document){
        throw new ApiError(404,"No document found for this operator")
    }
    return res.json(new ApiResponse(200,true,"document of operator",document))
})
const deleteOperator = asynchandler(async (req, res) => {
    const { operator_id } = req.params
    const deleted_operator = await Operator_Model.findOneAndDelete({ _id: operator_id })
    if (!deleted_operator) {
        throw new ApiError(400, "Operator not found")
    }
    return res.json(new ApiResponse(200, true, "operator deleted successfully"))

})
const verify_document = asynchandler(async (req, res) => {
    const { operator_id } = req.params
    const operator = await Operator_Model.findById(operator_id).populate("operatorid")
    if (!operator) {
        throw new ApiError(400, "Operator not found")
    }
    const update_document = await Operator_Model.findByIdAndUpdate(operator_id,
        {
            $set: {
                verified_documents: true,
                verified_time: Date.now()
            }
        }
    )
    if (!update_document) {
        throw new ApiError(500, "some error while verifying the updation")
    }
    await DocumentVerificationemail(operator.operatorid.email, operator.uploaded_time)
    return res.json(new ApiResponse(200, true, "document verification process is done", update_document))
})
const reject_document = asynchandler(async (req, res) => {
    const { operator_id } = req.params
    const { rejection_reason } = req.body
    if (!operator_id || !rejection_reason) {
        throw new ApiError(500, "rejection error is missing")
    }
    const operator = await Operator_Model.findById(operator_id).populate("operatorid")
    if (!operator) {
        throw new ApiError(400, "Operator not found")
    }
    const update_document = await Operator_Model.findByIdAndUpdate(operator_id,
        {
            $set: {
                verified_documents: false,
                rejection_reason: rejection_reason
            }
        }
    )
    if (!update_document) {
        throw new ApiError(500, "some error while rejecting the updation")
    }
    await DocumentVerificationRejectionemail(operator.operatorid.email, operator.uploaded_time)
    return res.json(new ApiResponse(200, true, "document rejected successfully", update_document))
})
// Add this function to your operator.controller.js file

const getPendingVerifications = asynchandler(async (req, res) => {
    // Pending operators are those that haven't been verified AND don't have a rejection reason
    const pendingOperators = await Operator_Model.find({
        $and: [
            { verified_documents: { $ne: true } },
            { rejection_reason: { $exists: false } }
        ]
    }).populate("operatorid");
    
    return res.json(new ApiResponse(200, true, "Pending verifications fetched successfully", pendingOperators));
});

const getVerifiedOperators = asynchandler(async (req, res) => {
    const verifiedOperators = await Operator_Model.find({
        verified_documents: true
    }).populate("operatorid");
    
    return res.json(new ApiResponse(200, true, "Verified operators fetched successfully", verifiedOperators));
});

const getRejectedOperators = asynchandler(async (req, res) => {
    // Rejected operators are those that have been explicitly rejected with a reason
    const rejectedOperators = await Operator_Model.find({
        $and: [
            { verified_documents: { $ne: true } },
            { rejection_reason: { $exists: true } }
        ]
    }).populate("operatorid");
    
    return res.json(new ApiResponse(200, true, "Rejected operators fetched successfully", rejectedOperators));
});

const getOperatorStats = asynchandler(async (req, res) => {
    const totalOperators = await Operator_Model.countDocuments();
    const verifiedCount = await Operator_Model.countDocuments({ verified_documents: true });
    
    // Pending: not verified AND no rejection reason
    const pendingCount = await Operator_Model.countDocuments({ 
        $and: [
            { verified_documents: { $ne: true } },
            { rejection_reason: { $exists: false } }
        ]
    });
    
    // Rejected: not verified AND has rejection reason
    const rejectedCount = await Operator_Model.countDocuments({ 
        $and: [
            { verified_documents: { $ne: true } },
            { rejection_reason: { $exists: true } }
        ]
    });
    
    const stats = {
        total: totalOperators,
        verified: verifiedCount,
        pending: pendingCount,
        rejected: rejectedCount
    };
    
    return res.json(new ApiResponse(200, true, "Operator statistics fetched successfully", stats));
});

const bulkVerifyOperators = asynchandler(async (req, res) => {
    const { operator_ids } = req.body;
    
    if (!operator_ids || !Array.isArray(operator_ids) || operator_ids.length === 0) {
        throw new ApiError(400, "Operator IDs array is required");
    }
    
    const bulkUpdate = await Operator_Model.updateMany(
        { _id: { $in: operator_ids } },
        {
            $set: {
                verified_documents: true,
                verified_time: Date.now()
            }
        }
    );
    
    // Send emails to all verified operators
    const operators = await Operator_Model.find({ _id: { $in: operator_ids } }).populate("operatorid");
    
    for (const operator of operators) {
        await DocumentVerificationemail(operator.operatorid.email, operator.uploaded_time);
    }
    
    return res.json(new ApiResponse(200, true, `${bulkUpdate.modifiedCount} operators verified successfully`));
});

const searchOperators = asynchandler(async (req, res) => {
    const { query, status } = req.query;
    
    let searchFilter = {};
    
    if (query) {
        searchFilter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { aopNo: { $regex: query, $options: 'i' } }
        ];
    }
    
    if (status) {
        if (status === 'verified') {
            searchFilter.verified_documents = true;
        } else if (status === 'pending') {
            // Pending: not verified AND no rejection reason
            searchFilter.$and = [
                { verified_documents: { $ne: true } },
                { rejection_reason: { $exists: false } }
            ];
        } else if (status === 'rejected') {
            // Rejected: not verified AND has rejection reason
            searchFilter.$and = [
                { verified_documents: { $ne: true } },
                { rejection_reason: { $exists: true } }
            ];
        }
    }
    
    const operators = await Operator_Model.find(searchFilter).populate("operatorid");
    
    return res.json(new ApiResponse(200, true, "Search results fetched successfully", operators));
});
// Export all functions (add these to your existing exports)
export { 
    getAllOperators, 
    getOperatorbyId, 
    deleteOperator, 
    createOperator, 
    verify_document,
    reject_document,
    getOperator_login_user,
    getOptDetailsByOperator,
    getPendingVerifications,
    getVerifiedOperators,
    getRejectedOperators,
    getOperatorStats,
    bulkVerifyOperators,
    searchOperators
}