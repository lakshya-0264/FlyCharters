import Router from "express"
import { uploadfile } from "../../Helpers/cloudinary_utils/cloud_utils.js";
import multer from "multer";
import { add_empty_booking,getAllEmptyLegBookings,getBookingById,getBookingbyFilter,confirmBookingStatus,after_payment_booking,cancellation_empty_leg,} from "../../Controllers/empty_leg_booking_controller/empty_leg_booking.js"
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js"
const EmptyLegBookingRouter=Router()

const upload = multer({ dest: "uploads/" });

EmptyLegBookingRouter.post("/book/:empty_leg_id", authmiddleware,upload.fields([{ name: "vaccinationCertificate", maxCount: 1 }]), add_empty_booking);
EmptyLegBookingRouter.get("/user",authmiddleware, getAllEmptyLegBookings);
EmptyLegBookingRouter.get("/:bookingId",authmiddleware, getBookingById);
EmptyLegBookingRouter.patch("/confirm/:id",authmiddleware, confirmBookingStatus);
EmptyLegBookingRouter.get("/filter",authmiddleware, getBookingbyFilter);
EmptyLegBookingRouter.patch("/after-payment/:emptyleg_id",authmiddleware, after_payment_booking);
EmptyLegBookingRouter.patch("/cancel/:empty_leg_id",authmiddleware, cancellation_empty_leg);
export {EmptyLegBookingRouter}