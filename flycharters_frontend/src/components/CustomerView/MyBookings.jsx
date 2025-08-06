import { useEffect, useState } from "react";
import { Plane, X, Calendar, Clock, Users, MapPin, Download, Mail, Eye, Sparkles, Search } from "lucide-react";
import ChatUserOpe from '../common/ChatUserOpe'; // Import ChatUserOpe component
import { BsChatQuote } from "react-icons/bs";
import { io } from "socket.io-client";
import { getMessages } from "../../api/authAPI";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [chatOperatorModal, setChatOperatorModal] = useState(null);

  const handleChatOperator = (operatorId, bookingDetails) => {
    setChatOperatorModal({
      userId: operatorId,
      userName: `Operator for ${bookingDetails.from} → ${bookingDetails.to}`,
      bookingDetails
    });
  };

  const handleCloseChatModal = () => {
    setChatOperatorModal(null);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch empty leg bookings
        const emptyLegRes = await fetch(import.meta.env.VITE_API_BASE_URL + "/emptylegbooking/user", {
          headers,
          credentials: 'include',
        });
        const emptyLegResult = await emptyLegRes.json();

        const emptyLegBookings = emptyLegResult.data
          .filter(b => 
            b && 
            b.empty_leg_id && 
            b.booking_status === "confirmed" &&
            b.payment_status === "paid"
          )
          .map(b => ({
            id: b._id,
            type: "Empty Leg",
            from: b.empty_leg_id?.takeOff_Airport?.source_IATA || "N/A",
            to: b.empty_leg_id?.destination_Airport?.source_IATA || "N/A",
            fromName: b.empty_leg_id?.takeOff_Airport?.airport_name || "N/A",
            toName: b.empty_leg_id?.destination_Airport?.airport_name || "N/A",
            time: b.empty_leg_id?.departureTime || "00:00",
            arrivalTime: b.empty_leg_id?.arrivalTime || "00:00",
            date: b.empty_leg_id?.departureDate || new Date().toISOString(),
            seats: b.seats_booked || 1,
            status: b.booking_status || "confirmed",
            price: b.empty_leg_id?.priceperseat || 0,
            totalAmount: (b.empty_leg_id?.priceperseat || 0) * (b.seats_booked || 1),
            fullPlanePrice: b.empty_leg_id?.full_plane_price || 0,
            fullPlane: b.is_full_plane || false,
            operatorId: b.empty_leg_id?.fleet_id?.operatorId || 'default-operator',
            paymentId: b.payment_id
          }));

        // Fetch one-way bookings
        const onewayRes = await fetch(import.meta.env.VITE_API_BASE_URL + "/flight/user", {
          method: 'GET',
          credentials: 'include',
          headers,
        });
        const onewayResult = await onewayRes.json();
        const onewayBookings = Array.isArray(onewayResult.data) ? onewayResult.data : [];
        const validOnewayBookings = onewayBookings
          .filter(booking => booking && booking.payment_status === "booked")
          .map(b => ({
            id: b._id,
            type: b.is_round_trip ? "Round Trip" : "One-Way",
            from: b.quote_id?.deparature_airport_id?.source_IATA || "N/A",
            to: b.quote_id?.destination_airport_id?.source_IATA || "N/A",
            fromName: b.quote_id?.deparature_airport_id?.airport_name || "N/A",
            toName: b.quote_id?.destination_airport_id?.airport_name || "N/A",
            time: b.quote_id?.departureTime || "N/A",
            arrivalTime: calculateArrivalTime(b.quote_id?.departureTime, b.quote_id?.total_time),
            date: b.quote_id?.departureDate || new Date().toISOString(),
            seats: b.quote_id?.total_passengers || b.passengerDetails?.length || 1,
            status: b.payment_status || "confirmed",
            price: (b.quote_id?.total_cost_with_gst || 0) / (b.quote_id?.total_passengers || 1),
            totalAmount: b.quote_id?.total_cost_with_gst || 0,
            totalDistance: b.quote_id?.total_distance || 0,
            isRoundTrip: b.is_round_trip || false,
            operatorId: b.quote_id?.fleet_request_id || 'default-operator',
            paymentId: b.payment_id
          }));

        // Combine and sort bookings by date (newest first)
        const combinedBookings = [...emptyLegBookings, ...validOnewayBookings]
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setBookings(combinedBookings);
        setFilteredBookings(combinedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.from.toLowerCase().includes(searchLower) ||
          booking.to.toLowerCase().includes(searchLower) ||
          booking.fromName.toLowerCase().includes(searchLower) ||
          booking.toName.toLowerCase().includes(searchLower) ||
          booking.type.toLowerCase().includes(searchLower) ||
          booking.status.toLowerCase().includes(searchLower) ||
          formatDate(booking.date).toLowerCase().includes(searchLower)
        );
      });
      setFilteredBookings(filtered);
    }
  }, [searchTerm, bookings]);

  const calculateArrivalTime = (departureTime, flightDurationHours) => {
    if (!departureTime || !flightDurationHours) return '00:00';
    try {
      const [depHours, depMinutes] = departureTime.split(":").map(Number);
      const durationMinutes = Math.round(parseFloat(flightDurationHours) * 60);
      const totalMinutes = (depHours * 60 + depMinutes) + durationMinutes;
      const arrivalHours = Math.floor(totalMinutes / 60) % 24;
      const arrivalMinutes = totalMinutes % 60;
      return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error calculating arrival time:', error);
      return '00:00';
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatDistance = (distance) => {
    if (!distance) return '0';
    const num = parseFloat(distance);
    return num.toFixed(2).replace(/\.?0+$/, '');
  };

  const calculateFlightDuration = (departureTime, arrivalTime) => {
    if (!arrivalTime || !departureTime) return '0h 0m';
    try {
      const [depHours, depMinutes] = departureTime.split(":").map(Number);
      const [arrHours, arrMinutes] = arrivalTime.split(":").map(Number);
      let duration = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);
      if (duration < 0) duration += 24 * 60;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error('Error calculating flight duration:', error);
      return '0h 0m';
    }
  };

  const downloadInvoice = async (booking) => {
    setDownloadingId(booking.id);
    
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let response;
      
      if (booking.type === "Empty Leg") {
        console.log('🔄 Downloading Empty Leg invoice for booking:', booking.id);
        console.log('📨 Sending data:', {
          empty_booking_id: booking.id,
          payment_id: booking.paymentId
        });
        
        response = await fetch(import.meta.env.VITE_API_BASE_URL + "/invoice/empty", {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            empty_booking_id: booking.id,
            payment_id: booking.paymentId
          })
        });
      } else {
        console.log('🔄 Downloading regular flight invoice for booking:', booking.id);
        
        response = await fetch(import.meta.env.VITE_API_BASE_URL + `/invoice/addon/${booking.id}/${booking.paymentId}`, {
          method: 'GET',
          headers,
          credentials: 'include'
        });
      }

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('❌ Server error:', errorData);
        } catch (e) {
          try {
            const errorText = await response.text();
            console.error('❌ Server error (text):', errorText);
            errorMessage = errorText || errorMessage;
          } catch (e2) {
            console.error('❌ Could not parse error response');
          }
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      console.log('📄 Content type:', contentType);
      
      if (!contentType || !contentType.includes('application/pdf')) {
        console.warn('⚠️ Response is not a PDF, content-type:', contentType);
      }

      const blob = await response.blob();
      console.log('📄 Blob size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${booking.type.replace(/\s+/g, '-').toLowerCase()}-${booking.id}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Invoice downloaded successfully');
      
    } catch (error) {
      console.error("💥 Error downloading invoice:", error);
      console.error("📍 Error stack:", error.stack);
      
      let userMessage = "Failed to download invoice. ";
      if (error.message.includes('500')) {
        userMessage += "Server error occurred. Please check the console for details.";
      } else if (error.message.includes('404')) {
        userMessage += "Invoice not found.";
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage += "Authentication failed. Please log in again.";
      } else {
        userMessage += error.message || "Please try again later.";
      }
      
      alert(userMessage);
    } finally {
      setDownloadingId(null);
    }
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
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-slate-400/10 to-blue-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 py-10 px-2 max-w-6xl mx-auto">
        <div className="text-center mb-8 pb-4">
          <div className="inline-flex items-center gap-2 mb-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-white/20">
            <Sparkles className="text-[#061953]" size={16} />
            <span className="text-xs font-medium text-slate-600 tracking-wide">YOUR JOURNEY AWAITS</span>
          </div>
          <h1 className="text-3xl font-bold text-[#061953] mb-2 pt-4">
            My Bookings
          </h1>
          <p className="text-sm text-slate-600 max-w-8xl mx-auto pb-4 pt-2">
            Track and manage your scheduled journeys
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by airports, destinations, or booking type..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#061953]/30 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <div className="text-center mt-3">
              <span className="text-sm text-slate-600">
                {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
              </span>
            </div>
          )}
        </div>

        {filteredBookings.length > 0 ? (
          <div className="flex flex-col gap-8">
            {filteredBookings.map((booking, idx) => (
              <div
                key={booking.id || idx}
                className={`group relative bg-white/80 pt-6 first:pt-0 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
                  hoveredCard === idx ? 'ring-1 ring-[#061953]/30' : ''
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute -top-0.5 -right-0.5 z-10">
                  <div className="flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span className="uppercase">{booking.status}</span>
                  </div>
                </div>

                <div className="absolute -top-0.5 -left-0.5 z-10">
                  <div className={`flex items-center gap-1.5 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                    booking.type === 'Round Trip' 
                      ? 'bg-purple-500/90' 
                      : booking.type === 'Empty Leg' 
                        ? 'bg-green-800/90' 
                        : 'bg-blue-500/90'
                  }`}>
                    <span className="uppercase">{booking.type}</span>
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
                          <div className="text-2xl font-bold text-[#061953]">{booking.from}</div>
                          <div className="text-xs text-slate-600 leading-tight">{booking.fromName}</div>
                          <div className="flex items-center gap-1.5 text-[#061953] bg-blue-50 px-2 py-1 rounded-md w-fit">
                            <Clock size={12} />
                            <span className="text-sm font-semibold">{booking.time}</span>
                          </div>
                        </div>

                        <div className="relative flex items-center justify-center px-4">
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                          <div className="absolute bg-white rounded-full px-3 py-2 shadow-md border border-slate-200">
                            <div className="text-xs font-bold text-[#061953] whitespace-nowrap">
                              {calculateFlightDuration(booking.time, booking.arrivalTime)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-2 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-slate-500 text-xs font-medium">
                            <span>ARRIVAL</span>
                            <MapPin size={12} />
                          </div>
                          <div className="text-2xl font-bold text-[#061953]">{booking.to}</div>
                          <div className="text-xs text-slate-600 leading-tight">{booking.toName}</div>
                          <div className="w-full flex justify-end">
                            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                              <span className="text-sm font-semibold">{booking.arrivalTime || '00:00'}</span>
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
                            <span className="font-semibold text-[#061953] text-sm">{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Users size={12} />
                              <span className="text-xs">{booking.type === "Empty Leg" ? "Seats" : "Passengers"}</span>
                            </div>
                            <span className="font-semibold text-[#061953] text-sm">{booking.seats}</span>
                          </div>
                          <div className="border-t border-slate-200 pt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-600">Total Amount</span>
                              <span className="font-bold text-[#061953] pl-4 text-sm">
                                ₹{booking.totalAmount?.toLocaleString() || (booking.price * booking.seats).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 pt-4 pb-2">
                      <div className="flex flex-col gap-2.5">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="bg-[#061953] text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:bg-blue-800 flex items-center gap-2 whitespace-nowrap"
                        >
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                        <button 
                          onClick={() => downloadInvoice(booking)}
                          disabled={downloadingId === booking.id}
                          className={`flex items-center gap-2 px-4 py-2 border ${
                            downloadingId === booking.id 
                              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 cursor-pointer'
                          } rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap`}
                        >
                          {downloadingId === booking.id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              <span>Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download size={12} />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 whitespace-nowrap">
                          <Mail size={12} />
                          <span>Re-send</span>
                        </button>
                        <button 
                          onClick={() => handleChatOperator(booking.operatorId, booking)}
                          className="bg-[#061953] text-white font-medium px-4 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-800 transition-all duration-200"
                        >
                          <span>Chat Operator</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/30 max-w-sm mx-auto">
              <div className="text-4xl mb-4">
                {searchTerm ? "🔍" : "✈️"}
              </div>
              <h3 className="text-lg font-semibold text-[#061953] mb-2">
                {searchTerm ? "No Matching Bookings" : "No Bookings Found"}
              </h3>
              <p className="text-sm text-slate-500">
                {searchTerm ? "Try adjusting your search terms" : "Your next adventure is just a booking away!"}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-[#061953] text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-all duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          ></div>
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-2xl border border-white/30 max-h-[75vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200 z-10"
              onClick={() => setSelectedBooking(null)}
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
                  <span className="text-xs text-slate-500 font-medium block mb-2">BOOKING TYPE</span>
                  <p className="font-semibold text-[#061953]">{selectedBooking.type}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">DEPARTURE</span>
                  <p className="font-semibold text-[#061953] mb-1">{selectedBooking.fromName}</p>
                  <p className="text-xl font-bold text-[#061953]">{selectedBooking.from}</p>
                  <div className="flex items-center gap-2 mt-2 text-[#061953]">
                    <Clock size={14} />
                    <span className="font-semibold">{selectedBooking.time}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">DEPARTURE DATE</span>
                  <p className="font-semibold text-[#061953]">{formatDate(selectedBooking.date)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">{selectedBooking.type === "Empty Leg" ? "SEATS" : "PASSENGERS"}</span>
                  <p className="font-semibold text-[#061953]">{selectedBooking.seats}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">STATUS</span>
                  <p className="font-semibold text-emerald-600 capitalize">{selectedBooking.status}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-500 font-medium block mb-2">ARRIVAL</span>
                  <p className="font-semibold text-[#061953] mb-1">{selectedBooking.toName}</p>
                  <p className="text-xl font-bold text-[#061953]">{selectedBooking.to}</p>
                  <div className="flex items-center gap-2 mt-2 text-emerald-600">
                    <Clock size={14} />
                    <span className="font-semibold">{selectedBooking.arrivalTime || '00:00'}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">FLIGHT DURATION</span>
                  <p className="font-semibold text-[#061953]">
                    {calculateFlightDuration(selectedBooking.time, selectedBooking.arrivalTime)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <span className="text-xs text-slate-500 font-medium block mb-2">{selectedBooking.type === "Empty Leg" ? "PRICE PER SEAT" : "PRICE PER PASSENGER"}</span>
                  <p className="font-bold text-[#061953] text-lg">₹{selectedBooking.price?.toLocaleString()}</p>
                </div>
                {selectedBooking.totalDistance && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <span className="text-xs text-slate-500 font-medium block mb-2">TOTAL DISTANCE</span>
                    <p className="font-bold text-[#061953] text-lg">{formatDistance(selectedBooking.totalDistance)} km</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => downloadInvoice(selectedBooking)}
                disabled={downloadingId === selectedBooking.id}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  downloadingId === selectedBooking.id
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-[#061953] text-white hover:bg-blue-800'
                }`}
              >
                {downloadingId === selectedBooking.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download</span>
                  </>
                )}
              </button>

              <button className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-200">
                Share Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Operator Modal */}
      {chatOperatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseChatModal}
          ></div>
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg h-[600px] border border-white/30 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#061953] to-blue-700 rounded-full flex items-center justify-center">
                  <BsChatQuote size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#061953]">Chat with Operator</h3>
                  <p className="text-xs text-slate-500">{chatOperatorModal.bookingDetails.from} → {chatOperatorModal.bookingDetails.to}</p>
                </div>
              </div>
              <button
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                onClick={handleCloseChatModal}
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatUserOpe
                userId={chatOperatorModal.userId}
                userName={chatOperatorModal.userName}
                bookingDetails={chatOperatorModal.bookingDetails}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;