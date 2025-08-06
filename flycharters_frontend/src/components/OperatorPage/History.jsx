import React from "react"; // Import the CSS file

const bookings = [
  {
    id: 1,
    airline: "User1",
    flightNumber: "6E-203",
    from: "Delhi (DEL)",
    to: "Mumbai (BOM)",
    date: "2025-06-01",
    time: "10:30 AM",
    status: "Completed",
  },
  {
    id: 2,
    airline: "User2",
    flightNumber: "AI-101",
    from: "Mumbai (BOM)",
    to: "New York (JFK)",
    date: "2025-05-15",
    time: "2:00 AM",
    status: "Completed",
  },
  {
    id: 3,
    airline: "User3",
    flightNumber: "UK-858",
    from: "Delhi (DEL)",
    to: "Bangalore (BLR)",
    date: "2025-04-10",
    time: "6:45 PM",
    status: "Cancelled",
  },
];

const BookingHistory = () => {
  return (
    <div className="booking-history-container">
      <h1 className="title">Booking History</h1>
      <div className="booking-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card_operator">
            <div className="booking-header">
              <div>
                <h2 className="airline">{booking.airline}</h2>
                <p className="flight-number">Flight: {booking.flightNumber}</p>
              </div>
              <span
                className={`status ${
                  booking.status === "Completed" ? "completed" : "cancelled"
                }`}
              >
                {booking.status}
              </span>
            </div>
            <div className="booking-details">
              <p>
                From: <strong>{booking.from}</strong>
              </p>
              <p>
                To: <strong>{booking.to}</strong>
              </p>
              <p>
                Date: <strong>{booking.date}</strong> at{" "}
                <strong>{booking.time}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
