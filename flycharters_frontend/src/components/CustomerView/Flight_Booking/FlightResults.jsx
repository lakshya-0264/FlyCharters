import { useState } from "react";
import { Plane, MapPin, Clock, Sparkles, ArrowLeft, Users, MapPin as Location } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addFlight } from "../../../utils/Redux _Store/flightTicketSlice";
import axios from "axios";

const FlightResults = ({ searchResults, flightDetails, airports, isRoundTrip }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(flightDetails);

  const handleBookNow = (flightData) => {
    const fromAirport = airports.find(a => a._id === flightDetails?.from);
    const toAirport = airports.find(a => a._id === flightDetails?.to);
    const newFlightData = {
      ...flightData,
      ...flightDetails, 
      fromAirportName: fromAirport ? `${fromAirport.source_IATA} - ${fromAirport.airport_name}` : "Unknown",
      toAirportName: toAirport ? `${toAirport.source_IATA} - ${toAirport.airport_name}` : "Unknown",
      is_round_trip: isRoundTrip,
    };
    dispatch(addFlight(newFlightData));
    // createFlightRequestTicket(flightData);
    // console.log("Dispatched Flight Data:", newFlightData);
    return navigate("/user/one-way-booking")
  };


    const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
  };

  const calculateFlightDuration = (totalTime) => {
    if (!totalTime) return "N/A";
    
    const hours = Math.floor(totalTime);
    const minutes = Math.round((totalTime - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSelectedAirportName = (airportId) => {
    const airport = airports.find(a => a._id === airportId);
    return airport ? `${airport.source_IATA} - ${airport.airport_name}` : '';
  };

  const getAirportById = (airportId) => {
    return airports.find(a => a._id === airportId);
  };

  const fromAirport = getSelectedAirportName(flightDetails?.from);
  const toAirport = getSelectedAirportName(flightDetails?.to);

  const nauticalMilesToKm = (nauticalMiles) => {
      return Math.round(nauticalMiles);
  };

  const calculateStayDurationInHours = (departureDate, departureTime, returnDate, returnTime) => {
      const start = new Date(`${departureDate}T${departureTime}`);
      const end = new Date(`${returnDate}T${returnTime}`);
      const diffMs = end - start;

      if (isNaN(diffMs) || diffMs < 0) return 0;

      const diffHours = diffMs / (1000 * 60 * 60); // ms to hours
      return diffHours.toFixed(2);
    };


  return (
    <>
  <style>{`
    @keyframes dashFlow {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -24; }
    }
    @keyframes cloudFloat {
      0%, 100% { transform: translateX(0) translateY(0); }
      50% { transform: translateX(10px) translateY(-5px); }
    }
    @keyframes dashFlowReverse {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -24; }
    }
  `}</style>


    <div style={{ padding: "0px 10px" }}>
      {/* Search Results Header */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        background: "linear-gradient(135deg, #061953, #1e40af)",
        color: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
          <Sparkles size={20} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", margin: 0 }}>
            Selections for your flight between {fromAirport?.split(' - ')[0] || 'Unknown'} to {toAirport?.split(' - ')[0] || 'Unknown'}
          </h2>
        </div>
        <p style={{ fontSize: "0.9rem", opacity: 0.9, margin: 0 }}>
          {searchResults.length} Available Aircraft • {formatDate(flightDetails.date)}
        </p>
      </div>

      {/* Flight Results Cards */}
      <div 
        style={{
            display: "grid",
            gap: "25px",
            gridTemplateColumns: isRoundTrip
              ? "repeat(auto-fit, minmax(800px, 1fr))"
              : "repeat(auto-fit, minmax(650px, 1fr))",
          }}
        >
        {searchResults.map((result, idx) => {
          const pathId = `routePath-${idx}`;
          const flight = result.fleet_details;
          const passengersRequired = parseInt(flightDetails.passengers || "1");

            if (!flight || flight.capacity < passengersRequired) {
              return null;
            }
          const baseAirport = airports.find(a => a._id === flight.aircraftBase);

          const showBaseToDep = baseAirport?._id !== flightDetails?.from;
          const showArrToBase = flightDetails?.to !== baseAirport?._id;

          let motionPath = '';
          
          if(!isRoundTrip){
            if (showBaseToDep && showArrToBase) {
              motionPath = 'M 80 120 Q 200 40, 320 120 Q 440 40, 560 120 Q 680 40, 800 120';
            } else if (showBaseToDep && !showArrToBase) {
              motionPath = 'M 80 120 Q 200 40, 320 120 Q 440 40, 560 120';
            } else if (!showBaseToDep && showArrToBase) {
              motionPath = 'M 320 120 Q 440 40, 560 120 Q 680 40, 800 120';
            } else {
              motionPath = 'M 320 120 Q 440 40, 560 120'; // dep->arr
            }
          } else{
            if (showBaseToDep) {
              motionPath = 'M 80 120 Q 200 40, 320 120 Q 440 40, 560 120';
            } else {
              motionPath = 'M 320 120 Q 440 40, 560 120'; // dep->arr
            }
          }

          {/* let reversePath = motionPath.split(',').reverse().join(' '); */}

          return (
            <div
              key={idx}
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: hoveredCard === idx ? "0 12px 30px rgba(0,0,0,0.15)" : "0 6px 20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                transform: hoveredCard === idx ? "translateY(-2px)" : "translateY(0)",
                position: "relative"
              }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >

              <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
                {/* Aircraft Icon */}
                <div style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #061953, #1e40af)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(6,25,83,0.3)"
                }}>
                  <Plane size={24} style={{ color: "white", transform: "rotate(45deg)" }} />
                </div>

                {/* Aircraft Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#061953", marginBottom: "8px" }}>
                      {flight.aircraftRegn}
                    </div>
                    <div style={{ fontSize: "1rem", color: "#475569", fontWeight: "600", marginBottom: "12px" }}>
                      {flight.name} - {flight.model}
                    </div>
                  </div>

                {/* ROUTE JOURNEY ANIMATION */}
                <div 
                  style={{
                    margin: "20px 0",
                    padding: "18px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
                    animation: "fadeSlideUp 0.4s ease-in-out"
                  }}
                >
                  {/* Airport Boxes Row */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}>
                    {[{
                      label: 'Base Location',
                      value: `${baseAirport.source_IATA} - ${baseAirport.airport_name}`
                    }, {
                      label: 'Departure',
                      value: fromAirport
                    }, {
                      label: 'Arrival',
                      value: toAirport
                    }].map((item, idx) => (
                      <div key={idx} style={{
                        flex: 1,
                        background: "#ffffff",
                        border: "1px solid #cbd5e1",
                        borderRadius: "12px",
                        padding: "14px",
                        textAlign: "center",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.04)"
                      }}>
                      <div className="flex justify-center gap-1">
                        <Location size={14} className="mt-0.25" style={{ color: "#64748b" }} /> 
                        <div style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          marginBottom: "4px"
                        }}>
                        {item.label}
                        </div>
                      </div>
                        
                        <div style={{
                          fontSize: "0.95rem",
                          fontWeight: "700",
                          color: "#0f172a"
                        }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Flight Path SVG */}
                  <div
                    className="-mb-15"
                    style={{
                      width: isRoundTrip ? "90%" : "100%",
                      height: "250px",
                      position: "relative",
                      display: isRoundTrip ? "flex" : undefined,
                      justifyContent: isRoundTrip ? "center" : undefined,
                    }}
                  >
                    <svg
                      viewBox={isRoundTrip ? "50 0 600 250" : "0 0 880 250"}
                      style={{
                        width: "100%",
                        height: "100%",
                        ...(isRoundTrip ? { maxWidth: "700px" } : {}),
                      }}
                    >
                      {/* Visible dashed paths */}
                      {showBaseToDep && (
                        <path d="M 80 120 Q 200 40, 320 120"
                          stroke="#60a5fa"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray="8,6"
                          style={{ animation: "dashFlow 4s linear infinite" }}
                        />
                      )}
                      <path d="M 320 120 Q 440 40, 560 120"
                        stroke="#061953"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray="8,6"
                        style={{ animation: "dashFlow 4s linear infinite" }}
                      />
                      {(!isRoundTrip) && showArrToBase && (
                        <path d="M 560 120 Q 680 40, 800 120"
                          stroke="#60a5fa"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray="8,6"
                          style={{ animation: "dashFlow 4s linear infinite" }}
                        />
                      )}

                      {/* Return Trip Dashed Path */}
                      {isRoundTrip && (
                        <>
                          {/* {showArrToBase && (
                            <path
                              d="M 800 130 Q 680 200, 560 130"
                              stroke="#818cf8"
                              strokeWidth="3"
                              fill="transparent"
                              strokeDasharray="8,6"
                              style={{ animation: "dashFlowReverse 4s linear infinite" }}
                            />
                          )} */}
                          <path
                            d="M 560 130 Q 440 200, 320 130"
                            stroke="#061953"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray="8,6"
                            style={{ animation: "dashFlowReverse 4s linear infinite" }}
                          />
                          {showBaseToDep && (
                            <path
                              d="M 320 130 Q 200 200, 80 130"
                              stroke="#818cf8"
                              strokeWidth="3"
                              fill="transparent"
                              strokeDasharray="8,6"
                              style={{ animation: "dashFlowReverse 4s linear infinite" }}
                            />
                          )}
                        </>
                      )}

                      {/* ACTUAL motion path (invisible) */}
                      <path id={pathId} d={motionPath} fill="transparent" />

                      {/* Return trip motion path (invisible) - reversed path */}
                      {isRoundTrip && (
                        <path id={`${pathId}-return`} d={(() => {
                          let returnPath = motionPath.replace(/120/g, '130').replace(/40/g, '200');
                          // Reverse the path by swapping start and end points
                          if (showBaseToDep) {
                            returnPath = 'M 560 130 Q 440 200, 320 130 Q 200 200, 80 130';
                          } else {
                            returnPath = 'M 560 130 Q 440 200, 320 130';
                          }
                          return returnPath;
                        })()} fill="transparent" />
                      )}

                      {/* ✈️ Plane animation */}
                      {isRoundTrip ? (
                        <>
                          {/* Plane for FORWARD path */}
                          <image
                            width="28"
                            height="28"
                            y="-12"
                            href="https://img.icons8.com/?size=50&id=12665&format=png"
                          >
                            <animateMotion
                              dur="10s"
                              begin="0s;revPlane.end"
                              id="fwdPlane"
                              rotate="auto"
                              fill="remove"
                            >
                              <mpath href={`#${pathId}`} />
                            </animateMotion>
                            <animate attributeName="opacity" values="1;1;0" dur="10s" begin="0s;revPlane.end" fill="freeze" />
                          </image>
                          {/* Plane for REVERSE path */}
                          <image
                            width="28"
                            height="28"
                            y="-12"
                            href="https://img.icons8.com/?size=50&id=12665&format=png"
                            transform="scale(1,-1) translate(-28, 0)"
                          >
                            <animateMotion
                              dur="10s"
                              begin="fwdPlane.end"
                              id="revPlane"
                              rotate="auto"
                              fill="remove"
                            >
                              <mpath href={`#${pathId}-return`} />
                            </animateMotion>
                            <animate attributeName="opacity" values="1;1;0" dur="10s" begin="fwdPlane.end" fill="freeze" />
                          </image>
                        </>
                      ) : (
                        // One-way simple forward motion
                        <image
                          width="28"
                          height="28"
                          y="-12"
                          href="https://img.icons8.com/?size=50&id=12665&format=png"
                        >
                          <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
                            <mpath href={`#${pathId}`} />
                          </animateMotion>
                        </image>
                      )}


                      {/* Points */}
                      {showBaseToDep && <circle cx="80" cy="125" r="7" fill="#061953" />}
                      <circle cx="320" cy="125" r="7" fill="#061953" />
                      <circle cx="560" cy="125" r="7" fill="#061953" />
                      {(!isRoundTrip) && showArrToBase && <circle cx="800" cy="125" r="7" fill="#061953" />}

                      {/* Return trip points */}
                      {/* {isRoundTrip && (
                        <>
                          {showBaseToDep && <circle cx="80" cy="135" r="7" fill="#818cf8" />}
                          <circle cx="320" cy="135" r="7" fill="#1e40af" />
                          <circle cx="560" cy="135" r="7" fill="#1e40af" />
                          {showArrToBase && <circle cx="800" cy="135" r="7" fill="#818cf8" />}
                        </>
                      )} */}

                      {/* Clouds */}
                      <g opacity="0.12">
                        <ellipse cx="150" cy="50" rx="18" ry="10" fill="#cbd5e1" style={{ animation: "cloudFloat 6s infinite" }} />
                        <ellipse cx="450" cy="45" rx="22" ry="12" fill="#e2e8f0" style={{ animation: "cloudFloat 8s infinite reverse" }} />
                        <ellipse cx="650" cy="35" rx="18" ry="10" fill="#dbeafe" style={{ animation: "cloudFloat 7s infinite" }} />
                      </g>

                      {/* IATA Labels */}
                      <g style={{ fontSize: "16px", fontWeight: "600", textAnchor: "middle" }}>
                        {showBaseToDep && <text x="80" y="155" fill="#061953">{baseAirport.source_IATA}</text>}
                        <text x="320" y="155" fill="#061953">{fromAirport.split(" - ")[0]}</text>
                        <text x="560" y="155" fill="#061953">{toAirport.split(" - ")[0]}</text>
                        {(!isRoundTrip) && showArrToBase && <text x="800" y="155" fill="#061953">{baseAirport.source_IATA}</text>}
                      </g>
                      <g style={{ fontSize: "12px", fontWeight: "500", textAnchor: "middle", fill: "#64748b" }}>
                        {showBaseToDep && <text x="80" y="172">{baseAirport.airport_name.split(" ").slice(0,2).join(" ")} Airport</text>}
                        <text x="320" y="172">{fromAirport.split(" - ")[1]?.split(" ").slice(0,2).join(" ")} Airport</text>
                        <text x="560" y="172">{toAirport.split(" - ")[1]?.split(" ").slice(0,2).join(" ")} Airport</text>
                        {(!isRoundTrip) && showArrToBase && <text x="800" y="172">{baseAirport.airport_name.split(" ").slice(0,2).join(" ")} Airport</text>}
                      </g>
                    </svg>
                  </div>
                </div>


                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>

                    {/* Capacity */}
                    <div style={{
                      backgroundColor: "#f0f9ff",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #bae6fd"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <Users size={14} style={{ color: "#0369a1" }} />
                        <span style={{ fontSize: "0.75rem", color: "#0369a1", fontWeight: "600", textTransform: "uppercase" }}>Capacity</span>
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#061953" }}>
                        {flight.capacity} Passengers
                      </div>
                    </div>

                    {/* Flight Time */}
                    <div style={{
                      backgroundColor: "#f0f9ff",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #bae6fd"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <Clock size={14} style={{ color: "#0369a1" }} />
                        <span style={{ fontSize: "0.75rem", color: "#0369a1", fontWeight: "600", textTransform: "uppercase" }}>Flight Time</span>
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#061953" }}>
                        {flightDetails.time} (Departure)
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
                        Duration: {calculateFlightDuration(result.quoto_detail.leg_times[1])}
                      </div>
                    </div>

                    {/* Distance */}
                    <div style={{
                      backgroundColor: "#f0f9ff",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #bae6fd"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <MapPin size={14} style={{ color: "#0369a1" }} />
                        <span style={{ fontSize: "0.75rem", color: "#0369a1", fontWeight: "600", textTransform: "uppercase" }}>Distance</span>
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#061953" }}>
                        {nauticalMilesToKm(result.quoto_detail.leg_distances[1])} NM
                      </div>
                    </div>
                  </div>
                </div>

                    {/* Premium Pricing & Action Card */}
                    <div style={{
                      backgroundColor: "white",
                      marginTop: "75px", 
                      borderRadius: "16px",
                      padding: "28px",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                      boxShadow: "0 10px 25px rgba(6, 25, 83, 0.08)",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease"
                    }} onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 15px 30px rgba(6, 25, 83, 0.12)";
                    }} onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(6, 25, 83, 0.08)";
                    }}>
                      {/* Decorative accent */}
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "4px",
                        background: "linear-gradient(135deg, #061953, #1e40af)",
                        opacity: 0.9
                      }}></div>

                      {/* Pricing Section */}
                      <div style={{ marginBottom: "24px" }}>
                        <div style={{ 
                          fontSize: "0.85rem", 
                          color: "#64748b", 
                          marginBottom: "8px", 
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px"
                        }}>
                          <div className="text-[#061953] text-xl font-extralight">₹</div>
                          TOTAL COST (WITH GST)
                        </div>
                        
                        <div style={{ 
                          fontSize: "2.2rem", 
                          fontWeight: "800", 
                          color: "#061953",
                          margin: "12px 0",
                          background: "linear-gradient(135deg, #061953, #1e40af)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          letterSpacing: "-1px"
                        }}>
                          ₹{Math.round(result.quoto_detail.total_cost_with_gst).toLocaleString()}
                        </div>
                        
                        <div style={{ 
                          fontSize: "0.8rem", 
                          color: "#64748b", 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px"
                        }}>
                          <span style={{
                            display: "inline-block",
                            height: "1px",
                            width: "40px",
                            background: "#e2e8f0"
                          }}></span>
                          <span>Base: ₹{Math.round(result.quoto_detail.total_cost).toLocaleString()}</span>
                          <span style={{
                            display: "inline-block",
                            height: "1px",
                            width: "40px",
                            background: "#e2e8f0"
                          }}></span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button
                          onClick={() => handleViewDetails(result)}
                          style={{
                            backgroundColor: "white",
                            color: "#1e40af",
                            padding: "16px 24px",
                            borderRadius: "12px",
                            fontWeight: "600",
                            fontSize: "1rem",
                            border: "2px solid #1e40af",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px"
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f9ff";
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(30, 64, 175, 0.15)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View Details
                        </button>

                        <button
                          onClick={() => handleBookNow(result)}
                          style={{
                            background: "linear-gradient(135deg, #061953, #1e40af)",
                            color: "white",
                            padding: "16px 24px",
                            borderRadius: "12px",
                            fontWeight: "600",
                            fontSize: "1rem",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            boxShadow: "0 4px 15px rgba(30, 64, 175, 0.3)",
                            position: "relative",
                            overflow: "hidden"
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 64, 175, 0.4)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(30, 64, 175, 0.3)";
                          }}
                        >
                          <span style={{
                            position: "absolute",
                            top: "-50%",
                            left: "-50%",
                            width: "200%",
                            height: "200%",
                            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
                            transform: "rotate(30deg)",
                            transition: "all 0.6s ease",
                            opacity: 0
                          }} 
                          onMouseOver={(e) => {
                            e.target.style.left = "100%";
                            e.target.style.opacity = "1";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.left = "-50%";
                            e.target.style.opacity = "0";
                          }}></span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Book Now
                        </button>
                      </div>

                      {/* Trust Badges */}
                      <div style={{
                        marginTop: "20px",
                        paddingTop: "16px",
                        borderTop: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        flexWrap: "wrap"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.7rem",
                          color: "#64748b"
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 12L11 14L15 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Secure Booking
                        </div>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.7rem",
                          color: "#64748b"
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8V12L15 15" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Instant Confirmation
                        </div>
                      </div>
                    </div>
                
              </div>
            </div>
          );
        })}
      </div>

        {/* FLIGHT MODAL */}
      {selectedFlight && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.2)",
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out"
  }}>
    <div style={{
      background: "linear-gradient(145deg, #ffffff, #f8fafc)",
      maxWidth: "900px",
      width: "75%",
      padding: "40px",
      borderRadius: "24px",
      position: "relative",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
      border: "1px solid rgba(255,255,255,0.2)",
      animation: "scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      scrollbarWidth: "thin",
      scrollbarColor: "#cbd5e1 transparent"
    }}>
      {/* Premium Close Button */}
      <button onClick={() => setSelectedFlight(null)}
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          background: "rgba(241, 245, 249, 0.8)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f1f5f9";
          e.currentTarget.style.transform = "rotate(90deg)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(241, 245, 249, 0.8)";
          e.currentTarget.style.transform = "rotate(0deg)";
        }}
      >
        <span style={{ fontSize: "20px", color: "#64748b" }}>✕</span>
      </button>

      {/* Premium Header with Airline-style */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "24px",
        paddingBottom: "10px",
        borderBottom: "1px solid rgba(0,0,0,0.08)"
      }}>
        <div style={{
          width: "60px",
          height: "60px",
          background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "20px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <span style={{ fontSize: "28px", color: "white" }}>✈️</span>
        </div>
        <div>
          <h2 style={{ 
            color: "#061953", 
            fontSize: "1.8rem", 
            fontWeight: "800", 
            margin: 0,
            letterSpacing: "-0.5px",
            background: "linear-gradient(90deg, #061953, #1e40af)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Flight Journey Details
          </h2>
        </div>
      </div>

      {/* Enhanced Route Section */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        gap: "16px",
        marginBottom: "32px",
        position: "relative"
      }}>
        {/* Departure */}
        <div style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "transform 0.3s ease",
          zIndex: 2
        }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "#3b82f6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ color: "white", fontSize: "18px" }}>↑</span>
            </div>
            <h4 style={{ color: "#061953", margin: 0, fontSize: "1.1rem" }}>Departure</h4>
          </div>
          <p style={{ fontSize: "1.4rem", fontWeight: 700, margin: "8px 0", color: "#1e3a8a" }}>
            {getAirportById(flightDetails.from)?.source_IATA || 'N/A'}
          </p>
          <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "8px" }}>
            {getAirportById(flightDetails.from)?.airport_name}
          </p>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#eff6ff",
            padding: "6px 12px",
            borderRadius: "20px",
            marginTop: "8px"
          }}>
            <span style={{ 
              width: "10px",
              height: "10px",
              background: "#3b82f6",
              borderRadius: "50%",
              marginRight: "8px"
            }}></span>
            <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e40af" }}>
              {flightDetails.time}
            </span>
          </div>
        </div>

        {/* Flight Path Visualization */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{
            width: "2px",
            height: "60px",
            background: "linear-gradient(to bottom, #3b82f6, #93c5fd)",
            margin: "10px 0"
          }}></div>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "2px dashed #cbd5e1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#3b82f6",
              animation: "spin 3s linear infinite"
            }}></div>
            <span style={{ fontSize: "24px", color: "#3b82f6" }}>✈️</span>
          </div>
          <div style={{
            width: "2px",
            height: "60px",
            background: "linear-gradient(to bottom, #93c5fd, #3b82f6)",
            margin: "10px 0"
          }}></div>
          <div style={{
            position: "absolute",
            bottom: "-10px",
            background: "#f8fafc",
            padding: "4px 12px",
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#1e40af",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            {calculateFlightDuration(selectedFlight.quoto_detail.leg_times[1])}
          </div>
        </div>

        {/* Arrival */}
        <div style={{
          background: "white",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          transition: "transform 0.3s ease",
          zIndex: 2
        }} 
        onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "#10b981",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px"
            }}>
              <span style={{ color: "white", fontSize: "18px" }}>↓</span>
            </div>
            <h4 style={{ color: "#061953", margin: 0, fontSize: "1.1rem" }}>Arrival</h4>
          </div>
          <p style={{ fontSize: "1.4rem", fontWeight: 700, margin: "8px 0", color: "#065f46" }}>
            {getAirportById(flightDetails.to)?.source_IATA || 'N/A'}
          </p>
          <p style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "8px" }}>
            {getAirportById(flightDetails.to)?.airport_name}
          </p>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#ecfdf5",
            padding: "6px 12px",
            borderRadius: "20px",
            marginTop: "8px"
          }}>
            <span style={{ 
              width: "10px",
              height: "10px",
              background: "#10b981",
              borderRadius: "50%",
              marginRight: "8px"
            }}></span>
            <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#065f46" }}>
              Estimated Arrival
            </span>
          </div>
        </div>
      </div>

      {/* Stats and Cost in Card Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginBottom: "32px"
      }}>
        {/* Flight Stats Card */}
        <div style={{
          background: "white",
          padding: "28px",
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #93c5fd)"
          }}></div>
          <h4 style={{ 
            color: "#061953", 
            fontSize: "1.2rem", 
            marginBottom: "24px",
            display: "flex",
            alignItems: "center"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Flight Statistics
          </h4>
          {(!isRoundTrip) && 
                    <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "30px"
          }}>
            {[
              { label: "Flight Duration", value: calculateFlightDuration(selectedFlight.quoto_detail.leg_times[1]), icon: "⏱️" },
              { label: "Distance", value: `${nauticalMilesToKm(selectedFlight.quoto_detail.leg_distances[1])} NM`, icon: "📏" },
              { label: "Total Duration", value: calculateFlightDuration(selectedFlight.quoto_detail.total_time), icon: "🔄" },
              { label: "Total Distance", value: `${nauticalMilesToKm(selectedFlight.quoto_detail.total_distance)} NM`, icon: "🌐" },
            ].map((item, index) => (
              <div key={index} style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "12px",
                transition: "all 0.3s ease"
              }} onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#f8fafc"}>
                <div style={{ 
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  {/* <span style={{ marginRight: "8px", fontSize: "1.2rem" }}>{item.icon}</span> */}
                  <span style={{ 
                    fontSize: "0.85rem", 
                    color: "#64748b",
                    fontWeight: 500
                  }}>{item.label}</span>
                </div>
                <p style={{ 
                  fontSize: "1.3rem", 
                  fontWeight: "700", 
                  margin: 0,
                  color: "#1e3a8a"
                }}>{item.value}</p>
              </div>
            ))}
          </div>
          }
          {isRoundTrip && 
                    <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "30px"
          }}>
            {[
              { label: "Flight Duration", value: calculateFlightDuration(2*selectedFlight.quoto_detail.leg_times[1]), icon: "⏱️" },
              { label: "Distance", value: `${nauticalMilesToKm(2*selectedFlight.quoto_detail.leg_distances[1])} NM`, icon: "📏" },
              { label: "Total Duration", value: calculateFlightDuration(2*(selectedFlight.quoto_detail.leg_times[0] + selectedFlight.quoto_detail.leg_times[1])), icon: "🔄" },
              { label: "Total Distance", value: `${nauticalMilesToKm(selectedFlight.quoto_detail.total_distance)} NM`, icon: "🌐" },
              { label: "Stay Duration", value: calculateFlightDuration(calculateStayDurationInHours( flightDetails.date, flightDetails.time, flightDetails.returnDate, flightDetails.returnTime)), icon: "⏱️" },
            ].map((item, index) => (
              <div key={index} style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "12px",
                transition: "all 0.3s ease"
              }} onMouseOver={(e) => e.currentTarget.style.background = "#f1f5f9"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#f8fafc"}>
                <div style={{ 
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  {/* <span style={{ marginRight: "8px", fontSize: "1.2rem" }}>{item.icon}</span> */}
                  <span style={{ 
                    fontSize: "0.85rem", 
                    color: "#64748b",
                    fontWeight: 500
                  }}>{item.label}</span>
                </div>
                <p style={{ 
                  fontSize: "1.3rem", 
                  fontWeight: "700", 
                  margin: 0,
                  color: "#1e3a8a"
                }}>{item.value}</p>
              </div>
            ))}
          </div>
          }
        </div>

        {/* Cost Summary Card */}
        <div style={{
          background: "white",
          padding: "28px",
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #10b981, #34d399)"
          }}></div>
          <h4 style={{ 
            color: "#061953", 
            fontSize: "1.2rem", 
            marginBottom: "24px",
            display: "flex",
            alignItems: "center"
          }}>
            <div className="text-[#061953] text-xl mr-2">₹</div>
            Pricing Breakdown
          </h4>
          <div style={{ marginBottom: "20px" }}>
            {[
              { label: "Base Fare", value: `₹${Math.round(selectedFlight.quoto_detail.total_cost).toLocaleString()}` },
              { label: "Taxes (Incl. GST)", value: `₹${Math.round(selectedFlight.quoto_detail.total_cost_with_gst - selectedFlight.quoto_detail.total_cost).toLocaleString()}` }
            ].map((item, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                paddingBottom: "12px",
                borderBottom: "1px solid #f1f5f9"
              }}>
                <span style={{ color: "#64748b", fontSize: "0.95rem" }}>{item.label}</span>
                <span style={{ fontWeight: "600", color: "#334155" }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: "#f0fdf4",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #d1fae5"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ 
                fontSize: "1rem", 
                fontWeight: 600,
                color: "#065f46"
              }}>Total Amount</span>
              <span style={{ 
                fontSize: "1.6rem", 
                fontWeight: "800", 
                color: "#065f46",
                letterSpacing: "-0.5px"
              }}>₹{Math.round(selectedFlight.quoto_detail.total_cost_with_gst).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aircraft Details Section */}
      <div style={{
        background: "white",
        padding: "28px",
        borderRadius: "18px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
        marginBottom: "32px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h4 style={{ 
            color: "#061953", 
            fontSize: "1.2rem",
            margin: 0,
            display: "flex",
            alignItems: "center"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#64748b"/>
              <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6ZM12 16C9.791 16 8 14.209 8 12C8 9.791 9.791 8 12 8C14.209 8 16 9.791 16 12C16 14.209 14.209 16 12 16Z" fill="#64748b"/>
              <path d="M12 10C10.895 10 10 10.895 10 12C10 13.105 10.895 14 12 14C13.105 14 14 13.105 14 12C14 10.895 13.105 10 12 10Z" fill="#64748b"/>
            </svg>
            Aircraft Specifications
          </h4>
          {/* <div style={{
            background: "#f1f5f9",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#334155"
          }}>
            {selectedFlight.fleet.aircraftRegn}
          </div> */}
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
          gap: "16px"
        }}>
          {[
            { label: "Aircraft Model", value: selectedFlight.fleet_details.model, icon: "✈️" },
            { label: "Name", value: selectedFlight.fleet_details.name, icon: "🏷️" },
            { label: "Passenger Capacity", value: `${selectedFlight.fleet_details.capacity}`, icon: "👥" },
            {/* { label: "Cruising Speed", value: `${selectedFlight.fleet.cruisingSpeed} km/h`, icon: "💨" },
            { label: "Cruising Altitude", value: `${selectedFlight.fleet.cruisingLevel} ft`, icon: "☁️" },
            { label: "Year of Manufacture", value: selectedFlight.fleet.eom, icon: "📅" },
            { label: "AUW", value: selectedFlight.fleet.auw, icon: "⚖️" },
            { label: "Maintenance Status", value: "Operational", icon: "✅" } */}
          ].map((item, index) => (
            <div key={index} style={{
              background: "#f8fafc",
              padding: "16px",
              borderRadius: "12px",
              transition: "all 0.3s ease"
            }} onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
               onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ 
                display: "flex",
                alignItems: "center",
                marginBottom: "4px"
              }}>
                {/* <span style={{ marginRight: "8px", fontSize: "1.1rem" }}>{item.icon}</span> */}
                <span style={{ 
                  fontSize: "0.85rem", 
                  color: "#64748b",
                  fontWeight: 500
                }}>{item.label}</span>
              </div>
              <p style={{ 
                fontSize: "1.1rem", 
                fontWeight: "600", 
                margin: 0,
                color: "#1e293b"
              }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aircraft Gallery */}
      {selectedFlight?.fleet_details?.fleetInnerImages?.length > 0 && (
        <div style={{
          background: "white",
          padding: "28px",
          borderRadius: "18px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
          marginBottom: "32px"
        }}>
          <h4 style={{ 
            color: "#061953", 
            fontSize: "1.2rem",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
              <path d="M4 16L8.586 11.414C8.961 11.039 9.47 10.828 10 10.828C10.53 10.828 11.039 11.039 11.414 11.414L16 16" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L15.586 12.414C15.961 12.039 16.47 11.828 17 11.828C17.53 11.828 18.039 12.039 18.414 12.414L20 14" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H8.01" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Aircraft Gallery
          </h4>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "16px"
          }}>
            {selectedFlight.fleet_details.fleetInnerImages.map((imgUrl, idx) => (
              <div key={idx} style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                aspectRatio: "4/3",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }} onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                 onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}>
                <img
                  src={imgUrl}
                  alt={`Aircraft ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  padding: "12px",
                  color: "white",
                  fontSize: "0.85rem"
                }}>
                  {selectedFlight.fleet_details.name} - View {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "20px",
        borderTop: "1px solid rgba(0,0,0,0.08)"
      }}>
        <button onClick={() => setSelectedFlight(null)}
          style={{
            backgroundColor: "transparent",
            color: "#64748b",
            padding: "12px 24px",
            borderRadius: "8px",
            fontWeight: "600",
            border: "1px solid #e2e8f0",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f8fafc";
            e.currentTarget.style.color = "#334155";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#64748b";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "8px" }}>
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Results
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
  
};
export default FlightResults;