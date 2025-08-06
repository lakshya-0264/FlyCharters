import { useState, useEffect } from 'react';
import FleetCard from "./FleetCard";
import FlightCard from "./FlightCard";
import EmptyLegCard from "./EmptyLegCard";
import FleetDetailsModal from "./FleetDetailsModal";
import FlightDetailsModal from "./FlightDetailsModal";
import { LuPlaneTakeoff } from "react-icons/lu";
import loadingGif from "../../assets/LoadingGIF.gif";


import { PiGitDiffLight } from "react-icons/pi";
import { BsAirplane } from "react-icons/bs";

import EmptyLegDetailsModal from "./EmptyLegDetailsModal";

// Safe date formatter helper
const safeFormatDate = (dateValue) => {
  if (!dateValue) return "N/A";
  try {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return "Invalid Date";
  }
};

const FleetFlightHome = () => {
  const [fleets, setFleets] = useState([]);
  const [flights, setFlights] = useState([]);
  const [emptyLegs, setEmptyLegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedEmptyLeg, setSelectedEmptyLeg] = useState(null);

  useEffect(() => {
    let operatorId;
    
    try {
      operatorId = localStorage.getItem("id");
      // console.log(operatorId);
    } catch (err) {
      console.error('localStorage access error:', err);
      setError("Unable to access operator ID");
      setLoading(false);
      return;
    }

    const fetchFleetData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/fleet/fleetoperator/${operatorId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (result.success) {
          setFleets(Array.isArray(result.data) ? result.data : []);
        } else {
          throw new Error(result.Message || 'Fleet fetch failed');
        }
      } catch (err) {
        console.error('Fleet fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFlightData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/flight/operator/${operatorId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (result.success) {
          setFlights(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        console.error('Flight fetch error:', err);
      }
    };

    const fetchEmptyLegs = async () => {
      try {
        const res = await fetch(`http://localhost:8080/empty/getEmptyLegByOperator/${operatorId}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (result.success) {
          setEmptyLegs(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        console.error('Empty legs fetch error:', err);
      }
    };

    if (operatorId) {
      fetchFleetData();
      fetchFlightData();
      fetchEmptyLegs();
    } else {
      setError("Operator ID not found");
      setLoading(false);
    }
  }, []);

  const handleFleetClick = (fleet) => {
    try {
      setSelectedFleet(fleet);
    } catch (err) {
      console.error('Fleet click error:', err);
    }
  };

  const handleFlightClick = (flight) => {
    try {
      setSelectedFlight(flight);
    } catch (err) {
      console.error('Flight click error:', err);
    }
  };

  const closeModal = () => {
    setSelectedFleet(null);
    setSelectedFlight(null);
  };


  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
<h2 className="section-title"><BsAirplane className="plane-icon" />Fleets</h2>
<div className="card-grid">
  {loading ? (
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
  ) : fleets && fleets.length > 0 ? (
    fleets.map(fleet => {
      if (!fleet || !fleet._id) return null;
      return (
        <div key={fleet._id} onClick={() => handleFleetClick(fleet)}>
          <FleetCard 
            name={fleet.name || "N/A"}
            model={fleet.model || "N/A"}
            verified={fleet.isAdminVerify || 'false'}
            capacity={fleet.capacity || 0}
            expiry={safeFormatDate(fleet.eom)}
            validTill={safeFormatDate(fleet.validityTill)}
            status={fleet.status || "Unknown"}
          />
        </div>
      );
    })
  ) : <p>No fleets available</p>}
</div>

{/* Flights */}
<h2 className="section-title"><LuPlaneTakeoff className="plane-icon" />Upcoming Flights</h2>
<div className="card-grid">
  {loading ? (
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
  ) : flights && flights.length > 0 ? (
    flights.map(flight => {
      if (!flight || !flight._id) return null;
      return (
        <div key={flight._id} onClick={() => handleFlightClick(flight)}>
          <FlightCard
            seats={flight.seats || 0}
            totalSeats={flight.totalSeats || 0}
            departure={flight.departureTime || "N/A"}
            date={safeFormatDate(flight.departureDate)}
            price={flight.price || 0}
          />
        </div>
      );
    })
  ) : <p>No flights available today</p>}
</div>

{/* Empty Legs */}
<h2 className="section-title"><PiGitDiffLight className="plane-icon" />Empty Legs</h2>
<div className="card-grid">
  {loading ? (
    <img src={loadingGif} alt="Loading..." className="loading-gif" />
  ) : emptyLegs && emptyLegs.length > 0 ? (
    emptyLegs.map(leg => {
      if (!leg || !leg._id) return null;
      return (
        <div key={leg._id} onClick={() => setSelectedEmptyLeg(leg)}>
          <EmptyLegCard
            name={leg.fleet_Name || "N/A"}
            seats={leg.no_seat || 0}
            departure={leg.takeoff_airport_name || leg.takeOff_Airport || "N/A"}
            distination={leg.destination_airport_name || leg.destination_Airport || "N/A"}
            departureDate={safeFormatDate(leg.departureDate)}
            departureTime={leg.departureTime || "N/A"}
            priceperseat={leg.priceperseat || 0}
            arrivalDate={safeFormatDate(leg.arrivalDate)}
            arrivalTime={leg.arrivalTime || "N/A"}
          />
        </div>
      );
    })
  ) : <p>No empty legs available</p>}
</div>


      {/* Modals */}
      {selectedFleet && (
        <FleetDetailsModal fleet={selectedFleet} onClose={closeModal} />
      )}
      {selectedFlight && (
        <FlightDetailsModal flight={selectedFlight} onClose={closeModal} />
      )}
      {selectedEmptyLeg && (
        <EmptyLegDetailsModal leg={selectedEmptyLeg} onClose={() => setSelectedEmptyLeg(null)} />
      )}
    </>
  );
};

export default FleetFlightHome;