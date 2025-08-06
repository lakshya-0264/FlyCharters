import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import { Plane, MapPin, CalendarDays, Clock, Users, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FlightField from "./FlightField";
import loadingAnimation from "../../../assets/SearchLottie.json";
import noResultsAnimation from "../../../assets/NewNoResults.json";
// import idlePlaneAnimation from "../../../assets/idlePlaneAnimation2.json";
import PassengerDetails, { getDefaultPassenger } from "../Passenger_Details/PassengerDetails";
import EmptyLegCard from "./EmptyLegCard";

const OneWayEmptyLeg = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [showPassengerSection, setShowPassengerSection] = useState(false);
  const navigate = useNavigate();
  const [allFlights, setAllFlights] = useState([]);
  const [page, setPage] = useState(0);
  const flightsPerPage = 2;
  const [selectedFlight, setSelectedFlight] = useState(null);


  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);

  const now = new Date();
  const future = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = `${String(future.getHours()).padStart(2, "0")}:00`;

  const [emptyLeg, setEmptyLeg] = useState({
    from: "",
    to: "",
    date: dateStr,
    time: timeStr,
    pax: "1"
  });

  const [petDetails, setPetDetails] = useState({
    isPet: false,
    type: "",
    specify: "",
    weight: "",
    vaccinationCertificate: "",
    sitToTravelCertificate: false,
    sitToTravelCertificateDate: "",
    agreePetPolicy: false,
  });


  const [corporateDetails, setCorporateDetails] = useState({
    isCorporate: false,
    companyName: "",
    companyId: ""
  });


  const inputStyle = {
    padding: "12px 14px 12px 40px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize: "0.95rem",
    backgroundColor: "#fff",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)"
  };

  // Fetch Airports API CALL
  const fetchAirports = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/air_port/get_all_airport", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true
      });

      const airportList = res.data.data;
      setAirports(airportList);

      const mumbaiAirport = airportList.find(a => a.source_IATA === "DEL");
      const chennaiAirport = airportList.find(a => a.source_IATA === "BOM");

      if (mumbaiAirport && chennaiAirport) {
        setEmptyLeg(prev => ({
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

  useEffect(() => {
  if (!searchTriggered) {
    axios.get(import.meta.env.VITE_API_BASE_URL + "/empty/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true
    }).then((res) => {
      setAllFlights(res.data.data || []);
    }).catch((err) => {
      console.error("Error fetching all empty legs:", err);
    });
  }
}, [searchTriggered]);


  const handleSearch = async () => {
    setSearchTriggered(true);
    setShowPassengerSection(false);
    setSearchResults([]);

      // Validate input
      if (emptyLeg.from === emptyLeg.to) {
        toast.error("Departure and Arrival airports must be different.");
        return;
      }

      if (!emptyLeg.pax || isNaN(emptyLeg.pax) || parseInt(emptyLeg.pax) <= 0) {
        toast.error("Please enter a valid number of passengers (at least 1).");
        return;
      }

      if (!emptyLeg.from || !emptyLeg.to || !emptyLeg.date || !emptyLeg.time) {
        toast.error("Please fill out all fields.");
        return;
      }

      setLoading(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/empty/search",
        {
          takeOff_Airport: emptyLeg.from,
          destination_Airport: emptyLeg.to,
          departureDate: emptyLeg.date,
          departureTime: emptyLeg.time,
          minSeatsRequired: parseInt(emptyLeg.pax)
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true
        }
      );
      // console.log(new Date(`${emptyLeg.date}T${emptyLeg.time}`).toISOString());
      setSearchResults(res.data.data);
    } catch (err) {
      console.error("Search failed", err.response?.data || err.message);
    
      if (err.response?.status === 404) {
        toast.info("No available flights found for the selected date and time.");
        setSearchResults([]);
      } else {
        toast.error("Failed to fetch flights.");
      }
    }

    setLoading(false);
  };

  const handleBookNow = (flight) => {
    const pax = parseInt(emptyLeg.pax || "1");
    const newPassengers = Array.from({ length: pax }, () => ({
      ...getDefaultPassenger(),
      isEditing: true
    }));
    localStorage.setItem("selectedFlightId", flight._id);
    setPassengers(newPassengers);
    setSelectedFlight(flight); 
    setShowPassengerSection(true);
  };

const handleConfirm = async () => {
  try {
    const empty_leg_id = localStorage.getItem("selectedFlightId");

    if (!empty_leg_id) {
      toast.error("No flight selected.");
      return;
    }

    if (!selectedFlight) {
    toast.error("Selected flight not found.");
    return;
  }

    const pax = parseInt(emptyLeg.pax);
    const pricePerSeat = selectedFlight?.priceperseat || 1;

    const formData = new FormData();
    formData.append("seats_booked", pax);
    formData.append("total_amount", pax * pricePerSeat);
    formData.append("passengerDetails", JSON.stringify(passengers));

    formData.append("corporateDetails", JSON.stringify(corporateDetails));

    const {
      isPet,
      type,
      specify,
      weight,
      vaccinationCertificate,
      sitToTravelCertificate,
      sitToTravelCertificateDate,
      agreePetPolicy
    } = petDetails;

    // Always send petDetails — even if isPet is false
    const petPayload = {
      isPet,
      ...(isPet && {
        type,
        specify,
        weight,
        sitToTravelCertificate,
        sitToTravelCertificateDate,
        agreePetPolicy
      })
    };
    formData.append("petDetails", JSON.stringify(petPayload));

    if (isPet && vaccinationCertificate) {
      formData.append("vaccinationCertificate", vaccinationCertificate);
    }

    const unsaved = passengers.find(p => p.isEditing);
    if (unsaved) {
      toast.error("Please save all passenger details before proceeding.");
      return;
    }

    if (!acceptDisclaimer) {
    toast.error("Please accept the undertaking before proceeding.");
    return;
  }

    const res = await axios.post(
      import.meta.env.VITE_API_BASE_URL + `/emptylegbooking/book/${empty_leg_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      }
    );

    const bookingId = res?.data?.data?._id;

    toast.success("Booking confirmed!");

    navigate("/user/confirm-oneway-empty", {
      state: {
        bookingId,
        passengers
      }
    });

  } catch (err) {
    const backendMsg = err.response?.data?.message;
    if (backendMsg) {
      toast.error(backendMsg);
    } else {
      toast.error("Something went wrong during booking.");
    }
  }
};


  return (
    <>
    <div style={{ padding: "10px 10px" }}>
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
          marginBottom: "30px",
          marginTop: "20px",
        }}
      >
          {/* FROM */}
        <FlightField
            label="Departure"
            icon={MapPin}
            value={emptyLeg.from}
            onChange={(val) => setEmptyLeg({ ...emptyLeg, from: val })}
            options={airportOptions}
            placeholder="Search Departure"
          />

          {/* Swap Button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: "4px" }}>
            <button
              onClick={() => {
                setEmptyLeg((prev) => ({
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

        {/* TO */}
        <FlightField
            label="Arrival"
            icon={MapPin}
            value={emptyLeg.to}
            onChange={(val) => setEmptyLeg({ ...emptyLeg, to: val })}
            options={airportOptions}
            placeholder="Search Arrival"
          />

          {/* DATE */}
          <div style={{ position: "relative" }}>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
            Date
          </label>
          <input
            type="date"
            value={emptyLeg.date}
            onChange={(e) => setEmptyLeg({ ...emptyLeg, date: e.target.value })}
            style={{
              padding: "10px 12px 10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </div>

        {/* TIME */}
        <div style={{ position: "relative" }}>
          <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
            Time
          </label>
          <input
            type="time"
            value={emptyLeg.time}
            onChange={(e) => setEmptyLeg({ ...emptyLeg, time: e.target.value })}
            style={{
              padding: "10px 12px 10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </div>
          
          {/* PAX */}
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px", display: "block" }}>
              Passengers
            </label>
              <Users size={18} style={{ position: "absolute", top: "70%", right: "30px", transform: "translateY(-50%)", color: "#777" }} />
              <input
                type="number"
                value={emptyLeg.pax}
                min={1}
                onChange={(e) => setEmptyLeg({ ...emptyLeg, pax: e.target.value })}
                style={{
                  padding: "10px 12px 10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width: "100%",
                  fontSize: "14px",
                }}
              />
          </div>

          {/* Search Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: "#061953",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
              minWidth: "120px"
            }}
          >
            Search Flights
          </button>
        </div>
        </div>
      </div>

      {/* IDLE ANIMATION */}

      {/* Paginated All Flights (if no search) */}
      {!searchTriggered && allFlights.length > 0 && (
        <div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "20px", textAlign: "center", color: "#061953" }}>
            {allFlights.length} Empty Leg Flight{allFlights.length > 1 ? "s" : ""}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px"
          }}>
            {allFlights
              .slice(page * flightsPerPage, page * flightsPerPage + flightsPerPage)
              .map((flight, idx) => (
                <EmptyLegCard key={idx} flight={flight} handleBookNow={handleBookNow} />
              ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0}>{"<"} Prev</button>
            <span style={{ margin: "0 12px" }}>Page {page + 1}</span>
            <button
              onClick={() => setPage((prev) =>
                (prev + 1) * flightsPerPage < allFlights.length ? prev + 1 : prev)}
              disabled={(page + 1) * flightsPerPage >= allFlights.length}
            >Next {">"}</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Lottie animationData={loadingAnimation} loop style={{ width: "300px", marginLeft: "475px" }} />
        </div>
      )}

      {/* No Results */}
      {searchTriggered && !loading && searchResults.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Lottie animationData={noResultsAnimation} loop style={{ width: "200px", marginLeft: "425px" }} />
          <h4 style={{ marginTop: "20px", fontSize: "1.25rem", color: "#666" }}>No flights found. Try another route or day.</h4>
        </div>
      )}

      {/* Results */}
      {searchTriggered && searchResults.length > 0 && (
        <div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "20px", textAlign: "center", color: "#061953" }}>
            {searchResults.length} Available Flight{searchResults.length > 1 ? "s" : ""}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
            marginTop: "24px"
          }}>
            {searchResults.map((flight, idx) => (
              <EmptyLegCard key={idx} flight={flight} handleBookNow={handleBookNow} />
            ))}
          </div>
        </div>
      )}

      {/* Passenger Section */}
      {showPassengerSection && (
        <div style={{ marginTop: "40px" }}>
          <PassengerDetails
            count={parseInt(emptyLeg.pax)}
            externalPassengers={passengers}
            setExternalPassengers={setPassengers}
            isFullFlight={false}
            isSeatBased={true}
            fixedCount={parseInt(emptyLeg.pax)}
            petDetails={petDetails}
            setPetDetails={setPetDetails}
            corporateDetails={corporateDetails}
            setCorporateDetails={setCorporateDetails}
          />

          <div className="mt-6 bg-[#061953]/10 p-6 rounded-2xl shadow-md">
            <label className="flex items-center gap-3 text-sm text-[#250808]">
              <input
                type="checkbox"
                checked={acceptDisclaimer}
                onChange={(e) => setAcceptDisclaimer(e.target.checked)}
                className="accent-[#250808]"
              />
              <span>
                I confirm that the details entered are correct and final. I understand that any mistakes may cause boarding delays or re-verification issues.
              </span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px", gap: "20px" }}>
            
            <button
              onClick={handleConfirm}
              style={{
                backgroundColor: "#198754",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer"
              }}
            >
              Continue
            </button>
            
            <button
              onClick={() => {
                setSearchResults([]);
                setPassengers([]);
                setShowPassengerSection(false);
              }}
              style={{
                backgroundColor: "#6c757d",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default OneWayEmptyLeg;
