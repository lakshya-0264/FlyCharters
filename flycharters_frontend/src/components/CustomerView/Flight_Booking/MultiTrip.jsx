import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { MapPin, Plane, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FlightField from "./FlightField";
import Select from "react-select";
import loadingAnimation from "../../../assets/SearchLottie.json";
import idlePlaneAnimation from "../../../assets/idlePlaneAnimation1.json";
import FlightResults from "./FlightResults";
import { useDispatch } from "react-redux";
import { addFleet } from "../../../utils/Redux _Store/fleetSlice";

const MultiTrip = () => {
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

  const [legs, setLegs] = useState([
    {
      from: "",
      to: "",
      date: dateStr,
      time: timeStr,
      passengers: "1",
    }
  ]);

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
        setLegs((prev) => {
          const newLegs = [...prev];
          newLegs[0].from = mumbaiAirport._id;
          newLegs[0].to = chennaiAirport._id;
          return newLegs;
        });
      }
    } catch (err) {
      console.error("Error fetching airports:", err);
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

  const fetchFleet = async (departureDate, departureAirportId, destinationAirportId, departureTime) => {
    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + "/fleet/availablefleet", {
        departureDate,
        departureAirportId,
        destinationAirportId,
        departureTime,
      }, { withCredentials: true });
      dispatch(addFleet(res.data.data));
      return res?.data.data;
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleSearch = async () => {
    const { from, to, date, time } = legs[0];

    if (!from || !to || from === to) {
      alert("Please select valid departure and arrival airports.");
      return;
    }

    setLoading(true);
    setSearchTriggered(true);
    setSearchResults([]);

    try {
      const results = await fetchFleet(date, from, to, time);
      setTimeout(() => {
        setSearchResults(results || []);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching fleet:", error);
      setLoading(false);
      setSearchResults([]);
    }
  };

  const addLeg = () => {
    const lastLeg = legs[legs.length - 1];
    setLegs([
      ...legs,
      {
        from: lastLeg.to || "",
        to: "",
        date: lastLeg.date,
        time: lastLeg.time,
        passengers: "1"
      }
    ]);
  };

  const removeLeg = (index) => {
    if (legs.length === 1) return;
    const newLegs = [...legs];
    newLegs.splice(index, 1);
    setLegs(newLegs);
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

  return (
    <div style={{ padding: "0px 10px" }}>
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
        {legs.map((leg, index) => (
          <div
            key={index}
            style={{
              background: "#f9f9f9",
              padding: "20px",
              borderRadius: "20px",
              marginBottom: "20px",
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              fontWeight: "600",
              fontSize: "1.1rem",
              color: "#061953"
            }}>
              <span style={{
                background: "#061953",
                color: "white",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}>
                <Plane size={18} />
              </span>
              Leg {index + 1}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 40px 2fr 1fr 1fr 1fr auto",
              gap: "14px",
              alignItems: "end",
            }}>
              <FlightField
                label="Departure"
                icon={MapPin}
                value={leg.from}
                onChange={(val) => {
                  const updated = [...legs];
                  updated[index].from = val;
                  setLegs(updated);
                }}
                options={airportOptions}
                placeholder="Search Departure"
              />

              {/* Swap Button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "4px" }}>
                <button
                  onClick={() => {
                    const updated = [...legs];
                    const temp = updated[index].from;
                    updated[index].from = updated[index].to;
                    updated[index].to = temp;
                    setLegs(updated);
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
                value={leg.to}
                onChange={(val) => {
                  const updated = [...legs];
                  updated[index].to = val;
                  setLegs(updated);
                }}
                options={airportOptions}
                placeholder="Search Arrival"
              />

              <div style={{ position: "relative" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Date</label>
                <input
                  type="date"
                  value={leg.date}
                  onChange={(e) => {
                    const updated = [...legs];
                    updated[index].date = e.target.value;
                    setLegs(updated);
                  }}
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
              <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Time</label>
                <input
                  type="time"
                  value={leg.time}
                  onChange={(e) => {
                    const updated = [...legs];
                    updated[index].time = e.target.value;
                    setLegs(updated);
                  }}
                  style={{
                    padding: "10px 12px 10px 20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    width: "100%",
                    fontSize: "14px",
                  }}
                />
              </div>

              {index == 0 && <div style={{ flex: "1" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", display: "block" }}>Passengers</label>
                <Select
                  value={passengerOptions.find((o) => o.value === leg.passengers)}
                  onChange={(selected) => {
                    const updated = [...legs];
                    updated[index].passengers = selected?.value || "1";
                    setLegs(updated);
                  }}
                  options={passengerOptions}
                  styles={customStyles}
                  isClearable
                />
              </div>}

              {index !== 0 && legs.length > 1 && (
                <button
                  onClick={() => removeLeg(index)}
                  style={{
                    marginTop: "24px",
                    height: "40px",
                    backgroundColor: "#ffecec",
                    color: "#d32f2f",
                    border: "1px solid #d32f2f",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0 16px",
                    transition: "0.3s",
                  }}
                >
                  <Trash2 size={16} /> Remove Leg
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="mt-10 mb-4">
          {/* Add Another Leg Button */}
          <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={addLeg}
                style={{
                  background: "linear-gradient(135deg, #061953, #1e40af)",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <div className="flex justify-center gap-1"><Plus size={20}/><span>Add Another Leg</span></div>
              </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10 mt-10 gap-10">
        {/* Search Button */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                background: loading ? "#94a3b8" : "#061953",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "10px",
                fontWeight: "600",
                fontSize: "1rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease"
              }}
            >
              {loading ? "Searching..." : "Search Flights"}
            </button>
          </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center" }}>
          <Lottie animationData={loadingAnimation} loop style={{ width: "400px", height: "250px", marginLeft: "475px" }} />
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Searching for available flights...
          </p>
        </div>
      )}

      {!searchTriggered && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ color: "#555", fontSize: "1.1rem" }}>
            Start by choosing your route and date
          </p>
        </div>
      )}

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

      {Array.isArray(searchResults) && searchResults.length > 0 && !loading && (
        <FlightResults
          searchResults={searchResults}
          flightDetails={legs[0]}
          airports={airports}
        />
      )}
    </div>
  );
};

export default MultiTrip;