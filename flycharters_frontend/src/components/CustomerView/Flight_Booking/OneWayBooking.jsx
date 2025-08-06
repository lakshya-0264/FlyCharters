import { useSelector } from 'react-redux';
import { Plane, Users, Clock, Route } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { API } from "../../../api/authAPI"
import PassengerDetails, { getDefaultPassenger } from "../Passenger_Details/PassengerDetails";


const OneWayBooking = () => {
  const navigate = useNavigate();
  const requestedFlight = useSelector((store) => store.flightTicket);
  console.log('requested flight:',requestedFlight);
  const fromAirport = requestedFlight.fromAirportName;
  const toAirport = requestedFlight.toAirportName;
  const departureTime = requestedFlight.time;
  const departureDate = requestedFlight.date;
  const passengerCount = requestedFlight.passengers || 1;
  const isRoundTrip = requestedFlight.is_round_trip;

  // For Passenger details
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [corporateDetails, setCorporateDetails] = useState({});
  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);

  const [petDetails, setPetDetails] = useState({
    isPet: false,
    type: "",
    specify: "",
    weight: "",
    vaccinationCertificate: null,
    sitToTravelCertificate: false,
    agreePetPolicy: false
  });

  const validatePetDetails = (pet) => {
    if (!pet?.isPet) return;

    if (!pet.type?.trim()) throw new Error("Pet type is required.");
    if (pet.type === "Other" && !pet.specify?.trim()) throw new Error("Please specify the pet type.");
    if (!pet.weight || parseFloat(pet.weight) <= 0) throw new Error("Pet weight is required.");
    if (!pet.sitToTravelCertificate) throw new Error("Fit-to-travel certificate is required.");
    if (!pet.agreePetPolicy) throw new Error("You must agree to the pet policy.");
    if (!pet.vaccinationCertificate) throw new Error("Vaccination certificate is required.");
  };

  const validateCorporateDetails = (corp) => {
    if (!corp?.isCorporate) return;
    if (!corp.companyName?.trim()) throw new Error("Company name is required for corporate booking.");
    if (!corp.companyId?.trim()) throw new Error("Company ID is required for corporate booking.");
  };

  const handleContinue = async () => {
    const unsaved = passengers.find(p => p.isEditing);
    if (unsaved) {
      toast.error("Please save all passenger details before proceeding.");
      return;
    }

    if (!acceptDisclaimer) {
      toast.error("Please accept the undertaking before proceeding.");
      return;
    }

    try {
      validatePetDetails(petDetails);
      validateCorporateDetails(corporateDetails);

      const formData = new FormData();

      // Fleet Info
      formData.append("fleet_obj", JSON.stringify({
        fleet_request_id: requestedFlight.fleet_details?._id,
        total_cost: requestedFlight.quoto_detail?.total_cost,
        total_cost_with_gst: requestedFlight.quoto_detail?.total_cost_with_gst,
        total_time: requestedFlight.quoto_detail?.total_time,
        total_distance: requestedFlight.quoto_detail?.total_distance,
        leg_distance: requestedFlight.quoto_detail?.leg_distances,
        leg_time: requestedFlight.quoto_detail?.leg_times,
        deparature_airport_id: requestedFlight.from,
        destination_airport_id: requestedFlight.to,
        departureDate: requestedFlight.date,
        departureTime: requestedFlight.time,
      }));

      // Extra-AddOns
      formData.append("party_addon", 0);
      formData.append("food_service_addon", 0);

      // Passenger Info
      const formattedPassengers = passengers.map(p => ({
        name: p.name,
        nationality: p.nationality,
        ...(p.email && { email: p.email }),
        ...(p.phone && { phone: p.phone }),
        ...(p.passport && { passport: p.passport }),
        ...(p.gender && { gender: p.gender })
      }));
      formData.append("passengerDetails", JSON.stringify(formattedPassengers));

      // Pet Info
      const isPet = petDetails?.isPet;
      const petPayload = {
        isPet,
        ...(isPet && {
          type: petDetails.type,
          specify: petDetails.type === "Other" ? petDetails.specify : "",
          weight: petDetails.weight,
          sitToTravelCertificate: petDetails.sitToTravelCertificate,
          agreePetPolicy: petDetails.agreePetPolicy
        })
      };

      formData.append("petDetails", JSON.stringify(petPayload));
      if (isPet && petDetails.vaccinationCertificate) {
        formData.append("vaccinationCertificate", petDetails.vaccinationCertificate);
      }

      // Corporate Info
      formData.append("corporateDetails", JSON.stringify({
        isCorporate: corporateDetails?.isCorporate || false,
        companyName: corporateDetails.companyName || "",
        companyId: corporateDetails.companyId || ""
      }));

      // formData.append("is_round_trip", "false");
      formData.append("is_round_trip", isRoundTrip ? "true" : "false");

      // Submit API
      const res = await API.post(
        import.meta.env.VITE_API_BASE_URL + "/flight/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (res.data.success) {
        toast.success("Flight Details filled successfully!");
        console.log("Created Flight:", res.data.data);

        // Store booking data in localStorage as backup
        localStorage.setItem('currentBookingData', JSON.stringify(res.data.data));

        // Navigate with booking data in state
        navigate("/user/confirm-oneway-fullflight", {
          state: { bookingData: res.data.data }
        });
      } else {
        toast.error("Booking failed.");
      }

    } catch (err) {
      toast.error(err.message || "Something went wrong during booking.");
    }
  };

  const handleCancel = () => {
    navigate("/user");
    window.location.reload();
  };

  const formatDuration = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minutes`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateArrivalDateTime = (departureDate, departureTime, totalHours) => {
    if (!departureTime || !departureDate || typeof totalHours !== "number") return { time: "Invalid", date: "Invalid" };

    const [depHour, depMin] = departureTime.split(":").map(Number);
    const [year, month, day] = departureDate.split("-").map(Number);

    const depDate = new Date(year, month - 1, day, depHour, depMin);
    depDate.setMinutes(depDate.getMinutes() + Math.round(totalHours * 60));

    const hh = String(depDate.getHours()).padStart(2, '0');
    const mm = String(depDate.getMinutes()).padStart(2, '0');
    const time = `${hh}:${mm}`;

    const date = depDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return { time, date };
  };

  const { time: arrivalTime, date: arrivalDate } = calculateArrivalDateTime(departureDate, departureTime, requestedFlight.quoto_detail.leg_times[1]);

  const nauticalMilesToKm = (nauticalMiles) => {
    return Math.round(nauticalMiles);
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-32 py-10 min-h-screen bg-[#f0f9ff]">
      {/* Header with decorative elements */}
      <div className="relative max-w-3xl mx-auto text-center mt-4 mb-8">
        <h2 className="text-3xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#061953] to-[#1e40af] mb-4">
          Confirm Your Private Jet Booking
        </h2>
        <p className="text-gray-600 mt-3 text-lg">Review your flight and confirm your journey.</p>
      </div>

      <div className="relative max-w mx-auto p-8 rounded-3xl bg-white/30 backdrop-blur-md border border-white/40 shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        {/* Jet Details */}
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-3xl font-semibold text-[#002e70]">
            ✈️ {requestedFlight?.fleet_details?.name} — {requestedFlight?.fleet_details?.model}
          </h2>
          {/* <p className="text-sm text-gray-700 mt-1">Registration No: <strong>{requestedFlight?.fleet?.aircraftRegn}</strong></p> */}
        </div>

        {/* Route with animation */}
        <div className="flex flex-col items-center space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full">
          {/* FORWARD LEG */}
          <div className="w-full sm:w-1/3 text-center sm:text-left space-y-1">
            <p className="text-lg font-bold text-[#002e70]">{fromAirport}</p>
            <p className="text-sm text-gray-600">
              {formatDate(departureDate)} • {departureTime}
            </p>
          </div>

          <div className="w-full sm:w-1/3 flex justify-center items-center relative my-4">
            <div className="w-full h-[4px] bg-gradient-to-r from-[#002e70] via-[#1d4ed8] to-[#002e70] absolute top-1/2 -translate-y-1/2 z-0 animate-pulse" />
            <div className="bg-white z-10 p-4 rounded-full border border-[#1d4ed8] shadow-lg rotate-45">
              <Plane size={28} className="text-[#002e70] animate-bounce-slow" />
            </div>
          </div>

          <div className="w-full sm:w-1/3 text-center sm:text-right space-y-1">
            <p className="text-lg font-bold text-[#002e70]">{toAirport}</p>
            <p className="text-sm text-gray-600">
              {arrivalDate} • {arrivalTime}
            </p>
          </div>
        </div>

        {isRoundTrip && (
          <>
            <div className="text-sm font-semibold text-gray-700 italic">
              Stay Time: {
                (() => {
                  const dep = new Date(`${requestedFlight.date}T${requestedFlight.time}`);
                  const ret = new Date(`${requestedFlight.returnDate}T${requestedFlight.returnTime}`);
                  const diff = (ret - dep) / (1000 * 60 * 60);
                  return `${Math.floor(diff)} hour${diff !== 1 ? 's' : ''}`;
                })()
              }
            </div>

            {/* RETURN LEG */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full">
              <div className="w-full sm:w-1/3 text-center sm:text-left space-y-1">
                <p className="text-lg font-bold text-[#002e70]">{fromAirport}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(requestedFlight.returnDate)} • {requestedFlight.returnTime}
                </p>
              </div>

              <div className="w-full sm:w-1/3 flex justify-center items-center relative my-4">
                <div className="w-full h-[4px] bg-gradient-to-r from-[#002e70] via-[#1d4ed8] to-[#002e70] absolute top-1/2 -translate-y-1/2 z-0 animate-pulse" />
                <div className="bg-white z-10 p-4 rounded-full border border-[#1d4ed8] shadow-lg rotate-225">
                  <Plane size={28} className="text-[#002e70]" />
                </div>
              </div>

              <div className="w-full sm:w-1/3 text-center sm:text-right space-y-1">
                {(() => {
                  const { time, date } = calculateArrivalDateTime(
                    requestedFlight.returnDate,
                    requestedFlight.returnTime,
                    requestedFlight.quoto_detail.leg_times[3]
                  );
                  return (
                    <>
                      <p className="text-lg font-bold text-[#002e70]">{toAirport}</p>
                      <p className="text-sm text-gray-600">{date} • {time}</p>
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </div>


        {/* Flight Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6 mx-4">
          <div className="bg-white/60 rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <Users className="mx-auto mb-2 text-[#002e70]" />
            <p className="text-sm text-gray-500">Passenger{passengerCount > 1 ? 's' : ''}</p>
            <p className="text-xl font-bold text-[#002e70]">{passengerCount}</p>
          </div>

          <div className="bg-white/60 rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <Clock className="mx-auto mb-2 text-[#002e70]" />
            <p className="text-sm text-gray-500">Flight Duration</p>
            {isRoundTrip ? (
              <div>
                <p className="text-md font-bold text-[#002e70]"><span className='text-xl font-semibold'>Forward: </span>{formatDuration(requestedFlight.quoto_detail.leg_times[1])}</p>
                <p className="text-md font-bold text-[#002e70]"><span className='text-xl font-semibold'>Return: </span>{formatDuration(requestedFlight.quoto_detail.leg_times[1])}</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-[#002e70]">{formatDuration(requestedFlight?.quoto_detail?.leg_times[1])}</p>
            )}
          </div>

          <div className="bg-white/60 rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <Route className="mx-auto mb-2 text-[#002e70]" />
            <p className="text-sm text-gray-500">Distance</p>
            {isRoundTrip ? (
              <div>
                <p className="text-md font-bold text-[#002e70]"><span className='text-xl font-semibold'>Forward: </span>{nauticalMilesToKm(requestedFlight.quoto_detail.leg_distances[1])} NM</p>
                <p className="text-md font-bold text-[#002e70]"><span className='text-xl font-semibold'>Return: </span>{nauticalMilesToKm(requestedFlight.quoto_detail.leg_distances[1])} NM</p>
              </div>
            ) : (
              <p className="text-xl font-bold text-[#002e70]">{nauticalMilesToKm(requestedFlight?.quoto_detail?.leg_distances[1])} NM</p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-right mt-6">
          <p className="text-sm text-gray-500">Total Price (Incl. GST)</p>
          <h3 className="text-3xl font-extrabold text-[#002e70] tracking-tight mt-1">
            ₹{Math.round(requestedFlight?.quoto_detail?.total_cost_with_gst || 0).toLocaleString()}
          </h3>
        </div>
      </div>

      {!showPassengerForm && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              setShowPassengerForm(true);
              // Create passenger blocks based on passenger count
              const initialPassengers = Array.from({ length: passengerCount }, (_, index) => ({
                ...getDefaultPassenger(),
                isEditing: true
              }));
              setPassengers(initialPassengers);
            }}
            style={{
              background: "linear-gradient(135deg, #061953, #1e40af)",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px 20px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            }}
          >
            Fill Passenger Details ({passengerCount} passenger{passengerCount > 1 ? 's' : ''})
          </button>
        </div>
      )}

      {showPassengerForm && (
        <div className="mt-10 space-y-6">
          <div className="bg-white rounded-2xl shadow-md p-6 mt-10">
            <PassengerDetails
              externalPassengers={passengers}
              setExternalPassengers={setPassengers}
              petDetails={petDetails}
              setPetDetails={setPetDetails}
              corporateDetails={corporateDetails}
              setCorporateDetails={setCorporateDetails}
            />
          </div>

          <div className="mt-6 bg-[#061953]/10 p-6 rounded-2xl shadow-md">
            <label className="flex items-center gap-3 text-sm text-[#250808]">
              <input
                type="checkbox"
                checked={acceptDisclaimer}
                onChange={(e) => setAcceptDisclaimer(e.target.checked)}
                className="accent-[#250808]"
              />
              <span>
                I confirm that the details entered are correct and final. I understand that any mistakes may cause boarding delays or re-verification issues.
              </span>
            </label>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneWayBooking;