import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { Plane, MapPin, CalendarDays, Clock, Info, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FlightField from "./FlightField";
import Select from "react-select";
import loadingAnimation from "../../../assets/SearchLottie.json";
import idlePlaneAnimation from "../../../assets/idlePlaneAnimation1.json";
import FlightResults from "./FlightResults";
import { useDispatch } from "react-redux";
import { addFleet } from "../../../utils/Redux _Store/fleetSlice";
import { toast } from "react-toastify";

const RoundTrip = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const now = new Date();
  const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = `${String(future.getHours()).padStart(2, "0")}:00`;

  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + 1);
  const returnStr = nextDay.toISOString().split("T")[0];

  const [fullFlight, setFullFlight] = useState({
    from: "",
    to: "",
    date: dateStr,
    time: timeStr,
    returnDate: returnStr,
    returnTime: timeStr,
    passengers: "1",
    fullFlight: true
  });

  useEffect(() => {
  if (fullFlight.date) {
    const depDate = new Date(fullFlight.date);
    depDate.setDate(depDate.getDate() + 1);
    const returnDateStr = depDate.toISOString().split("T")[0];

    setFullFlight((prev) => ({
      ...prev,
      returnDate: returnDateStr,
    }));
  }
}, [fullFlight.date, fullFlight.to]);



    // POST Requested Fleet API CALL
  const fetchFleet = async ( departureDate, departureAirportId, destinationAirportId, departureTime, stayTimeHour ) => {
    try{
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + "/fleet/availablefleet", {
        departureDate,
        departureAirportId,
        destinationAirportId,
        departureTime,
        is_round_trip: true,
        stay_time_hour: stayTimeHour,
      }, {withCredentials: true,});
      console.log(res.data.data);
      dispatch(addFleet(res.data.data));
      return res?.data.data;
    } catch(err){
      console.log(err.response.data);
    }
  }

  // Fetch Airports API CALL
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

    const calculateStayDurationInHours = (departureDate, departureTime, returnDate, returnTime) => {
      const start = new Date(`${departureDate}T${departureTime}`);
      const end = new Date(`${returnDate}T${returnTime}`);
      const diffMs = end - start;

      if (isNaN(diffMs) || diffMs < 0) return 0;

      const diffHours = diffMs / (1000 * 60 * 60); // ms to hours
      return diffHours.toFixed(2);
    };

  const handleSearch = async () => {
    const { from, to, date, time } = fullFlight;

    if (!from || !to) {
      toast.error("Please select both departure and arrival airports");
      setSearchResults([]);
      return;
    }

    if (from === to) {
      toast.error("Departure and arrival airports cannot be the same.");
      setSearchResults([]);
      return;
    }

    const stayTimeHour = calculateStayDurationInHours( fullFlight.date, fullFlight.time, fullFlight.returnDate, fullFlight.returnTime);

    if (stayTimeHour > 48) {
      toast.error("Return time must be within 48 hours of departure.");
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setSearchTriggered(true);
    setSearchResults([]);

    try {
      const results = await fetchFleet(date, from, to, time, stayTimeHour );
      setTimeout(() => {
        setSearchResults(results || []);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching fleet:", error);
      toast.error("Something went wrong while searching.");
      setLoading(false);
      setSearchResults([]);
    }
  };
  
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

    const minReturnDateTime = `${fullFlight.date}T${fullFlight.time}`;
    const maxReturnDateTime = (() => {
        const depDateTime = new Date(`${fullFlight.date}T${fullFlight.time}`);
        depDateTime.setHours(depDateTime.getHours() + 48);
        return depDateTime.toISOString().slice(0, 16);
      })();


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
            gridTemplateColumns: "2fr 40px 2fr 2fr 2fr 1fr",
            gap: "14px",
            alignItems: "end",
            marginBottom: "20px",
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
              Departure Date & Time
            </label>
            <input
              type="datetime-local"
              value={`${fullFlight.date}T${fullFlight.time}`}
              onChange={(e) => {
                const [date, time] = e.target.value.split("T");
                setFullFlight({ ...fullFlight, date, time });
              }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
                fontSize: "14px",
                letterSpacing: "1px" 
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
              Return Date & Time
            </label>
            <input
              type="datetime-local"
              value={`${fullFlight.returnDate || fullFlight.date}T${fullFlight.returnTime || fullFlight.time}`}
              min={minReturnDateTime}
              max={maxReturnDateTime}
              onChange={(e) => {
                const [date, time] = e.target.value.split("T");
                setFullFlight({ ...fullFlight, returnDate: date, returnTime: time });
              }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
                fontSize: "14px",
                letterSpacing: "1px" 
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
        </div>

      <div className="flex justify-center mt-10">
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button
            onClick={handleSearch}
            disabled={loading || !fullFlight.from || !fullFlight.to}
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
      </div> 
      

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

      {/* Idle Animation */}
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
          isRoundTrip={true}
        />
      )}
    </div>
  );
};

export default RoundTrip;