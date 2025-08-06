import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../../../assets/SuccessLottie.json";

const BookingSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      backgroundColor: "#f8f9fa",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <Lottie
        animationData={successAnimation}
        autoplay
        style={{ width: "100px", marginBottom: "20px" }}
      />
      <h1 style={{ color: "#061953", fontSize: "2rem", marginBottom: "12px" }}>Thank You!</h1>
      <p style={{ maxWidth: "500px", textAlign: "center", color: "#555", fontSize: "1rem", marginBottom: "30px" }}>
        Your booking has been successfully confirmed. We wish you a safe and pleasant journey ahead. 
        Our team is preparing everything for your departure!
      </p>
      <button
        onClick={() => navigate("/user")}
        style={{
          backgroundColor: "#061953",
          color: "white",
          padding: "12px 24px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 6px 14px rgba(0, 0, 0, 0.1)"
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default BookingSuccess;