import React from "react";
import { 
  FaPlane, 
  FaUserFriends, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaClock,
  FaArrowRight
} from "react-icons/fa";

const EmptyLegCard = ({
  name,
  seats,
  departure,
  distination,
  departureTime,
  departureDate,
  arrivalTime,
  arrivalDate,
  priceperseat,
}) => {
  return (
    <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 w-full max-w-md hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-2 rounded-lg bg-[#061953]/10 mr-3">
          <FaPlane className="text-[#061953] text-lg" />
        </div>
        <h3 className="text-xl font-[600] text-[#333] uppercase tracking-wide">
          {name}
        </h3>
      </div>

      {/* Seats and Price */}
      <div className="flex justify-between mb-6">
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <FaUserFriends className="text-[#061953] mr-2" />
          <span className="text-sm font-medium text-gray-700">Seats: </span>
          <span className="text-sm font-semibold text-gray-800 ml-1">{seats}</span>
        </div>
        
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
          <FaRupeeSign className="text-[#061953] mr-2" />
          <span className="text-sm font-medium text-gray-700">Price: </span>
          <span className="text-sm font-semibold text-gray-800 ml-1">₹{priceperseat}</span>
        </div>
      </div>

      {/* Route */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <FaMapMarkerAlt className="text-[#061953] mr-3" />
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Route</h4>
        </div>
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">{departure}</p>
          </div>
          <FaArrowRight className="text-[#061953] mx-2" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">{distination}</p>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <FaCalendarAlt className="text-[#061953] mr-3" />
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Schedule</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Departure */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">DEPARTURE</p>
            <div className="flex items-center mb-1">
              <FaCalendarAlt className="text-[#061953] text-xs mr-2" />
              <p className="text-sm font-medium text-gray-800">{departureDate}</p>
            </div>
            <div className="flex items-center">
              <FaClock className="text-[#061953] text-xs mr-2" />
              <p className="text-sm font-medium text-gray-800">{departureTime}</p>
            </div>
          </div>
          
          {/* Arrival */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">ARRIVAL</p>
            <div className="flex items-center mb-1">
              <FaCalendarAlt className="text-[#061953] text-xs mr-2" />
              <p className="text-sm font-medium text-gray-800">{arrivalDate}</p>
            </div>
            <div className="flex items-center">
              <FaClock className="text-[#061953] text-xs mr-2" />
              <p className="text-sm font-medium text-gray-800">{arrivalTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
    </div>
  );
};

export default EmptyLegCard;