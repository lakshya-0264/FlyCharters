import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";
import UnsavedChangesModal from "./UnSavedChangesModal";
import PassengerCard from "./PassengerCard";
import PetDetailsForm from "./PetDetailsForm";

export const getDefaultPassenger = () => ({
  name: "",
  email: "",
  phone: "",
  code: "+91",
  passport: "",
  passportFile: null,
  nationality: "India",
  gender: ""
});

const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer w-20 h-10">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
    />
    <div className="w-full h-full bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-[#061953] transition-colors duration-300 relative">
      <div
        className={`absolute top-1 left-1 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 
        ${checked ? "translate-x-[calc(100%+0.5rem)] bg-white text-[#061953]" : "bg-white text-[#061953]"}`}
      >
        {checked ? "Yes" : "No"}
      </div>
    </div>
  </label>
);

const PassengerDetails = ({ externalPassengers = [], setExternalPassengers = () => {}, isSeatBased = false, petDetails,
  setPetDetails,
  corporateDetails,
  setCorporateDetails }) => {
  const passengers = externalPassengers;
  const [openIndex, setOpenIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [nationalitySuggestions, setNationalitySuggestions] = useState([]);
  const [pendingCloseIndex, setPendingCloseIndex] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [previewFile, setPreviewFile] = useState(null);

  const [petTravel, setPetTravel] = useState(false);
  const [petType, setPetType] = useState("");
  const [specifyPet, setSpecifyPet] = useState("");
  const [agreePetPolicy, setAgreePetPolicy] = useState(false);

  const [petWeight, setPetWeight] = useState("");
const [vaccinationCertificate, setVaccinationCertificate] = useState("");
const [sitToTravelCertificate, setSitToTravelCertificate] = useState(false);


  const [isCorporate, setIsCorporate] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");


const updatePassenger = (index, field, value) => {
  const updated = [...passengers];
  updated[index][field] = value;

  // If nationality is set to "Indian", clear passportFile
  if (field === "nationality" && value.toLowerCase() === "indian") {
    updated[index].passportFile = null;
  }

  setExternalPassengers(updated);

  setErrors((prev) => {
    const newErrors = { ...prev };
    if (newErrors[index]?.includes(field)) {
      newErrors[index] = newErrors[index].filter((f) => f !== field);
      if (newErrors[index].length === 0) delete newErrors[index];
    }
    return newErrors;
  });
};


  const addPassenger = () => {
    setExternalPassengers([...passengers, { ...getDefaultPassenger(), isEditing: true }]);
    setOpenIndex(passengers.length);
  };

  const removePassenger = (index) => {
    if (isSeatBased || passengers.length === 1) return;
    const updated = passengers.filter((_, i) => i !== index);
    setExternalPassengers(updated);
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex > index) setOpenIndex(openIndex - 1);
  };

  const isDirty = (a, b) => {
    const keys = Object.keys(a);
    for (let key of keys) {
      if (key !== "isEditing" && key !== "hasSaved") {
        if (a[key] !== b[key]) return true;
      }
    }
    return false;
  };

  const toggleSection = (index) => {
    const passenger = passengers[index];

    if (passenger?.isEditing && passenger?.hasSaved) {
      const original = originalData[index];
      if (original && isDirty(passenger, original)) {
        setPendingCloseIndex(index);
        setShowCloseModal(true);
        return;
      }
    }
    setOpenIndex(openIndex === index ? null : index);
  };

const validatePassenger = (p) => {
  const trim = (val) => (typeof val === "string" ? val.trim() : "");

  const name = trim(p.name);
  const email = trim(p.email);
  const phone = trim(p.phone);
  const code = trim(p.code);
  const passport = trim(p.passport);
  const nationality = trim(p.nationality);
  const gender = trim(p.gender);

    let errs = [];

  // STEP 1: Check Required mandatory fields

  if (!name || !nationality || !phone || !email) {
    toast.error("Please fill all the details.");
    return ["incomplete"];
  }

  // STEP 2: Specific validations
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const phoneRegex = /^\+?[0-9]{10,15}$/;
  const passportRegex = /^[A-Za-z0-9]{8,9}$/;
  const allowedGenders = ["male", "female", "other"];

  if (!nameRegex.test(name)) {
    toast.error("Invalid name: Only letters and spaces allowed.");
    errs.push("name");
  }

  if (email && !emailRegex.test(email)) {
    toast.error("Invalid email format.");
    errs.push("email");
  }

    if (!code.startsWith("+")) {
    toast.error("Invalid country code.");
    errs.push("phone");
  }

  if (phone && !/^\d{10,10}$/.test(phone)) {
    toast.error("Phone must be of 10 digits without + or spaces.");
    errs.push("phone");
  }

  // Validate gender if entered
  if (gender && !allowedGenders.includes(gender.toLowerCase())) {
    toast.error("Gender must be Male, Female, or Other.");
    errs.push("gender");
  }

  // Validate passport only if entered
  if (passport && !passportRegex.test(passport)) {
    toast.error("Passport must be between 8 to 9 alphanumeric characters.");
    errs.push("passport");
  }

  // For non-Indians: passport file is required
  if (nationality.toLowerCase() !== "india" && !p.passportFile) {
    toast.error("Passport file is required for non-Indian nationals.");
    errs.push("passportFile");
  }

  return errs;
};


const toggleEdit = (index) => {
  const updated = [...passengers];

  if (!updated[index].isEditing) {
    setOriginalData((prev) => ({ ...prev, [index]: { ...passengers[index] } }));
  }

  if (updated[index].isEditing) {
    const errs = validatePassenger(updated[index]);
    if (errs.length > 0) {
      setErrors((prev) => ({ ...prev, [index]: errs }));
      setOpenIndex(index);
      return;
    }

    updated[index].isEditing = false;
    updated[index].hasSaved = true;
    setOriginalData((prev) => ({
      ...prev,
      [index]: { ...updated[index] }
    }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });

    setExternalPassengers(updated);
    setOpenIndex(null);
    toast.success("Passenger saved successfully.");
  } else {
    updated[index].isEditing = true;
    setExternalPassengers(updated);
    setOpenIndex(index);
  }
};

useEffect(() => {
  setPetDetails({
    isPet: petTravel === true,
    type: petType,
    specify: specifyPet,
    weight: petWeight,
    vaccinationCertificate,
    sitToTravelCertificate,
    agreePetPolicy
  });
}, [petTravel, petType, specifyPet, petWeight, vaccinationCertificate, sitToTravelCertificate, agreePetPolicy]);


useEffect(() => {
  setCorporateDetails({
    isCorporate,
    companyName,
    companyId
  });
}, [isCorporate, companyName, companyId]);

  return (
    <div style={{
      margin: "0 auto",
      paddingBottom: "40px",
      padding: '15px 20px',
      boxShadow: "0 4px 12px rgba(6, 25, 83, 0.25)",
      borderRadius: '10px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    }}>
      {/* Toast Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "0.85rem",
            fontWeight: 500,
            padding: "10px 20px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px"
          },
          success: {
            style: { borderLeft: "4px solid #10b981" }
          },
          error: {
            style: { borderLeft: "4px solid #ef4444" }
          }
        }}
      />

      {/* Header */}
      <div className="text-center mb-6 pb-10">
        <h1 className="text-3xl font-bold text-[#061953] tracking-wide uppercase pt-2 pb-2 pl-4">Passenger Details</h1>
        <p className="text-sm font-medium text-slate-600 -tracking-wide uppercase">Manage your travel companions</p>
      </div>

      {/* Pet Travel Confirmation */}

      <PetDetailsForm
        petTravel={petTravel}
        setPetTravel={setPetTravel}
        petType={petType}
        setPetType={setPetType}
        specifyPet={specifyPet}
        setSpecifyPet={setSpecifyPet}
        petWeight={petWeight}
        setPetWeight={setPetWeight}
        vaccinationCertificate={vaccinationCertificate}
        setVaccinationCertificate={setVaccinationCertificate}
        sitToTravelCertificate={sitToTravelCertificate}
        setSitToTravelCertificate={setSitToTravelCertificate}
        agreePetPolicy={agreePetPolicy}
        setAgreePetPolicy={setAgreePetPolicy}
      />

      {/* Corporate Booking Section */}
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '10px', paddingBottom: '10px' }}>
        <div className="p-6 rounded-2xl shadow-md transition-all duration-300 space-y-4 mt-8">
          <div className="flex items-center gap-14">
            <label className="text-lg font-semibold text-[#250808]">Is this a corporate booking?</label>
            <ToggleSwitch
            checked={isCorporate}
            onChange={(e) => setIsCorporate(e.target.checked)}
          />
          </div>

          {isCorporate === true && (
            <div className="space-y-4 animate-fadeIn pt-2">
              <div>
                <label className="block text-sm font-semibold mb-1 pt-2 pb-2">Company Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#061953]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 pt-2 pb-2">Company ID / GSTIN</label>
                <input
                  type="text"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#061953]"
                />
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Passengers List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        paddingTop: "10px",
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {passengers.map((p, index) => (
          <PassengerCard
            key={index}
            p={p}
            index={index}
            openIndex={openIndex}
            isSeatBased={isSeatBased}
            errors={errors}
            updatePassenger={updatePassenger}
            toggleEdit={toggleEdit}
            toggleSection={toggleSection}
            removePassenger={removePassenger}
            nationalitySuggestions={nationalitySuggestions}
            setNationalitySuggestions={setNationalitySuggestions}
            previewFile={previewFile}
            setPreviewFile={setPreviewFile}
          />
        ))}
      </div>

      {/* Add Passenger Button */}
      {!isSeatBased && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <button
            onClick={addPassenger}
            style={{
              backgroundColor: '#061953',
              color: 'white',
              border: '1px solid transparent',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#061953';
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#061953';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'white';
              e.target.style.backgroundColor = '#061953';
              e.target.style.borderColor = 'transparent';
            }}
          >
            <Plus size={12} />
            Add Passenger
          </button>
        </div>
      )}

      {/* Unsaved Changes Modal */}
      {showCloseModal && (
        <UnsavedChangesModal
          onSave={() => {
            const updated = [...passengers];
            const errs = validatePassenger(updated[pendingCloseIndex]);

            if (errs.length > 0) {
              setErrors((prev) => ({ ...prev, [pendingCloseIndex]: errs }));
              toast.error("Fix the errors before closing.");
              return;
            }

            updated[pendingCloseIndex].isEditing = false;
            setExternalPassengers(updated);
            setErrors((prev) => {
              const newErr = { ...prev };
              delete newErr[pendingCloseIndex];
              return newErr;
            });

            toast.success("Changes saved.");
            setShowCloseModal(false);
            setPendingCloseIndex(null);
            setOpenIndex(null);
          }}
          onDiscard={() => {
            const index = pendingCloseIndex;
            const restored = [...passengers];
            restored[index] = {
              ...originalData[index],
              isEditing: false,
              hasSaved: true
            };
            setExternalPassengers(restored);
            setErrors((prev) => {
              const newErr = { ...prev };
              delete newErr[index];
              return newErr;
            });
            toast("Changes discarded.", { icon: "🗑️" });
            setShowCloseModal(false);
            setPendingCloseIndex(null);
            setOpenIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default PassengerDetails;
