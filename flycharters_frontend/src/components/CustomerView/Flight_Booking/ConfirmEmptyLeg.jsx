import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import confirmingAnimation from "../../../assets/ConfirmingLottie.json";
import { toast } from "react-toastify";
import {
  FaPlane, FaUser, FaRupeeSign, FaCalendarAlt, FaClock,
  FaEnvelope, FaPhone, FaPassport, FaGlobe, FaPaw, FaBuilding,  FaFileMedical, FaFileAlt
} from "react-icons/fa";
import InvoiceCard from "./InvoiceCard";

const Detail = ({ label, icon, value }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <span style={{
      fontWeight: 600, color: "#061953", display: "flex",
      alignItems: "center", gap: "6px", marginBottom: "4px"
    }}>
      {icon} {label}
    </span>
    <span style={{ color: "#222" }}>{value || "-"}</span>
  </div>
);

const Modal = ({ title, details, onClose }) => (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex",
    justifyContent: "center", alignItems: "center"
  }}>
    <div style={{
      background: "#fff", padding: "30px", borderRadius: "14px",
      maxWidth: "500px", width: "90%", boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
      position: "relative"
    }}>
      <h3 className="flex justify-center" style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px", color: "#061953" }}>{title}</h3>
      <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr" }}>
        {details}
      </div>
      <div className="flex justify-center">
        <button
        onClick={onClose}
        style={{
          marginTop: "20px", backgroundColor: "#061953", color: "#fff",
          padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer"
        }}
      >
        Close
      </button>
      </div>
    </div>
  </div>
);

const ConfirmEmptyLeg = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  const [showPetModal, setShowPetModal] = useState(false);
  const [showCorporateModal, setShowCorporateModal] = useState(false);

  useEffect(() => { fetchBooking(); }, [state?.bookingId]);

  const fetchBooking = async () => {
    if (!state?.bookingId) return;
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_BASE_URL + `/emptylegbooking/${state.bookingId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
      );
      setBookingData(res.data.data);
    } catch {
      toast.error("Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData?._id) return;
    try {
      const res = await axios.patch(
        import.meta.env.VITE_API_BASE_URL + `/emptylegbooking/confirm/${bookingData._id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
      );
      if (res?.data?.data?.booking_status === "confirmed") {
        toast.success("Booking confirmed!");
        fetchBooking();
      } else toast.error("Something went wrong while confirming.");
    } catch (err) {
      toast.error("Failed to confirm booking.");
    }
  };

  const handlePayNow = async () => {
    if (!bookingData?._id) return;
    setIsPaying(true);
    try {
      await axios.patch(
        import.meta.env.VITE_API_BASE_URL + `/emptylegbooking/after-payment/${bookingData._id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, withCredentials: true }
      );
      toast.success("Payment successful!");
      navigate("/user/booking-success");
    } catch {
      toast.error("Payment failed!");
    } finally {
      setIsPaying(false);
      fetchBooking();
    }
  };

  if (loading) return <h3 style={{ textAlign: "center", marginTop: "100px" }}>Loading booking details...</h3>;

  const isConfirmed = bookingData.booking_status === "confirmed";
  const paymentDone = bookingData.payment_status === "paid";
  const flight = bookingData.empty_leg_id;
  const from = flight.takeOff_Airport;
  const to = flight.destination_Airport;

  const hasPetDetails = bookingData?.petDetails?.isPet;
  const hasCorporateDetails = bookingData?.corporateDetails?.isCorporate;

  const petModalContent = bookingData.petDetails && (
    <>
      <Detail label="Pet Type" icon={<FaPaw />} value={bookingData.petDetails.type} />
      {bookingData.petDetails.type === "Other" && (
        <Detail label="Specify" icon={<FaPaw />} value={bookingData.petDetails.specify} />
      )}
      <Detail label="Agreed to Pet Policy" icon={<FaPaw />} value={bookingData.petDetails.agreePetPolicy ? "Yes" : "No"} />
      {bookingData.petDetails.sitToTravelCertificateDate && (
        <Detail label="Sit-to-Travel Certificate (Issued Date)" icon={<FaPaw />} value={new Date(bookingData.petDetails.sitToTravelCertificateDate).toLocaleDateString()} />
      )}
      {bookingData.petDetails.vaccinationCertificate && (
        <Detail label="Uploaded Vaccination Certificate" icon={<FaPaw />} value={
          <a href={bookingData.petDetails.vaccinationCertificate} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
            View Document
          </a>
        } />
      )}
    </>
  );

  const corporateModalContent = bookingData.corporateDetails && (
    <>
      <Detail label="Company Name" icon={<FaBuilding />} value={bookingData.corporateDetails.companyName} />
      <Detail label="Company ID / GST" icon={<FaBuilding />} value={bookingData.corporateDetails.companyId} />
    </>
  );

  return (
    <div style={{
      padding: "40px 20px", display: "flex", flexWrap: "wrap",
      justifyContent: "center", gap: "50px"
    }}>
      {isPaying ? (
        <div style={{ textAlign: "center", width: "100%" }}>
          <Lottie animationData={confirmingAnimation} loop style={{ width: "300px", margin: "0 auto" }} />
          <h3 style={{ marginTop: "20px", color: "#061953" }}>Processing Payment...</h3>
        </div>
      ) : (
        <>
          <div style={{
            background: "#fff", borderRadius: "14px", padding: "40px",
            width: "850px", boxShadow: "0 10px 24px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0"
          }}>
            <h2 className="flex justify-center text-2xl"  style={{ color: "#061953", fontWeight: "bold", marginBottom: "30px" }}>✈️ Booking Confirmation</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div><strong>{from.source_IATA}</strong><div>{from.airport_name}</div></div>
              <FaPlane />
              <div><strong>{to.source_IATA}</strong><div>{to.airport_name}</div></div>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px",
              background: "#f8f9ff", padding: "18px", borderRadius: "10px", marginBottom: "20px"
            }}>
              <Detail label="Departure Date" icon={<FaCalendarAlt />} value={new Date(flight.departureDate).toLocaleDateString()} />
              <Detail label="Departure Time" icon={<FaClock />} value={flight.departureTime} />
              <Detail label="Arrival Date" icon={<FaCalendarAlt />} value={new Date(flight.arrivalDate).toLocaleDateString()} />
              <Detail label="Arrival Time" icon={<FaClock />} value={flight.arrivalTime} />
              <Detail label="Seats Booked" icon={<FaUser />} value={bookingData.seats_booked} />
              <Detail label="Base Amount" icon={<FaRupeeSign />} value={`₹${bookingData.total_amount.toLocaleString()}`} />
            </div>

            {/* Passengers */}
            <h3 style={{ color: "#061953", marginBottom: "12px" }}>👥 Passenger Details</h3>
            {bookingData.passengerDetails.map((p, idx) => (
              <div key={idx} style={{
                border: "1px solid #e2e8f0", borderRadius: "10px",
                padding: "16px", marginBottom: "16px", background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>Passenger {idx + 1}</strong>
                  <span style={{
                    background: "#eef2ff", padding: "4px 10px",
                    borderRadius: "8px", fontSize: "0.8rem"
                  }}>{p.gender}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                  <Detail label="Name" icon={<FaUser />} value={p.name} />
                  {p.email && <Detail label="Email" icon={<FaEnvelope />} value={p.email} />}
                  {p.phone && <Detail label="Phone" icon={<FaPhone />} value={p.phone} />}
                  {p.passport && <Detail label="Passport" icon={<FaPassport />} value={p.passport} />}
                  <Detail label="Nationality" icon={<FaGlobe />} value={p.nationality} />
                </div>
              </div>
            ))}

            {/* Pet & Corporate Summary */}
            <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
              {hasPetDetails && (
                <div style={{ background: "#f1f5ff", padding: "10px 16px", borderRadius: "10px" }}>
                  Pet is travelling: <button onClick={() => setShowPetModal(true)} style={{ color: "#2563eb", marginLeft: "8px", fontWeight: 600, cursor: "pointer" }}>View Details</button>
                </div>
              )}
              {hasCorporateDetails && (
                <div style={{ background: "#f1f5ff", padding: "10px 16px", borderRadius: "10px" }}>
                  Corporate Booking: <button onClick={() => setShowCorporateModal(true)} style={{ color: "#2563eb", marginLeft: "8px", fontWeight: 600, cursor: "pointer" }}>View Details</button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "flex", justifyContent: "space-between", marginTop: "30px"
            }}>
              <button onClick={() => navigate("/user")} style={{
                backgroundColor: "#fff", color: "#ef4444",
                border: "1px solid #ef4444", padding: "10px 24px",
                borderRadius: "8px", fontWeight: 600, cursor: "pointer"
              }}>Cancel</button>
              <button onClick={handleConfirmBooking} disabled={isConfirmed} style={{
                background: isConfirmed ? "#ccc" : "#061953",
                color: "#fff", padding: "10px 24px", borderRadius: "8px",
                fontWeight: 600, cursor: isConfirmed ? "not-allowed" : "pointer"
              }}>{isConfirmed ? "Confirmed" : "Confirm Booking"}</button>
            </div>
          </div>

          <InvoiceCard
            from={from}
            to={to}
            bookingData={bookingData}
            addonsCharge={bookingData.addons_charge || 0}
            isConfirmed={isConfirmed}
            paymentDone={paymentDone}
            handlePayNow={handlePayNow}
          />

          {showPetModal && <Modal title="Pet Travel Details" details={petModalContent} onClose={() => setShowPetModal(false)} />}
          {showCorporateModal && <Modal title="Corporate Booking Details" details={corporateModalContent} onClose={() => setShowCorporateModal(false)} />}
        </>
      )}
    </div>
  );
};

export default ConfirmEmptyLeg;
