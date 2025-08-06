import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EmptyLegDetailsModal = ({ leg, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-1000">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring",
            damping: 20,
            stiffness: 300
          }}
          className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative border border-gray-100"
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-light transition-colors duration-200"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>

          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Empty Leg Details</h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.2 }}
              className="h-0.5 bg-blue-400 mx-auto rounded-full"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm mb-6">
            {[
              { label: "Fleet Name", value: leg.fleet_Name || "N/A" },
              { 
                label: "Status", 
                value: leg.status,
                className: leg.status === 'Available' ? 'text-green-600' : 'text-amber-600'
              },
              { 
                label: "Departure", 
                value: leg.takeoff_airport_name || leg.takeOff_Airport,
                subtext: `${new Date(leg.departureDate).toLocaleDateString()} at ${leg.departureTime}`
              },
              { 
                label: "Destination", 
                value: leg.destination_airport_name || leg.destination_Airport,
                subtext: `${new Date(leg.arrivalDate).toLocaleDateString()} at ${leg.arrivalTime}`
              },
              { label: "Available Seats", value: leg.no_seat },
              { label: "Price per Seat", value: `₹${leg.priceperseat}` },
              { 
                label: "Full Plane Price", 
                value: `₹${leg.full_plane_price}`,
                className: "text-lg text-blue-600",
                colSpan: 2
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
                className={`bg-gray-50/50 p-3 rounded-lg border border-gray-100 ${item.colSpan ? 'col-span-2' : ''}`}
              >
                <p className="text-xs font-medium text-gray-500 mb-1">{item.label}</p>
                <p className={`font-medium ${item.className || ''}`}>{item.value}</p>
                {item.subtext && <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>}
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4"
          >
            <button 
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 text-sm font-medium hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => console.log('Delete clicked')}
            >
              Delete
            </button>
            <button 
              className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => console.log('Update clicked')}
            >
              Update
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmptyLegDetailsModal;