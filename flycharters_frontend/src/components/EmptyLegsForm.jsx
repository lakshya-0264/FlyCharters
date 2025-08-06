import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFleetAircrafts, addEmptyLeg, getAllAirports } from "../api/authAPI";
import LoadingOverlay from './hooks/LoadingOverlay';
import useLoading from './hooks/useLoading';


const EmptyLegForm = () => {
  const [formData, setFormData] = useState({
    fleet_id: "",
    takeOff_Airport: "",
    destinationAirportId: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    availableSeats: "",
    pricePerSeat: "",
    fullPlanePrice: "",
    status: "available",
  });

  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  useLoading(isSubmitting);
  useEffect(() => {
    const operatorId = localStorage.getItem("id");
    const fetchData = async () => {
      try {
        const fleetRes = await getFleetAircrafts(operatorId);
        setAircrafts(fleetRes.data.data || []);

        const airportRes = await getAllAirports();
        setAirports(airportRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Error fetching aircrafts or airports");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      fleet_id,
      takeOff_Airport,
      destinationAirportId,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      availableSeats,
      pricePerSeat,
      fullPlanePrice,
    } = formData;


    const bodyData = {
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      no_seat: availableSeats,
      priceperseat: pricePerSeat,
      full_plane_price: fullPlanePrice,
      status,
    };

    try {
      const res = await addEmptyLeg(
        fleet_id,
        takeOff_Airport,
        destinationAirportId,
        bodyData
      );
      console.log(res.data);
      alert("Empty leg uploaded successfully!");
      navigate("/operator");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Error uploading empty leg");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="aircraft-form">
      {isSubmitting && <LoadingOverlay />}
      <h2>Add Empty Legs Details</h2>
      <div className="emptyLegsForm">
        <div className="empty-legs">
          <label>Aircraft</label>
          <select
            name="fleet_id"
            value={formData.fleet_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Aircraft</option>
            {aircrafts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>

          <label>Departure Airport</label>
          <select
            name="takeOff_Airport"
            value={formData.takeOff_Airport}
            onChange={handleChange}
            required
          >
            <option value="">Select Departure Airport</option>
            {airports.map((airport) => (
              <option key={airport._id} value={airport._id}>
                {airport.airport_name}
              </option>
            ))}
          </select>

          <label>Destination Airport</label>
          <select
            name="destinationAirportId"
            value={formData.destinationAirportId}
            onChange={handleChange}
            required
          >
            <option value="">Select Destination Airport</option>
            {airports.map((airport) => (
              <option key={airport._id} value={airport._id}>
                {airport.airport_name}
              </option>
            ))}
          </select>

          <label>Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={formData.departureDate}
            onChange={handleChange}
            required
          />

          <label>Departure Time</label>
          <input
            type="time"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />

          
        </div>

        <div className="empty-legs">
          <label>Arrival Date</label>
          <input
            type="date"
            name="arrivalDate"
            value={formData.arrivalDate}
            onChange={handleChange}
            required
          />
          <label>Arrival Time</label>
          <input
            type="time"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
          />

          <label>Available Seats</label>
          <input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
            required
          />

          <label>Price Per Seat</label>
          <input
            type="number"
            name="pricePerSeat"
            value={formData.pricePerSeat}
            onChange={handleChange}
            required
          />

          <label>Full Plane Price</label>
          <input
            type="number"
            name="fullPlanePrice"
            value={formData.fullPlanePrice}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Uploading..." : "Upload Leg"}
      </button>
    </form>
  );
};

export default EmptyLegForm;
