import { FaPlane, FaUser, FaRupeeSign, FaCheckCircle, FaClock } from "react-icons/fa";

const InvoiceCard = ({ from, to, bookingData, addonsCharge, isConfirmed, paymentDone, handlePayNow }) => {
  const total = bookingData.total_amount + addonsCharge;

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    gap: "10px",
    fontSize: "0.95rem",
    color: "#374151"
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 500,
    color: "#1f2937"
  };

  return (
    <div
      style={{
        minWidth: "460px",
        background: "#fafafa",
        padding: "28px",
        borderRadius: "14px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
        alignSelf: "flex-start",
        fontFamily: "sans-serif"
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#061953",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <FaCheckCircle color="#061953" /> Invoice Summary
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "4px" }}>
          Review your flight and payment details
        </p>
      </div>

      {/* Invoice Details */}
      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaPlane /> Route
        </span>
        <span>{from.source_IATA} → {to.source_IATA}</span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaUser /> Seats
        </span>
        <span>{bookingData.seats_booked}</span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaRupeeSign /> Base Fare
        </span>
        <span>₹{bookingData.total_amount.toLocaleString()}</span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaRupeeSign /> Add‑ons
        </span>
        <span>₹{addonsCharge.toLocaleString()}</span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaRupeeSign /> Subtotal
        </span>
        <span>₹{total.toLocaleString()}</span>
      </div>

      <div style={{ borderTop: "1px solid #e2e8f0", margin: "20px 0", paddingTop: "12px", ...rowStyle }}>
        {/* <strong style={{ ...labelStyle }}>
          <FaRupeeSign /> Grand Total
        </strong>
        <strong>₹{total.toLocaleString()}</strong> */}
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaClock /> Booking Status
        </span>
        {/*<span className="capitalize">{bookingData.booking_status}</span>*/}
        <span className="capitalize">{isConfirmed ? "Partially Confirmed" : "Pending"}</span>
      </div>

      <div style={rowStyle}>
        <span style={labelStyle}>
          <FaRupeeSign /> Payment Status
        </span>
        <span className="capitalize">{bookingData.payment_status}</span>
      </div>

      {/* Pay Now Button */}
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
    </div>
  );
};

export default InvoiceCard;
