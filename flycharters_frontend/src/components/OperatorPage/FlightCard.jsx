const FlightCard = ({ seats, totalSeats, departure, date, price }) => (
  <div className="flight-card">
    <p>Available Seats: {seats}</p>
    <p>Total Seats: {totalSeats}</p>
    <p>Departure: {departure}</p>
    <p>Flight Date: {date}</p>
    <p>Price: ₹{price}</p>
  </div>
);

export default FlightCard;
