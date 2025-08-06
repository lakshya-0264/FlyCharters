import { Plane, Info } from "lucide-react";
import OneWayEmptyLeg from "./OneWayEmptyLeg";
import { useState } from "react";

const EmptyLegPage = () => {
    const [showModal, setShowModal] = useState(false);
  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "40px 50px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.07)",
          animation: "fadeIn 0.4s ease-in-out",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            position: "relative",
          }}
        >
        <div className="flex justify-center gap-2">
          <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                justifyContent: "center",
                background: "linear-gradient(135deg, #061953, #1e40af)",
                padding: "10px 20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            >
            <Plane size={26} color="#fff" strokeWidth={2.2} />
            <h2
                style={{
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#fff",
                margin: 0,
                }}
            >
                Empty Leg Flight Booking
            </h2>
        </div>
        {/* === Learn More Button === */}
        <div className="flex justify-center" style={{ textAlign: "center" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "4px 4px",
                  color: "#1d4ed8",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(true)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  // e.currentTarget.style.backgroundColor = "#e0e7ff";
                  e.currentTarget.style.color = "#0f172a";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  // e.currentTarget.style.backgroundColor = "#eef2ff";
                  e.currentTarget.style.color = "#1d4ed8";
                }}
              >
                <Info size={18} strokeWidth={2.2} />
                {/* <span>Know more about Empty Leg bookings</span> */}
              </div>
            </div>
        </div>
        
        <p
            style={{
            marginTop: "14px",
            fontSize: "1rem",
            fontWeight: "500",
            color: "#6b7280",
            maxWidth: "500px",
            marginInline: "auto",
            lineHeight: "1.6",
            }}
        >
            Find discounted one-way private jet flights. Enter your preferred route and date below to begin searching.
        </p>
        </div>

        {/* Embedded Booking Form */}
        <OneWayEmptyLeg />
      </div>


      {/* === Modal === */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff",
            maxWidth: "700px",
            width: "90%",
            padding: "30px 30px 20px 30px",
            borderRadius: "16px",
            position: "relative",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            {/* Top Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "999px",
                padding: "6px 10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {/* Modal Content */}
            <h1 style={{ color: "#061953", fontSize: "1.8rem", fontWeight: "bold", marginBottom: "20px" }}>
              What is an Empty Leg Flight?
            </h1>
            <p style={{ fontSize: "1rem", color: "#444", lineHeight: 1.7 }}>
              An <strong>Empty Leg Flight</strong> is a discounted one-way private jet flight that's scheduled to fly without passengers — often because it’s returning to base or repositioning.
              These flights offer a luxurious experience at a fraction of the normal cost.
            </p>
            <ul style={{ marginTop: "20px", paddingLeft: "20px", color: "#333" }}>
              <li style={{ marginBottom: "10px" }}>⚡ Significantly cheaper than standard private charters</li>
              <li style={{ marginBottom: "10px" }}>🛩️ Same aircraft quality, comfort, and service</li>
              <li style={{ marginBottom: "10px" }}>📍 Fixed route and schedule (non-flexible)</li>
            </ul>
            <p style={{ marginTop: "30px", color: "#555" }}>
              Check the available routes and book quickly — empty legs are limited and in high demand.
            </p>

            {/* Bottom Close Button */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#061953",
                  color: "#fff",
                  padding: "10px 30px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyLegPage;
