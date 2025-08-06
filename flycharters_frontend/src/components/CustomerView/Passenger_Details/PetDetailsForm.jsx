// components/PetDetailsForm.jsx
import React from "react";
import toast from "react-hot-toast";

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


const PetDetailsForm = ({
  petTravel,
  setPetTravel,
  petType,
  setPetType,
  specifyPet,
  setSpecifyPet,
  petWeight,
  setPetWeight,
  vaccinationCertificate,
  setVaccinationCertificate,
  sitToTravelCertificate,
  setSitToTravelCertificate,
  agreePetPolicy,
  setAgreePetPolicy
}) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '10px' }}>
      <div className="p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center gap-10">
          <label className="text-lg font-semibold text-[#250808] my-2">Are you travelling with a pet?</label>
          <ToggleSwitch
            checked={petTravel}
            onChange={(e) => setPetTravel(e.target.checked)}
          />
        </div>

        {/* Pet Details Form */}
        {petTravel && (
          <div className="space-y-6 animate-fadeIn">

            {/* Pet Type */}
            <div className="flex items-center gap-6 pb-1 pt-4">
              <label className="block text-md font-semibold text-[#250808] mb-2">Which type of pet? *</label>
              <div className="flex flex-wrap gap-4 pt-2">
                {["Dog", "Cat", "Other"].map(type => (
                  <button
                    key={type}
                    onClick={() => setPetType(type)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      petType === type
                        ? 'bg-[#061953] text-white'
                        : 'border-[#250808] text-[#250808] hover:bg-[#061953]/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Specify if "Other" */}
            {petType === "Other" && (
              <div className="pt-1 pb-2">
                <label className="block text-sm font-semibold mb-1 pt-1 pb-1">Specify *</label>
                <input
                  type="text"
                  value={specifyPet}
                  onChange={e => setSpecifyPet(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-[#250808]"
                  placeholder="Type of pet"
                />
              </div>
            )}

            {/* Pet Weight */}
            <div className="pb-2 pt-2">
              <label className="block text-sm font-semibold mb-1 pb-1 pt-1">Pet Weight * (in kg)</label>
              <input
                type="number"
                min={1}
                value={petWeight}
                onChange={e => setPetWeight(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-[#250808]"
              />
            </div>

            {/* Vaccination Certificate */}
            <div className="pb-2 pt-2">
              <label className="block text-sm font-semibold mb-1 pb-1 pt-1">Vaccination Certificate *</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setVaccinationCertificate(file);
                    toast.success("Vaccination certificate selected");
                  }
                }}
                className="block w-full pb-2 text-sm border border-gray-300 rounded-md bg-white p-2 file:bg-[#061953] file:text-white file:rounded-md file:px-4 file:py-1 hover:file:cursor-pointer"
              />
              {vaccinationCertificate && (
                <p className="text-sm text-green-600 mt-1">{vaccinationCertificate.name} ✔</p>
              )}
            </div>

            {/* Sit-to-Travel Certificate Toggle */}

            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm text-[#250808]">
                <input
                  type="checkbox"
                  checked={sitToTravelCertificate}
                  onChange={e => setSitToTravelCertificate(e.target.checked)}
                  className="accent-[#250808]"
                />
                <span>
                  Do you have Fit-to-travel certificate?
                </span>
              </label>
              <label className="block text-sm font-light mb-2 italic">Please Carry Fit-to-Travel Certificate issued within 48 hours of Booking to avoid any further delays.</label>
            </div>

            {/* <div className="pb-1 pt-1">
              <div className="flex items-center gap-6 pb-2 pt-2">
                <label className="block text-sm font-light mb-2 italic">Please Carry Fit-to-Travel Certificate issued within 48 hours of Booking to avoid any further delays.</label>
              </div>
            </div> */}

            {/* Pet Policy Agreement */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm text-[#250808]">
                <input
                  type="checkbox"
                  checked={agreePetPolicy}
                  onChange={e => setAgreePetPolicy(e.target.checked)}
                  className="accent-[#250808]"
                />
                <span>
                  I agree with the <span className="text-red-600 font-semibold underline cursor-pointer">General Rules</span> for pets on board *
                </span>
              </label>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetailsForm;