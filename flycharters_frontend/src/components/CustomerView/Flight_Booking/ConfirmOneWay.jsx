import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from "axios";
import Lottie from "lottie-react";
import confirmingAnimation from "../../../assets/ConfirmingLottie.json";
import { toast } from "react-toastify";
import {
  FaPlane, FaUser, FaRupeeSign, FaCalendarAlt, FaClock,
  FaEnvelope, FaPhone, FaPassport, FaGlobe, FaPaw, FaBuilding
} from "react-icons/fa";
import { FaMoneyBill, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { Plane } from "lucide-react";

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

const InvoiceCard = ({ flightData, bookingData, isConfirmed, paymentDone, handlePayNow }) => {
  const baseAmount = flightData?.quoto_detail?.total_cost || 0;
  const gstAmount = (flightData?.quoto_detail?.total_cost_with_gst || 0) - baseAmount;
  const foodServiceAddon = bookingData?.food_service_addon || 0;
  const partyAddon = bookingData?.party_addon || 0;
  const handlingFee = bookingData?.handling_fee || 0;
  const totalAmount =
    (flightData?.quoto_detail?.total_cost_with_gst || 0) +
    foodServiceAddon +
    partyAddon +
    handlingFee;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "30px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "10px" }}>
        <FaCheckCircle style={{ fontSize: "1.4rem", color: "#061953" }} />
        <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#061953", margin: 0 }}>
          Invoice Summary
        </h3>
      </div>

      {/* Charges Breakdown */}
      <div style={{ marginBottom: "20px", fontSize: "0.95rem", color: "#333" }}>
        <Row label="Base Amount" value={baseAmount} />
        <Row label="GST (18%)" value={gstAmount} />
        {foodServiceAddon > 0 && <Row label="Food Service" value={foodServiceAddon} />}
        {partyAddon > 0 && <Row label="Party Add-on" value={partyAddon} />}
        {handlingFee > 0 && <Row label="Handling Fee" value={handlingFee} />}
        <hr style={{ margin: "14px 0", borderColor: "#e0e0e0" }} />
        <Row
          label="Total Amount"
          value={totalAmount}
          bold
          highlight
        />
      </div>

      {/* Payment Status */}
      <div style={{ marginBottom: "20px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: paymentDone ? "#dcfce7" : "#fef3c7",
            color: paymentDone ? "#15803d" : "#b45309",
            padding: "8px 14px",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          {paymentDone ? (
            <>
              <FaCheckCircle /> Payment Completed
            </>
          ) : (
            <>
              <FaHourglassHalf /> Payment Pending
            </>
          )}
        </span>
      </div>

      {/* Pay Button */}
      {isConfirmed && !paymentDone && (
        <button
        onClick={handlePayNow}
        disabled={!isConfirmed || paymentDone}
        style={{
          marginTop: "20px",
          background: !isConfirmed ? "#ccc" : (paymentDone ? "#4caf50" : "linear-gradient(to right, #061953, #0040ff)"),
          color: "#fff",
          border: "none",
          padding: "14px",
          borderRadius: "10px",
          width: "100%",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: (!isConfirmed || paymentDone) ? "not-allowed" : "pointer",
          transition: "all 0.3s ease"
        }}
      >
        {paymentDone ? "Paid ✓" : "Pay Now"}
      </button>
      )}
    </div>
  );
};

// Utility for rendering rows
const Row = ({ label, value, bold = false, highlight = false }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontWeight: bold ? "700" : "500",
      fontSize: highlight ? "1.1rem" : "inherit",
      color: highlight ? "#061953" : "#444",
    }}
  >
    <span>{label}</span>
    <span>₹{value.toLocaleString()}</span>
  </div>
);


const ConfirmOneWay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedFlight = useSelector((store) => store.flightTicket);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [showCorporateModal, setShowCorporateModal] = useState(false);

  useEffect(() => {
    // Get booking data from navigation state
    const passedBookingData = location.state?.bookingData;
    
    if (passedBookingData) {
      setBookingData(passedBookingData);
      setLoading(false);
    } else {
      // Fallback: try to get from localStorage or API
      const storedBookingData = localStorage.getItem('currentBookingData');
      if (storedBookingData) {
        setBookingData(JSON.parse(storedBookingData));
        setLoading(false);
      } else {
        // If no data available, redirect back or show error
        toast.error("No booking data found. Please try again.");
        navigate("/user");
      }
    }
  }, [location.state, navigate]);

  const handleConfirmBooking = async () => {
    if (!bookingData?._id) return;
    try {
      // Simulate API call to confirm booking
      toast.success("Booking confirmed!");
      setBookingData(prev => ({ ...prev, booking_status: "confirmed" }));
      
    } catch (err) {
      toast.error("Failed to confirm booking.");
    }
  };

  const handlePayNow = async () => {
    if (isRoundTrip) handlePayNowRoundTrip();
    else handlePayNowOneWay();
  }

    const handlePayNowRoundTrip = async () => {
    if (!bookingData?._id) return;
    setIsPaying(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Payment successful!");
      setBookingData(prev => ({ ...prev, payment_status: "paid" }));
      navigate("/user/booking-success");
    } catch {
      toast.error("Payment failed!");
    } finally {
      setIsPaying(false);
    }
  };

  const handlePayNowOneWay = async () => {
    if (!bookingData?._id) {
      console.warn("Missing booking ID.");
      return;
    }
    setIsPaying(true);
    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + "/pay/order/" + bookingData._id);
      // console.log(res.data)

      const { session_id, order_id } = res.data;
      // console.log("Cashfree session_id:", session_id);

      if (session_id && window.Cashfree) {
        const cashfree = window.Cashfree({ mode: "sandbox" });
        const result = await cashfree.checkout({
          paymentSessionId: session_id,
          redirectTarget: "_modal",
        });
        // console.log("Cashfree checkout result:", result);

        const statusRes = await axios.get(import.meta.env.VITE_API_BASE_URL + "/pay/payment-status?order_id=" + order_id);
        const paymentDoc = statusRes?.data.data;
        // console.log(paymentDoc);

        if (paymentDoc?.order_status === "PAID") {
          await axios.post(import.meta.env.VITE_API_BASE_URL + "/pay/final_book/" + paymentDoc._id + "/" + bookingData._id);
          toast.success("Payment successful and flight booked!");
          navigate("/user/booking-success");
          // navigate(`/booking-success/${bookingData._id}`);
        } else {
          toast.error("Payment failed or pending.");
        }
      } else {
        toast.error("CashFree SDK not found");
      }
    } catch (err) {
      console.error("Error during payment:", err);
      toast.error("Failed to initiate payment.");
    } finally {
      setIsPaying(false);
    }
  };

  const calculateArrivalDateTime = (departureDate, departureTime, totalHours) => {
    if (!departureTime || !departureDate || typeof totalHours !== "number") 
      return { time: "Invalid", date: "Invalid" };

    const [depHour, depMin] = departureTime.split(":").map(Number);
    const [year, month, day] = departureDate.split("-").map(Number);

    const depDate = new Date(year, month - 1, day, depHour, depMin);
    depDate.setMinutes(depDate.getMinutes() + Math.round(totalHours * 60));

    const hh = String(depDate.getHours()).padStart(2, '0');
    const mm = String(depDate.getMinutes()).padStart(2, '0');
    const time = `${hh}:${mm}`;

    const date = depDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return { time, date };
  };

  if (loading) return <h3 style={{ textAlign: "center", marginTop: "100px" }}>Loading booking details...</h3>;

  if (!bookingData) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h3>No booking data found</h3>
        <button onClick={() => navigate("/user")} style={{ marginTop: "20px", padding: "10px 20px" }}>
          Go Back
        </button>
      </div>
    );
  }

  const isConfirmed = bookingData.booking_status === "confirmed";
  const paymentDone = bookingData.payment_status === "paid";
  const fromAirport = requestedFlight.fromAirportName;
  const toAirport = requestedFlight.toAirportName;
  const departureTime = requestedFlight.time;
  const departureDate = requestedFlight.date;
  const isRoundTrip = requestedFlight.is_round_trip;

  const { time: arrivalTime, date: arrivalDate } = calculateArrivalDateTime(
    departureDate, 
    departureTime, 
    requestedFlight.quoto_detail?.leg_times?.[1] || 0
  );

  const hasPetDetails = bookingData?.petDetails?.isPet;
  const hasCorporateDetails = bookingData?.corporateDetails?.isCorporate;

  const petModalContent = bookingData.petDetails && (
    <>
      <Detail label="Pet Type" icon={<FaPaw />} value={bookingData.petDetails.type} />
      {bookingData.petDetails.type === "Other" && (
        <Detail label="Specify" icon={<FaPaw />} value={bookingData.petDetails.specify} />
      )}
      <Detail label="Agreed to Pet Policy" icon={<FaPaw />} value={bookingData.petDetails.agreePetPolicy ? "Yes" : "No"} />
      <Detail label="Fit-to-Travel Certificate" icon={<FaPaw />} value={bookingData.petDetails.sitToTravelCertificate ? "Yes" : "No"} />
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
      justifyContent: "center", gap: "50px", backgroundColor: "#f8f9fa", minHeight: "100vh"
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
            width: "1000px", boxShadow: "0 10px 24px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0"
          }}>
            <h2 className="flex justify-center text-2xl" style={{ color: "#061953", fontWeight: "bold", marginBottom: "30px" }}>
              <Plane size={48} color="#061953" className="pr-3 pb-4" /> <span>{isRoundTrip ? "Round-Trip" : "One-Way"} Flight Booking Confirmation</span>
            </h2>
            
            {/* Flight Route */}
            {isRoundTrip ? (
              <div style={{ marginBottom: "30px", display: "flex", flexDirection: "column", gap: "25px" }}>
                {/* FORWARD LEG */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* FROM */}
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <strong style={{ fontSize: "1.2rem", color: "#061953" }}>{fromAirport}</strong>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                      {new Date(departureDate).toLocaleDateString()} • {departureTime}
                    </div>
                  </div>

                  {/* PLANE */}
                  <div style={{ minWidth: "160px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                    <div style={{ flex: 1, height: "2px", backgroundColor: "#061953" }}></div>
                    <FaPlane style={{ color: "#061953", fontSize: "1.5rem" }} />
                    <div style={{ flex: 1, height: "2px", backgroundColor: "#061953" }}></div>
                  </div>

                  {/* TO */}
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <strong style={{ fontSize: "1.2rem", color: "#061953" }}>{toAirport}</strong>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                      {arrivalDate} • {arrivalTime}
                    </div>
                  </div>
                </div>

                {/* RETURN LEG */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* FROM (Return) */}
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <strong style={{ fontSize: "1.2rem", color: "#061953" }}>{toAirport}</strong>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                      {new Date(requestedFlight.returnDate).toLocaleDateString()} • {requestedFlight.returnTime}
                    </div>
                  </div>

                  {/* PLANE (Flipped) */}
                  <div style={{ minWidth: "160px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                    <div style={{ flex: 1, height: "2px", backgroundColor: "#061953" }}></div>
                    <FaPlane
                      style={{
                        color: "#061953",
                        fontSize: "1.5rem",
                        transform: "rotate(180deg)",
                      }}
                    />
                    <div style={{ flex: 1, height: "2px", backgroundColor: "#061953" }}></div>
                  </div>

                  {/* TO (Return) */}
                  <div style={{ flex: 1, textAlign: "right" }}>
                    {(() => {
                      const { time, date } = calculateArrivalDateTime(
                        requestedFlight.returnDate,
                        requestedFlight.returnTime,
                        requestedFlight.quoto_detail.leg_times[3]
                      );
                      return (
                        <>
                          <strong style={{ fontSize: "1.2rem", color: "#061953" }}>{fromAirport}</strong>
                          <div style={{ color: "#666", fontSize: "0.9rem" }}>
                            {date} • {time}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                {/* FROM */}
                <div style={{ flex: 1, textAlign: "left" }}>
                  <strong style={{ fontSize: "1.2rem", color: "#061953" }}>{fromAirport}</strong>
                  <div style={{ color: "#666", fontSize: "0.9rem" }}>
                    {new Date(departureDate).toLocaleDateString()} • {departureTime}
                  </div>
                </div>

                {/* PLANE */}
                <div style={{ minWidth: "160px", display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                  <div style={{ flex: 1, height: "2px", backgroundColor: "#061953" }}></div>
                  <FaPlane style={{ color: "#061953", fontSize: "1.5rem" }} />
                  <div style={{ flex: 1, height: "2px", backgroundColor: "#061953" }}></div>
                </div>

                {/* TO */}
                <div style={{ flex: 1, textAlign: "right" }}>
                  <strong style={{ fontSize: "1.2rem", color: "#061953" }}>{toAirport}</strong>
                  <div style={{ color: "#666", fontSize: "0.9rem" }}>
                    {arrivalDate} • {arrivalTime}
                  </div>
                </div>
              </div>
            )}

            {/* Flight Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                background: "#f8f9ff",
                padding: "18px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >

              {/* Shared Aircraft Details */}
                <div
                  style={{
                    background: "#f8f9ff",
                    padding: "18px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#061953", marginBottom: "14px" }}>
                    Aircraft Details
                  </h3>

                  {/* Name, Model, Capacity, Passengers */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr auto",
                      gap: "14px",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    <Detail
                      label="Aircraft"
                      icon={<FaPlane />}
                      value={`${requestedFlight?.fleet_details?.name} — ${requestedFlight?.fleet_details?.model}`}
                    />
                    <Detail
                      label="Capacity"
                      icon={<FaUser />}
                      value={`${requestedFlight?.fleet_details?.capacity} Passengers`}
                    />
                    <Detail
                      label="Your Booking"
                      icon={<FaUser />}
                      value={`${bookingData?.passengerDetails?.length || requestedFlight.passengers || 1} Passenger(s)`}
                    />
                    {/* <Detail
                      label="Aircraft Regn."
                      icon={<FaPlane />}
                      value={requestedFlight?.fleet_details?.aircraftRegn}
                    /> */}
                  </div>

                  {/* Aircraft Images */}
                  {requestedFlight?.fleet_details?.fleetInnerImages?.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "10px", color: "#061953" }}>
                        Cabin & Interior Views
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                          gap: "10px",
                        }}
                      >
                        {requestedFlight.fleet_details.fleetInnerImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`aircraft-view-${idx}`}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              {/* Forward Journey */}
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#061953", marginBottom: "10px" }}>
                  Forward Journey
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <Detail
                    label="Departure Date"
                    icon={<FaCalendarAlt />}
                    value={new Date(departureDate).toLocaleDateString()}
                  />
                  <Detail label="Departure Time" icon={<FaClock />} value={departureTime} />
                  <Detail label="Arrival Date" icon={<FaCalendarAlt />} value={arrivalDate} />
                  <Detail label="Arrival Time" icon={<FaClock />} value={arrivalTime} />
                </div>
              </div>

              {/* Return Journey */}
              {isRoundTrip && (
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#061953", marginBottom: "10px" }}>
                    Return Journey
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    <Detail
                      label="Departure Date"
                      icon={<FaCalendarAlt />}
                      value={new Date(requestedFlight.returnDate).toLocaleDateString()}
                    />
                    <Detail label="Departure Time" icon={<FaClock />} value={requestedFlight.returnTime} />
                    <Detail
                      label="Arrival Date"
                      icon={<FaCalendarAlt />}
                      value={(() => {
                        const { date } = calculateArrivalDateTime(
                          requestedFlight.returnDate,
                          requestedFlight.returnTime,
                          requestedFlight.quoto_detail.leg_times[3]
                        );
                        return date;
                      })()}
                    />
                    <Detail
                      label="Arrival Time"
                      icon={<FaClock />}
                      value={(() => {
                        const { time } = calculateArrivalDateTime(
                          requestedFlight.returnDate,
                          requestedFlight.returnTime,
                          requestedFlight.quoto_detail.leg_times[3]
                        );
                        return time;
                      })()}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Booking Details */}
            {/* <div style={{
              background: "#fff3cd", padding: "15px", borderRadius: "10px", marginBottom: "20px",
              border: "1px solid #ffeaa7"
            }}>
              <Detail label="Booking ID" icon={<FaRupeeSign />} value={bookingData._id} />
              <Detail label="Booking Time" icon={<FaClock />} value={new Date(bookingData.booking_time).toLocaleString()} />
              <Detail label="Payment Status" icon={<FaRupeeSign />} value={bookingData.payment_status} />
            </div> */}

            {/* Passenger Details */}
            <h3 style={{ color: "#061953", marginBottom: "12px" }}>👥 Passenger Details</h3>
            {bookingData.passengerDetails && bookingData.passengerDetails.map((p, idx) => (
              <div key={idx} style={{
                border: "1px solid #e2e8f0", borderRadius: "10px",
                padding: "16px", marginBottom: "16px", background: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <strong>Passenger {idx + 1}</strong>
                  <span style={{
                    background: "#eef2ff", padding: "4px 10px",
                    borderRadius: "8px", fontSize: "0.8rem"
                  }}>{p.gender || 'N/A'}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Detail label="Name" icon={<FaUser />} value={p.name} />
                  <Detail label="Nationality" icon={<FaGlobe />} value={p.nationality} />
                  {p.email && <Detail label="Email" icon={<FaEnvelope />} value={p.email} />}
                  {p.phone && <Detail label="Phone" icon={<FaPhone />} value={p.phone} />}
                  {p.passport && <Detail label="Passport" icon={<FaPassport />} value={p.passport} />}
                </div>
              </div>
            ))}

            {/* Pet & Corporate Summary */}
            <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
              {hasPetDetails && (
                <div style={{ background: "#f1f5ff", padding: "10px 16px", borderRadius: "10px" }}>
                  Pet is travelling: 
                  <button 
                    onClick={() => setShowPetModal(true)} 
                    style={{ color: "#2563eb", marginLeft: "8px", fontWeight: 600, cursor: "pointer", background: "none", border: "none" }}
                  >
                    View Details
                  </button>
                </div>
              )}
              {hasCorporateDetails && (
                <div style={{ background: "#f1f5ff", padding: "10px 16px", borderRadius: "10px" }}>
                  Corporate Booking: 
                  <button 
                    onClick={() => setShowCorporateModal(true)} 
                    style={{ color: "#2563eb", marginLeft: "8px", fontWeight: 600, cursor: "pointer", background: "none", border: "none" }}
                  >
                    View Details
                  </button>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
              <button 
                onClick={() => navigate("/user")} 
                style={{
                  backgroundColor: "#fff", color: "#ef4444",
                  border: "1px solid #ef4444", padding: "10px 24px",
                  borderRadius: "8px", fontWeight: 600, cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmBooking} 
                disabled={isConfirmed} 
                style={{
                  background: isConfirmed ? "#ccc" : "#061953",
                  color: "#fff", padding: "10px 24px", borderRadius: "8px",
                  fontWeight: 600, cursor: isConfirmed ? "not-allowed" : "pointer",
                  border: "none"
                }}
              >
                {isConfirmed ? "Confirmed" : "Confirm Booking"}
              </button>
            </div>
          </div>
           
          <InvoiceCard
            flightData={requestedFlight}
            bookingData={bookingData}
            isConfirmed={isConfirmed}
            paymentDone={paymentDone}
            handlePayNow={handlePayNow}
          />
            
          {showPetModal && (
            <Modal 
              title="Pet Travel Details" 
              details={petModalContent} 
              onClose={() => setShowPetModal(false)} 
            />
          )}
          {showCorporateModal && (
            <Modal 
              title="Corporate Booking Details" 
              details={corporateModalContent} 
              onClose={() => setShowCorporateModal(false)} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default ConfirmOneWay;