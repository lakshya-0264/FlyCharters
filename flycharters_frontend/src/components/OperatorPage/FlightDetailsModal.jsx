import React from 'react';

const FlightDetailsModal = ({ flight, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Flight Details</h2>
                <p>Available Seats: {flight.seats}/{flight.totalSeats}</p>
                <p>Departure: {flight.departure}</p>
                <p>Date: {flight.date}</p>
                <p>Price: {flight.price}</p>
                <div>
                <button>Delete</button>
                <button>update</button>
            </div>
            </div>
        </div>
    );
};

export default FlightDetailsModal;