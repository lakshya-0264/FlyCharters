import { useEffect, useState } from "react";
import { Plane, X, Calendar, Clock, Users, MapPin, Download, Mail, Eye, Sparkles } from "lucide-react";


const UpcomingBookings = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
   const fetchBookings = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/emptylegbooking/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: 'include'
    });

    const result = await res.json();
    const today = new Date();

const validBookings = result.data
  .filter(b =>
    b.empty_leg_id &&
    b.booking_status === "confirmed" &&
    b.payment_status === "paid" &&  
    new Date(b.empty_leg_id.departureDate) >= today
  )
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
  .map(b => ({
    id: b._id,
    from: b.empty_leg_id.takeOff_Airport.source_IATA,
    to: b.empty_leg_id.destination_Airport.source_IATA,
    fromName: b.empty_leg_id.takeOff_Airport.airport_name,
    toName: b.empty_leg_id.destination_Airport.airport_name,
    time: b.empty_leg_id.departureTime,
    arrivalTime: b.empty_leg_id.arrivalTime,
    date: b.empty_leg_id.departureDate,
    seats: b.seats_booked,
    status: b.booking_status,
    price: b.empty_leg_id.priceperseat,
    fullPlanePrice: b.empty_leg_id.full_plane_price,
    fullPlane: b.is_full_plane
  }));


    setUpcoming(validBookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    // toast.error("Failed to fetch your upcoming bookings.");
    setUpcoming([]);
  } finally {
    setLoading(false);
  }
};


    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateFlightDuration = (departureTime, arrivalTime) => {
    const [depHours, depMinutes] = departureTime.split(":").map(Number);
    const [arrHours, arrMinutes] = arrivalTime.split(":").map(Number);
    
    let duration = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
    if (duration < 0) duration += 24 * 60; // Handle overnight flights
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#061953] mx-auto mb-4"></div>
          <p className="text-[#061953] font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h bg-gradient-to-br pt-8 flex justify-center from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-slate-400/10 to-blue-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 pb-10 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pb-2">
          <div className="inline-flex items-center gap-2 mb-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-white/20">
            <Sparkles className="text-[#061953]" size={16} />
            <span className="text-xs font-medium text-slate-600 tracking-wide">YOUR JOURNEY AWAITS</span>
          </div>
          <h1 className="text-3xl font-bold text-[#061953] mb-2 pt-4">
            Upcoming Bookings
          </h1>
          {/* <p className="text-sm text-slate-600 max-w-8xl mx-auto pb-4 pt-1">
            Track and manage your scheduled journeys
          </p> */}
        </div>

        {/* Flight Cards with Fixed Spacing */}
        {upcoming.length > 0 ? (
  <div className="relative w-full max-w-12/12 mx-auto">
    {/* Left Arrow */}
    <button
      onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
      disabled={currentIndex === 0}
      className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <span className="text-3xl text-[#061953] font-bold">{'<'}</span>
    </button>

    {/* Single Card */}
    <div className="flex justify-center">
      <div
        key={upcoming[currentIndex].id || currentIndex}
        className="w-full px-2"
        onMouseEnter={() => setHoveredCard(currentIndex)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div
          className={`group relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
            hoveredCard === currentIndex ? 'ring-1 ring-[#061953]/30' : ''
          }`}
        >
          <div className="absolute -top-0.5 -right-0.5 z-10">
            <div className="flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="uppercase">{upcoming[currentIndex].status}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-[#061953] to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Plane size={22} className="text-white transform group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col justify-center space-y-2">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                      <MapPin size={12} />
                      <span>DEPARTURE</span>
                    </div>
                    <div className="text-2xl font-bold text-[#061953]">{upcoming[currentIndex].from}</div>
                    <div className="text-xs text-slate-600 leading-tight">{upcoming[currentIndex].fromName}</div>
                    <div className="flex items-center gap-1.5 text-[#061953] bg-blue-50 px-2 py-1 rounded-md w-fit">
                      <Clock size={12} />
                      <span className="text-sm font-semibold">{upcoming[currentIndex].time}</span>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center px-4">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                    <div className="absolute bg-white rounded-full px-3 py-2 shadow-md border border-slate-200">
                      <div className="text-xs font-bold text-[#061953] whitespace-nowrap">
                        {upcoming[currentIndex].arrivalTime
                          ? calculateFlightDuration(upcoming[currentIndex].time, upcoming[currentIndex].arrivalTime)
                          : '0h 0m'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center space-y-2 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs font-medium">
                      <span>ARRIVAL</span>
                      <MapPin size={12} />
                    </div>
                    <div className="text-2xl font-bold text-[#061953]">{upcoming[currentIndex].to}</div>
                    <div className="text-xs text-slate-600 leading-tight">{upcoming[currentIndex].toName}</div>
                    <div className="w-full flex justify-end">
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        <span className="text-sm font-semibold">{upcoming[currentIndex].arrivalTime || '00:00'}</span>
                        <Clock size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="bg-slate-50/80 rounded-xl p-4 shadow-inner border border-slate-200/50 min-w-[160px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar size={12} />
                        <span className="text-xs">Date</span>
                      </div>
                      <span className="font-semibold text-[#061953] text-sm">{formatDate(upcoming[currentIndex].date)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Users size={12} />
                        <span className="text-xs">Seats</span>
                      </div>
                      <span className="font-semibold text-[#061953] text-sm">{upcoming[currentIndex].seats}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Total Amount</span>
                        <span className="font-bold text-[#061953] pl-4 text-sm">
                          ₹{(upcoming[currentIndex].price * upcoming[currentIndex].seats).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 pb-2">
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={() => setSelectedFlight(upcoming[currentIndex])}
                    className="bg-[#061953] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:bg-blue-800 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 whitespace-nowrap">
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 whitespace-nowrap">
                    <Mail size={12} />
                    <span>Re-send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Arrow */}
    <button
      onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, upcoming.length - 1))}
      disabled={currentIndex === upcoming.length - 1}
      className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="text-3xl text-[#061953] font-bold">{'>'}</span>
    </button>
  </div>
) : (
  <div className="text-center py-16">
    <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/30 max-w-sm mx-auto">
      <div className="text-4xl mb-4">✈️</div>
      <h3 className="text-lg font-semibold text-[#061953] mb-2">No Upcoming Bookings</h3>
      <p className="text-sm text-slate-500">Your next adventure is just a booking away!</p>
    </div>
  </div>
)}
      </div>

      {/* Enhanced Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedFlight(null)}
          ></div>
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-2xl border border-white/30 max-h-[75vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200 z-10"
              onClick={() => setSelectedFlight(null)}
            >
              <X size={20} className="text-slate-600" />
            </button>
            
            <div className="text-center mb-2 pr-8">
              <h3 className="text-2xl font-bold text-[#061953] mb-2">
                Flight Details
              </h3>
              <p className="text-sm text-slate-600 pt-1 pb-2">Complete information for your journey</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">DEPARTURE</span>
                  <p className="font-semibold text-[#061953] mb-1">{selectedFlight.fromName}</p>
                  <p className="text-xl font-bold text-[#061953]">{selectedFlight.from}</p>
                  <div className="flex items-center gap-2 mt-2 text-[#061953]">
                    <Clock size={14} />
                    <span className="font-semibold">{selectedFlight.time}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">DEPARTURE DATE</span>
                  <p className="font-semibold text-[#061953]">{formatDate(selectedFlight.date)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">AVAILABLE SEATS</span>
                  <p className="font-semibold text-[#061953]">{selectedFlight.seats} Seats</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">STATUS</span>
                  <p className="font-semibold text-emerald-600 capitalize">{selectedFlight.status}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 font-medium block mb-2">ARRIVAL</span>
                  <p className="font-semibold text-[#061953] mb-1">{selectedFlight.toName}</p>
                  <p className="text-xl font-bold text-[#061953]">{selectedFlight.to}</p>
                  <div className="flex items-center gap-2 mt-2 text-emerald-600">
                    <Clock size={14} />
                    <span className="font-semibold">{selectedFlight.arrivalTime || '12:45'}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">FLIGHT DURATION</span>
                  <p className="font-semibold text-[#061953]">
                    {selectedFlight.arrivalTime ? calculateFlightDuration(selectedFlight.time, selectedFlight.arrivalTime) : '2h 45m'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">PRICE PER SEAT</span>
                  <p className="font-bold text-[#061953] text-lg">₹{selectedFlight.price?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-[#061953] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-200">
                Download 
              </button>
              <button className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-200">
                Share Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;