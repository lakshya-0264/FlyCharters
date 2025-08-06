import { useState } from "react";
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import {
  FaPlane, FaCalendarAlt, FaClock, FaChair, FaRupeeSign, FaTimes
} from "react-icons/fa";

const EmptyLegCard = ({ flight, handleBookNow }) => {
  const [showModal, setShowModal] = useState(false);

  return (
      <>
        <Tilt
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          scale={1.02}
          transitionSpeed={1500}
          style={{
            borderRadius: "18px",
            height: "100%",        
            width: "100%",          
            boxSizing: "border-box"
          }}
        >
        <motion.div
          whileHover={{ y: -4 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            borderRadius: "18px",
            padding: "30px",
            paddingBottom: "20px",
            boxShadow: "0 16px 32px rgba(0,0,0,0.08)",
            border: "1px solid rgba(230,230,250,0.5)",
            fontFamily: "'Segoe UI', sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Label */}
          <div style={{
            background: "linear-gradient(to right, #061953, #0040ff)",
            color: "#fff",
            padding: "10px 20px",
            fontSize: "0.7rem",
            fontWeight: "600",
            borderRadius: "8px",
            border: "none",
            width: "fit-content",
            marginBottom: "20px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
          }}>
            ✈️ Empty Leg Deal
          </div>

          {/* Route Display */}
          <div style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "1px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ textAlign: "center", marginBottom: "26px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "1.1rem", color: "#061953" }}>{flight.takeOff_Airport?.source_IATA}</div>
                  <div style={{ fontSize: "0.75rem", color: "#555" }}>{flight.takeOff_Airport?.airport_name}</div>
                </div>

                <div style={{ flexGrow: 1, height: "2px", background: "#061953", position: "relative" }}>
                  <FaPlane style={{
                    position: "absolute",
                    left: "50%",
                    top: "-10px",
                    transform: "translateX(-50%) rotate(2deg)",
                    color: "#061953",
                    fontSize: "1.2rem"
                  }} />
                </div>

                <div>
                  <div style={{ fontWeight: "700", fontSize: "1.1rem", color: "#061953" }}>{flight.destination_Airport?.source_IATA}</div>
                  <div style={{ fontSize: "0.75rem", color: "#555" }}>{flight.destination_Airport?.airport_name}</div>
                </div>
              </div>
            </div>

            {/* Grid Info */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              rowGap: "10px",
              fontSize: "0.9rem",
              color: "#333"
            }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaCalendarAlt style={{ marginRight: "6px", color: "#061953" }} />
                <strong>Departure Date:</strong>&nbsp; {new Date(flight.departureDate).toLocaleDateString()}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaClock style={{ marginRight: "6px", marginLeft: "6px", color: "#061953" }} />
                <strong>Departure Time:</strong>&nbsp; {flight.departureTime}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaChair style={{ marginRight: "6px", color: "#061953" }} />
                <strong>Available Seats:</strong>&nbsp; {flight.no_seat}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <FaRupeeSign style={{ marginRight: "6px", marginLeft: "6px", color: "#061953" }} />
                <strong>Price per Seat:</strong>&nbsp; ₹{flight.priceperseat.toLocaleString()}
              </div>
            </div>

            <div style={{
              fontSize: "0.85rem",
              color: "#555",
              marginTop: "14px"
            }}>
              <strong>Status:</strong> {flight.status?.charAt(0).toUpperCase() + flight.status?.slice(1)}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "12px" }}>
            <button
              onClick={() => handleBookNow(flight)}
              style={{
                background: "linear-gradient(to right, #061953, #0040ff)",
                color: "#fff",
                padding: "10px 22px",
                fontSize: "0.9rem",
                fontWeight: "600",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
              }}
            >
              Book Now
            </button>

            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "#fff",
                color: "#061953",
                padding: "10px 22px",
                fontSize: "0.9rem",
                fontWeight: "600",
                borderRadius: "8px",
                border: "1px solid #061953",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
              }}
            >
              View Details
            </button>
          </div>
        </motion.div>
      </Tilt>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            width: "40%",
            maxWidth: "600px",
            padding: "25px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
            position: "relative",
            animation: "fadeIn 0.3s ease-in-out"
          }}>
            <button onClick={() => setShowModal(false)} style={{
              position: "absolute",
              top: "10px",
              right: "14px",
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#888"
            }}>
              <FaTimes />
            </button>
            <h3 style={{ color: "#061953", fontSize: "1.3rem", marginBottom: "18px", fontWeight: "600" }}>
  ✈️ Flight Details
</h3>

<div style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
  fontSize: "0.92rem",
  color: "#333"
}}>
  <div>
    <strong style={{ color: "#061953" }}>From:</strong><br />
    {flight.takeOff_Airport?.airport_name} ({flight.takeOff_Airport?.source_IATA})
  </div>
  <div>
    <strong style={{ color: "#061953" }}>To:</strong><br />
    {flight.destination_Airport?.airport_name} ({flight.destination_Airport?.source_IATA})
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Departure Date:</strong><br />
    {new Date(flight.departureDate).toLocaleDateString()}
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Departure Time:</strong><br />
    {flight.departureTime}
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Arrival Date:</strong><br />
    {new Date(flight.arrivalDate).toLocaleDateString()}
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Arrival Time:</strong><br />
    {flight.arrivalTime}
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Seats Available:</strong><br />
    {flight.no_seat}
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Price Per Seat:</strong><br />
    ₹{flight.priceperseat.toLocaleString()}
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Status:</strong><br />
    {flight.status?.charAt(0).toUpperCase() + flight.status?.slice(1)}
  </div>
  <div>
    <strong style={{ color: "#061953" }}>Aircraft:</strong><br />
    ✈️ [Details coming soon]
  </div>
</div>

          </div>
        </div>
      )}
    </>
  );
};

export default EmptyLegCard;
