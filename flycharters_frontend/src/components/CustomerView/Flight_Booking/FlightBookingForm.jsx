import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OneWayFullFlight from "./OneWayFullFlight";
import RoundTrip from "./RoundTrip";
import MultiTrip from "./MultiTrip";
import { PlaneTakeoff, Repeat, Map, Plane } from "lucide-react";
import headerIcon from "../../../assets/header-icon.png";

const FlightBookingForm = () => {
  const [tripType, setTripType] = useState("oneway");
  const navigate = useNavigate();

  const tripOptions = [
    { key: "oneway", label: "One-Way", icon: <PlaneTakeoff size={18} /> },
    { key: "roundtrip", label: "Round Trip", icon: <Repeat size={18} /> },
    { key: "multitrip", label: "Multi City", icon: <Map size={18} /> },
  ];

  return (
    <div  className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" style={{ padding: "10px", minHeight: "60vh", backgroundColor: "#f4f6f9", fontFamily: "system-ui" }}>
      <div
      className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "10px 30px",
          // boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px", paddingTop: "4px" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5px" }}>
            {/* <img
              src={headerIcon}
              alt="plane icon"
              style={{ width: "50px", height: "50px", marginRight: "5px", marginLeft: "-50px" }}
            /> */}
            <Plane size={48} color="#061953" className="pr-3" />
            <h1
              style={{
                fontSize: "2.5rem",
                color: "#061953",
                fontWeight: 800,
                letterSpacing: "1px",
                textTransform: "capitalize",
                margin: 0,
              }}
            >
              Flight Booking
            </h1>
          </div>
          <p style={{ fontSize: "1.15rem", color: "#4a4a4a", marginTop: "5px", fontWeight: 500 }}>
            “Luxury in the skies, freedom on the ground.”  
          </p>
        </div>

        {/* Trip Type Selector */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "25px", flexWrap: "wrap" }}>
            {tripOptions.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTripType(key)}
                style={{
                  backgroundColor: tripType === key ? "#061953" : "#fff",
                  color: tripType === key ? "#fff" : "#061953",
                  border: "2px solid #061953",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: tripType === key ? "0 4px 12px rgba(6,25,83,0.2)" : "none",
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Render Selected Form */}
        {tripType === "oneway" && (
          <>
            <OneWayFullFlight />
          </>
        )}
        {tripType === "roundtrip" && <RoundTrip />}
        {tripType === "multitrip" && <MultiTrip />}
      </div>
    </div>
  );
};

export default FlightBookingForm;
