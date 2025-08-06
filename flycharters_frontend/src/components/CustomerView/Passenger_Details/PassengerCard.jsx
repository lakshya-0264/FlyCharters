// PassengerCard.jsx
import { Trash2, Edit3, Save, ChevronUp, ChevronDown, X, User, Mail, Phone, Globe, CreditCard, Sparkles, UserCheck } from "lucide-react";
import { FaEnvelope, FaPhone, FaPassport, FaGlobe } from "react-icons/fa";
import Select from "react-select";
import { NATIONALITIES, COUNTRY_CODES } from "../../../utils/Nationalities";

const nationalityOptions = NATIONALITIES.map(n => ({ value: n, label: n }));

const PassengerCard = ({
  p,
  index,
  openIndex,
  isSeatBased,
  errors,
  updatePassenger,
  toggleEdit,
  toggleSection,
  removePassenger,
  previewFile,
  setPreviewFile
}) => {
  const passengerErrors = errors[index] || [];
  const isOpen = openIndex === index;

  const inputStyle = (field) => ({
    border: `1px solid ${passengerErrors.includes(field) ? '#dc3545' : '#ccc'}`,
    background: '#fff',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
  });

  const renderStaticField = (label, value, Icon) => (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      background: "#f8f9ff",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1px solid #e0e0e0",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>
      <span style={{ 
        color: "#061953", 
        fontWeight: 600, 
        display: "flex", 
        alignItems: "center", 
        gap: "6px",
        fontSize: "0.85rem"
      }}>
        <Icon size={14} /> {label}
      </span>
      <span style={{ 
        color: "#333", 
        fontSize: "0.9rem",
        minHeight: "20px"
      }}>
        {value || (
          <span style={{ color: "#94a3b8", fontStyle: "italic" }}>-</span>
        )}
      </span>
    </div>
  );

  const getCompletionPercentage = (passenger) => {
    const fields = ['name', 'gender', 'email', 'phone', 'passport', 'nationality'];
    const completed = fields.filter(field => passenger[field] && passenger[field].trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage === 100) return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (percentage >= 50) return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const completion = getCompletionPercentage(p);
  const statusColors = getStatusColor(completion);

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "20px",
      padding: "28px",
      boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
      border: "1px solid #e6eaf5",
      transition: "all 0.3s ease",
      marginBottom: "20px",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(20px)"
    }}>
      <style>
        {`
          .passenger-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .passenger-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .glass-button {
            backdrop-filter: blur(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .glass-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          }
          
          .glass-button:active {
            transform: translateY(0px);
          }
          
          input:focus, select:focus {
            border-color: #061953 !important;
            box-shadow: 0 0 0 3px rgba(6, 25, 83, 0.1) !important;
          }
          
          .suggestion-item:hover {
            background: #061953 !important;
            color: white !important;
            transform: translateX(2px);
          }
        `}
      </style>

      {/* Progress bar */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: `linear-gradient(90deg, #061953 0%, #061953 ${completion}%, #e2e8f0 ${completion}%, #e2e8f0 100%)`,
        transition: "all 0.8s ease"
      }} />
      
      {/* Floating decoration */}
      <div style={{
        position: "absolute",
        top: "15px",
        right: "15px",
        opacity: 0.05
      }}>
        <Sparkles size={40} />
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            background: "#eef2ff",
            padding: "10px",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(6, 25, 83, 0.15)",
            position: "relative"
          }}>
            <User size={18} color="#061953" />
          </div>
          <div>
            <h3 style={{
              fontSize: "1.05rem",
              color: "#061953",
              fontWeight: "600",
              margin: 0,
              textTransform: "capitalize"
            }}>
              {p.name || `Passenger ${index + 1}`}
            </h3>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "4px"
            }}>
              <div style={{
                background: statusColors.bg,
                color: statusColors.color,
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.7rem",
                fontWeight: "600"
              }}>
                {completion}% Complete
              </div>
              {/* {completion === 100 && (
                <div style={{
                  background: "#10b981",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "8px",
                  fontSize: "0.65rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px"
                }}>
                  <UserCheck size={10} />
                  VERIFIED
                </div>
              )} */}
            </div>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {index !== 0 && !isSeatBased && (
            <button 
              onClick={() => removePassenger(index)}
              className="glass-button"
              style={{
                background: "#fff",
                border: "1px solid #dc3545",
                color: "#dc3545",
                padding: "8px",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
          
          <button 
            onClick={() => toggleEdit(index)}
            className="glass-button"
            style={{
              background: "#061953",
              color: "white",
              border: "none",
              padding: "10px 16px",
              fontSize: "0.8rem",
              borderRadius: "12px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer"
            }}
          >
            {p.isEditing ? <Save size={14} /> : <Edit3 size={14} />}
            {p.isEditing ? "Save" : "Edit"}
          </button>
          
          <button 
            onClick={() => toggleSection(index)}
            className="glass-button"
            style={{
              background: "#f1f5f9",
              border: "1px solid #ccc",
              color: "#333",
              padding: "8px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px"
        }}>
          {p.isEditing ? (
            <>
              <input 
                placeholder="Full Name" 
                value={p.name} 
                onChange={(e) => updatePassenger(index, "name", e.target.value)} 
                style={inputStyle("name")} 
              />
              <select 
                value={p.gender} 
                onChange={(e) => updatePassenger(index, "gender", e.target.value)} 
                style={inputStyle("gender")}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input 
                placeholder="Email" 
                type="email" 
                value={p.email} 
                onChange={(e) => updatePassenger(index, "email", e.target.value)} 
                style={inputStyle("email")} 
              />
              <div style={{ display: "flex", gap: "8px", width: "100%" }}>
  <div style={{ flex: "0 0 110px" }}>
    <Select
  options={COUNTRY_CODES}
  value={{ value: p.code, label: p.code }}
  onChange={(o) => updatePassenger(index, "code", o.value)}
  placeholder="+Code"
  menuPortalTarget={document.body}
  styles={{
    control: (base) => ({
      ...base,
      ...inputStyle("code"),
      minHeight: "44px",
      fontSize: "0.88rem",
      width: "100px", // keep input compact
      padding: "2px 6px"
    }),
    menu: (base) => ({
      ...base,
      width: "250px" // dropdown menu wider
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.88rem",
      fontWeight: state.isSelected ? "600" : "500",
      backgroundColor: state.isSelected ? "#061953" : state.isFocused ? "#eef2ff" : "#fff",
      color: state.isSelected ? "#fff" : "#061953",
      padding: "8px 12px",
      cursor: "pointer"
    }),
    singleValue: (base) => ({
      ...base,
      fontWeight: 600,
      color: "#061953"
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: 4
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
  }}
/>


  </div>
  <input
    placeholder="Phone Number"
    type="tel"
    value={p.phone}
    onChange={(e) => updatePassenger(index, "phone", e.target.value)}
    style={{ ...inputStyle("phone"), flexGrow: 1 }}
  />
</div>

              <input 
                placeholder="Passport Number" 
                value={p.passport} 
                onChange={(e) => updatePassenger(index, "passport", e.target.value)} 
                style={inputStyle("passport")} 
              />
              <Select
                options={nationalityOptions}
                value={nationalityOptions.find(o => o.value === p.nationality) || null}
                onChange={o => updatePassenger(index, "nationality", o.value)}
                placeholder="Select Nationality"
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: base => ({
                    ...base,
                    ...inputStyle("nationality"),
                    display: "flex",
                    alignItems: "center",
                    minHeight: "46px"
                  }),
                  option: (base, state) => ({
                    ...base,
                    fontSize: "0.9rem",
                    color: state.isSelected ? "#fff" : "#333",
                    backgroundColor: state.isSelected ? "#061953" : state.isFocused ? "#eef2ff" : "#fff",
                    cursor: "pointer"
                  })
                }}
              />



              {p.isEditing && p.nationality?.toLowerCase() !== "india" && (
              <div className="w-full max-w-md mx-auto mt-6">
                <label className="text-sm font-semibold text-[#061953] block mb-4 pb-4">
                  Upload Passport <span className="text-red-500">*</span>
                </label>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 bg-[#f9fafb] text-center transition-all duration-300 ${
                    passengerErrors.includes("passportFile") ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {!p.passportFile ? (
                    <>
                      <p className="text-sm font-semibold text-[#061953] mb-1">
                        Drag and drop or click to upload passport
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Accepts .jpg, .jpeg, .png, .pdf
                      </p>
                      <input
                        type="file"
                        accept=".png,.jpeg,.jpg,.pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          updatePassenger(index, "passportFile", file);
                        }}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-[#061953]">
                        {p.passportFile.type.startsWith("image/")
                          ? "Image Uploaded"
                          : "PDF Uploaded"}
                      </p>
                      <p className="text-xs text-gray-600 mt-2 mb-2 pt-1 pb-1 break-words">
                        {p.passportFile.name}
                      </p>
                      <div className="flex gap-4 mt-2 pt-2 flex-row justify-center">
                        <button
                          onClick={() => setPreviewFile(p.passportFile)}
                          className="px-4 py-1.5 bg-[#061953] text-white rounded-md text-xs font-semibold hover:bg-blue-900 transition-all"
                        >
                          Preview
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePassenger(index, "passportFile", null);
                          }}
                          className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 transition-all"
                        >
                          Delete & Re-upload
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-red-500 italic mt-2 pt-2 text-center">
                  Required for nationalities other than Indian
                </p>
              </div>
            )}

            {/* 🪟 Modal for Preview */}
{previewFile && (
  <div className="fixed inset-0 z-50 bg-white/40 flex items-center justify-center px-4">
    <div className="bg-white rounded-lg shadow-xl w-90 max-w-md relative">
      <button
        onClick={() => setPreviewFile(null)}
        className="absolute top-4 right-2 text-black hover:text-red-500 transition"
      >
        <X size={18} />
      </button>

      <div className="p-4 pt-6 text-center">
        <h2 className="text-md font-semibold text-[#061953] mb-3 pb-4">Passport Preview</h2>

        {previewFile.type.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(previewFile)}
            alt="Preview"
            className="w-full max-h-50 object-contain rounded"
          />
        ) : (
          <iframe
            src={URL.createObjectURL(previewFile)}
            title="PDF Preview"
            className="w-full h-64 rounded border"
          />
        )}

        <div className="mt-4 pt-4">
          <button
            onClick={() => setPreviewFile(null)}
            className="px-5 py-1.5 text-sm font-medium bg-[#061953] text-white rounded hover:bg-blue-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}


            </>
          ) : (
            <>
              {renderStaticField("Full Name", p.name, User)}
              {renderStaticField("Gender", p.gender, ChevronDown)}
              {renderStaticField("Email", p.email, FaEnvelope)}
              {renderStaticField("Phone", `${p.code} ${p.phone}`, FaPhone)}
              {renderStaticField("Passport", p.passport, FaPassport)}
              {renderStaticField("Nationality", p.nationality, FaGlobe)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PassengerCard;