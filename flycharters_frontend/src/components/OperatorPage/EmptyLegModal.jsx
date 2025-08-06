import React, { useState } from "react";
import { FiLoader, FiSend } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlane } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const EmptyLegModal = ({ emptyLegs, onClose, onAdd, addedLegs }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [disabledIds, setDisabledIds] = useState(() =>
    new Set(Object.keys(addedLegs))
  );

  const handleAdd = async (leg) => {
    const id = leg._id || JSON.stringify(leg);
    setLoadingId(id);

    try {
      await onAdd(leg);
      setDisabledIds((prev) => new Set(prev).add(id));
      toast.success("Empty leg added!");
    } catch (err) {
      toast.error("Failed to add empty leg.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              width: "90%",
              maxWidth: "720px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "16px",
              padding: "28px 32px",
              background: "#fff",
              position: "relative",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 20,
                right: 28,
                fontSize: 28,
                border: "none",
                background: "none",
                color: "#061953",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ×
            </button>

            <h2
            className="flex justify-center"
              style={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#061953",
                marginBottom: "25px",
              }}
            >
              Suggested Empty Legs
            </h2>

            {emptyLegs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 10px",
                  color: "#555",
                  fontStyle: "italic",
                }}
              >
                No empty legs suggested for this flight.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {emptyLegs.map((leg, idx) => {
                  const id = leg._id || JSON.stringify(leg);
                  const isDisabled = disabledIds.has(id);
                  const isLoading = loadingId === id;

                  return (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #dcdcdc",
                        borderRadius: "12px",
                        padding: "20px",
                        backgroundColor: "#f8faff",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* Route visual */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "16px",
                        }}
                      >
                        <span style={{ fontWeight: "600", color: "#061953" }}>
                          {leg.takeOff_Airport?.source_IATA}
                        </span>

                        <div
                          style={{
                            flex: 1,
                            height: "1px",
                            backgroundColor: "#ccc",
                            margin: "0 12px",
                            position: "relative",
                          }}
                        >
                          <FaPlane
                            style={{
                              position: "absolute",
                              top: "-12px",
                              left: "50%",
                              transform: "translateX(-50%) rotate(0deg)",
                              color: "#061953",
                              fontSize: "24px",
                              backgroundColor: "#f8faff",
                              padding: "2px",
                              borderRadius: "50%",
                            }}
                          />
                        </div>

                        <span style={{ fontWeight: "600", color: "#061953" }}>
                          {leg.destination_Airport?.source_IATA}
                        </span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        <p style={{ fontSize: "14px" }}>
                          <strong>From:</strong> {leg.takeOff_Airport?.airport_name}
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          <strong>To:</strong> {leg.destination_Airport?.airport_name}
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          <strong>Departure:</strong>{" "}
                          {new Date(leg.departureDate).toLocaleDateString()} at{" "}
                          {leg.departureTime}
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          <strong>Arrival:</strong>{" "}
                          {new Date(leg.arrivalDate).toLocaleDateString()} at{" "}
                          {leg.arrivalTime}
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          <strong>Price/Seat:</strong> ₹{leg.priceperseat}
                        </p>
                        <p style={{ fontSize: "14px" }}>
                          <strong>Full Plane:</strong> ₹{leg.full_plane_price}
                        </p>
                      </div>

                      <button
                        onClick={() => handleAdd(leg)}
                        disabled={isDisabled || isLoading}
                        style={{
                          marginTop: "16px",
                          width: "100%",
                          backgroundColor: isDisabled
                            ? "#94a3b8"
                            : "#061953",
                          color: "white",
                          padding: "10px 0",
                          borderRadius: "6px",
                          cursor:
                            isDisabled || isLoading
                              ? "not-allowed"
                              : "pointer",
                          fontWeight: "500",
                          border: "none",
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {isLoading ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <FiSend />
                        )}
                        {isDisabled ? "Added" : "Add Empty Leg"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default EmptyLegModal;