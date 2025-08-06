import { FaUserFriends, FaCalendarAlt, FaInfoCircle, FaChevronRight } from "react-icons/fa";
import { MdOutlineAirlineSeatReclineExtra, MdVerified, MdGppBad } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";

const FleetCard = ({ name, model, capacity, expiry, status, validTill, verified }) => (
  <div className="w-[400px] bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
    {/* Card Header */}
    <div className="bg-[#061953] p-3 flex items-center justify-between min-h-[20px]">
      <div className="flex items-center min-w-0">
        <FaInfoCircle className="text-white text-lg mr-3 flex-shrink-0" />
        <h3 className="text-white font-bold text-lg truncate">{name}</h3>
      </div>
      
      {/* Verification Badge */}
      <div className="flex-shrink-0 ml-3">
        {verified === true || verified === 'true' ? (
          <div className="flex items-center bg-green-100 bg-opacity-20 px-2 py-1 rounded-full border border-green-300 border-opacity-30">
            <MdVerified className="text-green-400 text-base mr-1" />
            <span className="text-green-300 text-xs font-medium whitespace-nowrap">Verified</span>
          </div>
        ) : (
          <div className="flex items-center bg-red-100 bg-opacity-20 px-2 py-1 rounded-full border border-red-300 border-opacity-30">
            <MdGppBad className="text-red-400 text-base mr-1" />
            <span className="text-red-300 text-xs font-medium whitespace-nowrap">Not Verified</span>
          </div>
        )}
      </div>
    </div>

    {/* Card Body */}
    <div className="p-5 space-y-1 flex-grow">
      {/* Model */}
      <div className="flex items-start">
        <div className="w-5 mt-1 flex-shrink-0">
          <svg viewBox="0 0 24 24" className="text-[#061953] w-5 h-5">
            <path fill="currentColor" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z"/>
          </svg>
        </div>
        <div className="ml-3 min-w-0">
          <p className="text-sm text-gray-500">Model</p>
          <p className="font-medium text-gray-800 truncate">{model || 'N/A'}</p>
        </div>
      </div>

      {/* Capacity */}
      <div className="flex items-start">
        <MdOutlineAirlineSeatReclineExtra className="text-[#061953] text-lg mt-1 w-5 flex-shrink-0" />
        <div className="ml-3 min-w-0">
          <p className="text-sm text-gray-500">Capacity</p>
          <p className="font-medium text-gray-800">{capacity} Seats</p>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'space-between',alignItems:"center"}}>
      {/* EoM */}
      <div className="flex items-start">
        <FaCalendarAlt className="text-[#061953] text-base mt-1 w-5 flex-shrink-0" />
        <div className="ml-3 min-w-0">
          <p className="text-sm text-gray-500">Year of Manufacturing</p>
          <p className="font-medium text-gray-800">{expiry}</p>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-start">
        <GiCheckMark className="text-[#061953] text-lg mt-1 w-5 flex-shrink-0" />
        <div className="ml-3 min-w-0">
          <p className="text-sm text-gray-500">Status</p>
          <p className={`font-medium ${
            status.toLowerCase() === 'available' ? 'text-green-600' : 
            status.toLowerCase() === 'unmaintenance' ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {status}
          </p>
        </div>
      </div>
      </div>

      {/* Valid Till */}
      <div className="flex items-start">
        <FaCalendarAlt className="text-[#061953] text-base mt-1 w-5 flex-shrink-0" />
        <div className="ml-3 min-w-0">
          <p className="text-sm text-gray-500">Valid Till</p>
          <p className="font-medium text-gray-800">{validTill}</p>
        </div>
      </div>
    </div>

    {/* Card Footer */}
  </div>
);

export default FleetCard;