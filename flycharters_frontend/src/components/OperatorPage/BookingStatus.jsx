import React, { useEffect, useState } from "react";
import { getFlightsById,getAirportById } from "../../api/authAPI";
import loadingGif from "../../assets/LoadingGIF.gif";
import { CiChat1 } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

import { 
  FiCalendar, 
  FiClock, 
  FiDollarSign, 
  FiUsers, 
  FiNavigation, 
  FiMapPin,
  FiAirplay,
  FiTag,
  FiCreditCard
} from "react-icons/fi";
import { FaPlane, FaRegCalendarAlt, FaRegMoneyBillAlt } from "react-icons/fa";
import axios from 'axios';
import EmptyLegModal from "./EmptyLegModal";

const OpeFlightStatus = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // For Automated Empty Leg Suggestion
  const [emptyLegs, setEmptyLegs] = useState([]);
  const [showEmptyLegModal, setShowEmptyLegModal] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [addedLegs, setAddedLegs] = useState({});


  useEffect(() => {
    const loadFlights = async () => {
      try {
        const response = await getFlightsById();
        setFlights(response.data.data || []);
        const flightsData = response.data.data || [];
        console.log('fleetData',flightsData);
        const flightsWithAirportNames = await Promise.all(
          flightsData.map(async (flight) => {
            const fleet = flight?.fleet;
            console.log(fleet);
            let departureName = "Unknown";
            let destinationName = "Unknown";
            try {
              const depRes = await getAirportById(fleet.deparature_airport_id);
              console.log(depRes);
              departureName = depRes.data?.data?.airport_name || "Unknown";
              console.log(departureName)
            } catch (err) {
              // console.error(`Error fetching departure airport for ID ${fleet.departure_airport_id}`, err);
            }

            try {
              const destRes = await getAirportById(fleet.destination_airport_id);
              destinationName = destRes.data?.data?.airport_name || "Unknown";
            } catch (err) {
              // console.error(`Error fetching destination airport for ID ${fleet.destination_airport_id}`, err);
            }

            return {
              ...flight,
              departure_airport_name: departureName,
              destination_airport_name: destinationName,
            };
          })
        );

        setFlights(flightsWithAirportNames);
      } catch (err) {
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  const navigate = useNavigate();
  // const handleClick = () => {
  //   navigate(`/operator/chat-to-user/${flight.user_id}`);
  // };

  // API CALLS for Suggested Empty Legs
  const fetchEmptyLegs = async (flightId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/empty/suggest/${flightId}`);
      const data = res.data.data;
      let legs = [];
      if (Array.isArray(data)) {
        legs = data;
      } else if (typeof data === 'object' && data !== null && data.empty_leg_obj1) {
        legs = Object.values(data);
      } else if (typeof data === 'object' && data !== null) {
        legs = [data];
      }
      setEmptyLegs(legs);
      setShowEmptyLegModal(true);
      setSelectedFlightId(flightId);
      // console.log("Fetched empty legs:", legs);
    } catch (err) {
      console.error("Error fetching empty legs", err);
    }
  };

  const handleAddEmptyLeg = async (emptyLegObj) => {
    try {
      await axios.post(import.meta.env.VITE_API_BASE_URL + "/empty/add_flight", 
        {empty_leg_object: emptyLegObj},
      {
        withCredentials: true, 
      }
      );
      setAddedLegs((prev) => ({ ...prev, [JSON.stringify(emptyLegObj)]: true }));
    } catch (err) {
      console.error("Failed to add empty leg", err);
    }
  };

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <div style={{ 
          fontSize: "2rem", 
          fontWeight:"500",
          textTransform:'uppercase',
          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          {/* <FaPlane size={20} /> */}
          <h1 >Your Flight Bookings</h1>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginBottom: "30px",
        gap: "15px",
      }}>
        <div style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "space-between",
          flexGrow: 1
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "0 10px",
            border: "1px solid #333",
            minWidth: "200px"
          }}>
            <FiCreditCard style={{ color: "#061953", marginRight: "8px" }} />
            <select style={{ 
              padding: "10px 8px",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              width: "100%",
              fontSize: "14px",
              color: "#333"
            }}>
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "0 10px",
            border: "1px solid #333",
            flexGrow: 1,
          }}>
            <FiNavigation style={{ color: "#061953", marginRight: "8px" }} />
            <input
              type="text"
              placeholder="Search flights..."
              style={{ 
                padding: "10px 8px", 
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                width: "100%",
                fontSize: "14px",
                color: "#333"
              }}
            />
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "0 10px",
            border: "1px solid #333",
            minWidth: "200px"
          }}>
            <FiCalendar style={{ color: "#061953", marginRight: "8px" }} />
            <select style={{ 
              padding: "10px 8px",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              width: "100%",
              fontSize: "14px",
              color: "#333"
            }}>
              <option>Sort by Default</option>
              <option>Newest First</option>
              <option>Highest Cost</option>
              <option>Date</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "300px" 
        }}>
          <img src={loadingGif} alt="Loading..." style={{ width: "200px" }} />
        </div>
      ) : flights.length > 0 ? (
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {flights.map((flight) => {
            const { com, fleet, passengerDetails } = flight;
            console.log('hello world',flight);
            return (
              <div
                key={flight._id}
                style={{
                  position: "relative",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "25px",
                  backgroundColor: "white",
                  color: "#333",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "20px",
                  flexWrap: "wrap",
                  gap: "15px"
                }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <h2 style={{ 
                      fontSize: "18px", 
                      fontWeight: "600", 
                      marginBottom: "12px",
                      color: "#061953",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <FiAirplay size={18} />
                      <span>{com?.name || "Unnamed Aircraft"}</span>
                    </h2>
                    <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                          <FiTag size={16} style={{ color: "#061953", marginRight: "8px", opacity: 0.7 }} />
                          <span style={{ fontSize: "14px", marginRight: "15px", color: "#666" }}>Reg No:</span>
                          <span style={{ fontSize: "14px", fontWeight: "500" }}>{com?.aircraftRegn || "N/A"}</span>
                        </p>
                        <p style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                          <FiAirplay size={16} style={{ color: "#061953", marginRight: "8px", opacity: 0.7 }} />
                          <span style={{ fontSize: "14px", marginRight: "15px", color: "#666" }}>Model:</span>
                          <span style={{ fontSize: "14px", fontWeight: "500" }}>{com?.model || "N/A"}</span>
                        </p>
                      </div>
                      <div>
                        <p style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                          <FiTag size={16} style={{ color: "#061953", marginRight: "8px", opacity: 0.7 }} />
                          <span style={{ fontSize: "14px", marginRight: "15px", color: "#666" }}>Quote ID:</span>
                          <span style={{ fontSize: "14px", fontWeight: "500" }}>{flight.quote_id}</span>
                        </p>
                        <p style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}>
                          <FiUsers size={16} style={{ color: "#061953", marginRight: "8px", opacity: 0.7 }} />
                          <span style={{ fontSize: "14px", marginRight: "15px", color: "#666" }}>Passengers:</span>
                          <span style={{ fontSize: "14px", fontWeight: "500" }}>{passengerDetails?.length || 0}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-end",
                    gap: "10px"
                  }}>
                    <span
                      style={{
                        backgroundColor: flight.payment_status === "completed" ? "#e8f5e9" : "#ffebee",
                        color: flight.payment_status === "completed" ? "#2e7d32" : "#c62828",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontWeight: "500",
                        fontSize: "13px",
                        textTransform: "capitalize",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      {flight.payment_status === "completed" ? (
                        <FiCreditCard size={14} />
                      ) : (
                        <FiCreditCard size={14} />
                      )}
                      {flight.payment_status}
                    </span>
                    <p style={{ 
                      fontSize: "13px", 
                      color: "#666",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <FaRegCalendarAlt size={14} />
                      Booked on {new Date(flight.booking_time).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "20px 30px",
                  marginBottom: "20px",
                  padding: "20px 0",
                  borderTop: "1px solid #f0f0f0",
                  borderBottom: "1px solid #f0f0f0"
                }}>
                  <div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginBottom: "8px",
                      color: "#666"
                    }}>
                      <FiMapPin size={16} style={{ marginRight: "8px" }} />
                      <h3 style={{ fontSize: "14px", fontWeight: "500" }}>Departure</h3>
                    </div>
                    <div style={{ paddingLeft: "24px" }}>
                      <p style={{ 
                        fontWeight: "500", 
                        color: "#333",
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                      </p>
                      <p style={{ 
                        fontWeight: "500", 
                        color: "#333",
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "4px"
                      }}>
                        <span>{flight?.fleet?.deparature_airport_id?.airport_name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      marginBottom: "8px",
                      color: "#666"
                    }}>
                      <FiMapPin size={16} style={{ marginRight: "8px" }} />
                      <h3 style={{ fontSize: "14px", fontWeight: "500" }}>Arrival</h3>
                    </div>
                    <div style={{ paddingLeft: "24px" }}>
                      <p style={{ 
                        fontWeight: "500", 
                        color: "#333",
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                      </p>
                      <p style={{ 
                        fontWeight: "500", 
                        color: "#333",
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "4px"
                      }}>
                        <span> {flight?.fleet?.destination_airport_id?.airport_name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      color: "#666"
                    }}>
                      <FiNavigation size={16} style={{ marginRight: "8px" }} />
                      <h3 style={{ fontSize: "14px", fontWeight: "500" }}>Flight Details</h3>
                    </div>
                    <div style={{ paddingLeft: "24px" }}>
                      <p style={{ 
                        fontWeight: "500", 
                        color: "#333",
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <FiClock size={14} color="#666" />Total time:
                        <span>{fleet?.total_time} </span>
                      </p>
                      <p style={{ 
                        fontWeight: "500", 
                        color: "#333",
                        lineHeight: "1.5",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "4px"
                      }}>
                        <FiNavigation size={14} color="#666" />Total distance:
                        <span>{fleet?.total_distance}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      color: "#666"
                    }}>
                      <h3 style={{ fontSize: "14px", fontWeight: "500" }}>₹ Total Cost</h3>
                    </div>
                    <div style={{ paddingLeft: "24px" }}>
                      <p style={{ 
                        fontWeight: "600", 
                        color: "#061953",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span>{fleet?.total_cost_with_gst?.toFixed(2)} (incl. GST)</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "15px",position:'relative' }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "8px",
                    color: "#666"
                  }}>
                    <FiTag size={16} style={{ marginRight: "8px" }} />
                    <h3 style={{ fontSize: "14px", fontWeight: "500" }}>Addons</h3>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    gap: "12px", 
                    flexWrap: "wrap",
                    paddingLeft: "24px"
                  }}>
                    {flight.pet_addon > 0 && (
                      <span style={{ 
                        backgroundColor: "#f5f5f5",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#333"
                      }}>
                        Pet: ₹{flight.pet_addon}
                      </span>
                    )}
                    {flight.party_addon > 0 && (
                      <span style={{ 
                        backgroundColor: "#f5f5f5",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#333"
                      }}>
                        Party: ₹{flight.party_addon}
                      </span>
                    )}
                    {flight.food_service_addon > 0 && (
                      <span style={{ 
                        backgroundColor: "#f5f5f5",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#333"
                      }}>
                        Food: ₹{flight.food_service_addon}
                      </span>
                    )}
                    {flight.pet_addon === 0 && flight.party_addon === 0 && flight.food_service_addon === 0 && (
                      <span style={{ 
                        color: "#666",
                        fontSize: "13px",
                        fontStyle: "italic"
                      }}>
                        No addons selected
                      </span>
                    )}
                  </div>
                  <div style={{ position: "absolute", bottom: "0px", right: "20px",display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem'}}>
                    <div onClick={() => navigate(`/operator/chat-to-user`, {state: { userId: flight.user_id, userName: flight.user_Name, 
},})}  style={{backgroundColor:'#061953',color:'white',padding:"5px 20px",borderRadius:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'5px',cursor:'pointer'}}><CiChat1 style={{marginTop:'4px',fontSize:'1.5rem'}}/>chat with user</div>
                    
                    <button
                      onClick={() => fetchEmptyLegs(flight._id)}
                      style={{
                        backgroundColor: "#061953",
                        color: "white",
                        padding: "10px 18px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "500",
                        border: "none",
                        transition: "background 0.2s ease-in-out",
                        cursor: "pointer",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#10267e"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#061953"}
                    >
                      View Empty Legs
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          color: "#666",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #333"
        }}>
          <FiAirplay size={48} style={{ marginBottom: "16px", color: "#061953", opacity: 0.5 }} />
          <p style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "500" }}>No flights found</p>
          <p style={{ fontSize: "14px", opacity: 0.7 }}>Try adjusting your search filters</p>
        </div>
      )}
      {showEmptyLegModal && (
        <EmptyLegModal
          emptyLegs={emptyLegs}
          onClose={() => setShowEmptyLegModal(false)}
          onAdd={handleAddEmptyLeg}
          addedLegs={addedLegs}
        />
      )}
    </div>
  );
};

export default OpeFlightStatus;