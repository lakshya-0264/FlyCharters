// src/components/BookingCard.jsx
const BookingCard = ({ booking }) => {
  const { from, to, date, time, pax, fullFlight } = booking;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-blue-600">
          {from} → {to}
        </h3>
        <span className="text-sm text-gray-500">{new Date(date).toDateString()}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <p>Time: {time}</p>
        <p>Seats: {fullFlight ? "Full Flight" : pax}</p>
      </div>
    </div>
  );
};

export default BookingCard;
