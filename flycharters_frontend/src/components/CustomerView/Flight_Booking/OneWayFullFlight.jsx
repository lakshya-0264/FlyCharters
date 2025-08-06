import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { Plane, MapPin, CalendarDays, Clock, Info, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FlightField from "./FlightField";
import Select from "react-select";
import loadingAnimation from "../../../assets/SearchLottie.json";
import FlightResults from "./FlightResults";
import { useDispatch, useSelector } from "react-redux";
import { addFlight } from "../../../utils/Redux _Store/flightTicketSlice";
import { addFleet } from "../../../utils/Redux _Store/fleetSlice";

const OneWayFullFlight = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const now = new Date();
  const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = `${String(future.getHours()).padStart(2, "0")}:00`;

  const [fullFlight, setFullFlight] = useState({
    from: "",
    to: "",
    date: dateStr,
    time: timeStr,
    passengers: "1",
    fullFlight: true
  });

    // POST Requested Fleet API CALL
  
// Enhanced debugging version of your fetchFleet function
// Enhanced debugging version of your fetchFleet function
const fetchFleet = async (departureDate, departureAirportId, destinationAirportId, departureTime) => {
  try {
    // Add detailed logging
    console.log('=== FETCH FLEET DEBUG ===');
    console.log('Parameters:', {
      departureDate,
      departureAirportId,
      destinationAirportId,
      departureTime
    });

    // Validate parameters before sending
    if (!departureDate || !departureAirportId || !destinationAirportId || !departureTime) {
      console.error('Missing required parameters:', {
        departureDate: !!departureDate,
        departureAirportId: !!departureAirportId,
        destinationAirportId: !!destinationAirportId,
        departureTime: !!departureTime
      });
      return [];
    }

    const requestBody = {
      departureDate,
      departureAirportId,
      destinationAirportId,
      departureTime,
      is_round_trip: false,
      stay_time_hour: null,
    };

    console.log('Request body:', requestBody);
    console.log('API URL:', import.meta.env.VITE_API_BASE_URL + "/fleet/availablefleet");

    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/fleet/availablefleet",
      requestBody,
      { withCredentials: true }
    );

    console.log('Full response:', res);
    console.log('Response status:', res.status);
    console.log('Response data:', res.data);
    console.log('Fleet data:', res.data.data);
    console.log('Fleet data length:', res.data.data?.length || 0);

    // Check if data exists and is array
    if (res.data.success && Array.isArray(res.data.data)) {
      dispatch(addFleet(res.data.data));
      return res.data.data;
    } else {
      console.warn('Unexpected response structure:', res.data);
      return [];
    }

  } catch (err) {
    console.error('=== FETCH FLEET ERROR ===');
    console.error('Error object:', err);
    console.error('Error response:', err.response);
    console.error('Error response data:', err.response?.data);
    console.error('Error status:', err.response?.status);
    console.error('Error message:', err.message);
    
    // Return empty array instead of undefined
    return [];
  }
};

// Enhanced handleSearch function with better error handling
const handleSearch = async () => {
  const { from, to, date, time } = fullFlight;

  console.log('=== HANDLE SEARCH DEBUG ===');
  console.log('Search parameters:', { from, to, date, time });

  // Validation
  if (!from || !to) {
    alert("Please select both departure and arrival airports");
    return;
  }

  if (from === to) {
    alert("Departure and arrival airports cannot be the same.");
    return;
  }

  // Validate date format
  if (!date) {
    alert("Please select a departure date");
    return;
  }

  // Validate time format
  if (!time) {
    alert("Please select a departure time");
    return;
  }

  setLoading(true);
  setSearchTriggered(true);
  setSearchResults([]); // Clear previous results

  try {
    console.log('Calling fetchFleet...');
    const results = await fetchFleet(date, from, to, time);
    
    console.log('fetchFleet returned:', results);
    console.log('Results type:', typeof results);
    console.log('Results is array:', Array.isArray(results));
    console.log('Results length:', results?.length);

    // Remove the setTimeout - it might be causing issues
    setSearchResults(results || []);
    setLoading(false);

    if (!results || results.length === 0) {
      console.warn('No fleet data returned');
      // You might want to show a message to user here
    }

  } catch (error) {
    console.error("Error in handleSearch:", error);
    setLoading(false);
    setSearchResults([]);
    // Consider showing an error message to the user
    alert("Failed to fetch flights. Please try again.");
  }
};

// Also check your date/time format - the backend might expect specific formats
const formatDateForAPI = (date) => {
  // If date is coming from a date picker, make sure it's in the right format
  // The backend might expect ISO string or specific format
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
};

const formatTimeForAPI = (time) => {
  // Make sure time is in the format expected by backend
  // Might need to be "HH:MM" or "HH:MM:SS"
  return time;
};

// Updated fetchFleet with proper formatting
const fetchFleetWithFormatting = async (departureDate, departureAirportId, destinationAirportId, departureTime) => {
  try {
    const formattedDate = formatDateForAPI(departureDate);
    const formattedTime = formatTimeForAPI(departureTime);

    console.log('Original vs Formatted:', {
      original: { departureDate, departureTime },
      formatted: { formattedDate, formattedTime }
    });

    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL + "/fleet/availablefleet",
      {
        departureDate: formattedDate,
        departureAirportId,
        destinationAirportId,
        departureTime: formattedTime,
        is_round_trip: false,
        stay_time_hour: null,
      },
      { withCredentials: true }
    );

    console.log('API Response:', res.data);
    
    if (res.data.success && res.data.data) {
      dispatch(addFleet(res.data.data));
      return res.data.data;
    }
    
    return [];
  } catch (err) {
    console.error('Fetch fleet error:', err.response?.data || err.message);
    return [];
  }
};// Fetch Airports API CALL
  const fetchAirports = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/air_port/get_all_airport", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });

      const airportList = res.data.data;
      setAirports(airportList);

      const mumbaiAirport = airportList.find(a => a.source_IATA === "BOM");
      const chennaiAirport = airportList.find(a => a.source_IATA === "MAA");

      if (mumbaiAirport && chennaiAirport) {
        setFullFlight(prev => ({
          ...prev,
          from: mumbaiAirport._id,
          to: chennaiAirport._id,
        }));
      }
    } catch (err) {
      console.error("Error fetching airports:", err);
      // Fallback static data
      const fallbackAirports = [
        { _id: "airport1", source_IATA: "BOM", airport_name: "Chhatrapati Shivaji Maharaj International Airport" },
        { _id: "airport2", source_IATA: "DEL", airport_name: "Indira Gandhi International Airport" },
        { _id: "airport3", source_IATA: "BLR", airport_name: "Kempegowda International Airport" },
        { _id: "airport4", source_IATA: "HYD", airport_name: "Rajiv Gandhi International Airport" }
      ];
      setAirports(fallbackAirports);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

    const airportOptions = airports.map((a) => ({
      value: a._id,
      label: `${a.source_IATA} - ${a.airport_name}`,
    }));

    const passengerOptions = [...Array(10)].map((_, i) => ({
      value: (i + 1).toString(),
      label: `${i + 1}`,
    }));



    const customStyles = {
      control: (base) => ({
        ...base,
        paddingLeft: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        boxShadow: "none",
        height: "42px",
      }),
      menu: (base) => ({
        ...base,
        zIndex: 100,
      }),
    };

    // console.log(searchResults);
    // console.log(fullFlight);
    // console.log(airports);

  return (
    <div style={{ padding: "0px 10px" }}>
      {/* Form Card */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          marginBottom: "40px",
          borderLeft: "6px solid #061953"
        }}
      >
        <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 40px 2fr 1fr 1fr 1fr auto",
          gap: "14px",
          alignItems: "end",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <FlightField
          label="Departure"
          icon={MapPin}
          value={fullFlight.from}
          onChange={(val) => setFullFlight({ ...fullFlight, from: val })}
          options={airportOptions}
          placeholder="Search Departure"
        />
        
         {/* Swap Button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "4px" }}>
            <button
              onClick={() => {
                setFullFlight((prev) => ({
                  ...prev,
                  from: prev.to,
                  to: prev.from
                }));
              }}
              title="Swap Departure & Arrival"
              style={{
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                padding: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "rotate(180deg)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "rotate(0deg)"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" fill="#1e3a8a" viewBox="0 0 20 20">
                <path d="M4 17h13.17l-3.59 3.59L15 22l6-6-6-6-1.41 1.41L17.17 15H4v2zm16-10H6.83l3.59-3.59L9 2 3 8l6 6 1.41-1.41L6.83 9H20V7z"/>
              </svg>
            </button>
          </div>

        <FlightField
          label="Arrival"
          icon={MapPin}
          value={fullFlight.to}
          onChange={(val) => setFullFlight({ ...fullFlight, to: val })}
          options={airportOptions}
          placeholder="Search Arrival"
        />

        <div style={{ position: "relative" }}>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
            Date
          </label>
          <input
            type="date"
            value={fullFlight.date}
            onChange={(e) => setFullFlight({ ...fullFlight, date: e.target.value })}
            style={{
              padding: "10px 12px 10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
            Time
          </label>
          <input
            type="time"
            value={fullFlight.time}
            onChange={(e) => setFullFlight({ ...fullFlight, time: e.target.value })}
            style={{
              padding: "10px 12px 10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
            Passengers
          </label>
          <Select
            value={passengerOptions.find((o) => o.value === fullFlight.passengers)}
            onChange={(selected) => setFullFlight({ ...fullFlight, passengers: selected?.value })}
            options={passengerOptions}
            styles={customStyles}
            isClearable
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={handleSearch}
            disabled={loading || !fullFlight.from || !fullFlight.to || fullFlight.from === fullFlight.to}
            style={{
              backgroundColor: loading ? "#94a3b8" : "#061953",
              color: "#fff",
              padding: "12px 28px",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              letterSpacing: "1px",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </div>


        <div
          className="mt-9 flex justify-center"
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/user/empty-leg")}
              style={{
                display: "flex",
                alignContent: "center",
                gap: "10px",
                background: "linear-gradient(135deg, #061953, #1e40af)",
                color: "#fff",
                border: "1.5px dashed #061953",
                padding: "12px 20px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              }}
            >
              <Plane size={18} />
              Want to book an Empty Leg Flight?
            </button>

            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                color: "#1d4ed8",
                border: "none",
                borderRadius: "25%",
                cursor: "pointer",
                transition: "all 0.3s ease",
                // boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <Info size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div> 
      </div> 

      {/* Modal */}
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

            <h1 style={{ color: "#061953", fontSize: "1.8rem", fontWeight: "bold", marginBottom: "20px" }}>
              What is an Empty Leg Flight?
            </h1>
            <p style={{ fontSize: "1rem", color: "#444", lineHeight: 1.7 }}>
              An <strong>Empty Leg Flight</strong> is a discounted one-way private jet flight that's scheduled to fly without passengers — often because it's returning to base or repositioning.
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

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Lottie animationData={loadingAnimation} loop style={{ width: "400px", height: "250px", marginLeft: "475px" }} />
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Searching for available flights...
          </p>
        </div>
      )}

      {/* No Results */}
      {searchTriggered && !loading && searchResults.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h4 style={{ marginTop: "20px", fontSize: "1.25rem", color: "#666" }}>
            No flights found for your search criteria
          </h4>
          <p style={{ color: "#888", marginTop: "8px" }}>
            Please try adjusting your departure/arrival airports or date
          </p>
        </div>
      )}

      {/* Initial State Message */}
      {!searchTriggered && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ color: "#555", fontSize: "1.1rem" }}>
            Start by choosing your route and date
          </p>
        </div>
      )}

      {Array.isArray(searchResults) && searchResults.length > 0 && !loading && (
        <FlightResults
          searchResults={searchResults}
          flightDetails={fullFlight}
          airports={airports}
          isRoundTrip={false}
        />
      )}
    </div>
  );
};

export default OneWayFullFlight;