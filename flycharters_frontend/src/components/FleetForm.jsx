import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { addFleet, updateFleet } from "../api/authAPI";
import { getAllAirports } from "../api/authAPI";
import LoadingOverlay from './hooks/LoadingOverlay';
import useLoading from './hooks/useLoading';

const FleetForm = () => {
  const [formData, setFormData] = useState({
    name: "", 
    capacity: "", 
    model: "", 
    eom: "", 
    validityTill: "",
    status: "available", 
    description: "", 
    aircraftRegn: "",
    auw: "", 
    cruisingSpeed: "", 
    cruisingLevel: "", 
    aircraftBase: "",
    price_per_hour: "",
    priceperseat: "",
    full_plane_price: "",
    isAbleToLandUncontrolled: null,
    isPerformanceLimited: null,
    isAbleToLandShortRunway: null,
    petFriendly: null,
  });

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdate, setIsUpdate] = useState(false);
  const [fleetId, setFleetId] = useState(null);
  const [airports, setAirports] = useState([]);

  useLoading(isSubmitting);
  
  useEffect(() => {
    if (location.state?.fleetData) {
      const { _id, fleetInnerImages = [], ...fleetData } = location.state.fleetData;
      setIsUpdate(true);
      setFleetId(_id);
      setFormData({
        ...fleetData,
        validityTill: fleetData.validityTill?.split("T")[0] || ""
      });
      setExistingImages(fleetInnerImages);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const airportRes = await getAllAirports();
        setAirports(airportRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Error fetching aircrafts or airports");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'cruisingSpeed':
        if (value > 630) return "Speed cannot exceed 630kts";
        if (value <= 0) return "Speed must be positive";
        return null;
      case 'cruisingLevel':
        if (value <= 0) return "Level must be positive";
        return null;
      case 'price_per_hour':
      case 'priceperseat':
      case 'full_plane_price':
        if (value <= 0) return "Price must be positive";
        return null;
      case 'capacity':
        if (value <= 0) return "Capacity must be positive";
        return null;
      case 'eom':
        if (value < 1900 || value > new Date().getFullYear()) 
          return `Year must be between 1900 and ${new Date().getFullYear()}`;
        return null;
      default:
        return null;
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const existingFileNames = existingImages.map(url => url.split("/").pop());
    const newFileNames = newImages.map(file => file.name);

    const filteredFiles = files.filter(file =>
      !existingFileNames.includes(file.name) && !newFileNames.includes(file.name)
    );

    const totalAfterAddition = existingImages.length + newImages.length + filteredFiles.length;
    if (totalAfterAddition > 6) {
      setErrors(prev => ({ ...prev, images: "Maximum 6 images allowed" }));
      return;
    }

    if (filteredFiles.length < files.length) {
      alert("Some duplicate images were skipped.");
    }

    setNewImages(prev => [...prev, ...filteredFiles]);
    setErrors(prev => ({ ...prev, images: null }));
  };

  const removeNewImage = index => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = index => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      // Add console logs for debugging
    console.log("Form submission started");
    console.log("Form data:", formData);
    console.log("New images:", newImages);
    console.log("Existing images:", existingImages);
    
    // Validate all fields
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'description' && !value && key !== 'petFriendly') {
        newErrors[key] = "This field is required";
      } else {
        const error = validateField(key, value);
        if (error) newErrors[key] = error;
      }
    });

    // Validate images
    const totalImages = existingImages.length + newImages.length;
    if (totalImages < 3) {
      newErrors.images = "Minimum 3 images required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    console.log(data);
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    newImages.forEach(file => data.append("fleetImg", file));
    data.append("existingImages", JSON.stringify(existingImages));

    try {
      const res = isUpdate ? await updateFleet(fleetId, data) : await addFleet(data);
      console.log(res);
      alert(`Fleet ${isUpdate ? "updated" : "added"} successfully!`);
      navigate("/operator");
    } catch (err) {
      alert(err.response?.data?.message || "Submission error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fleet-form-container">
      <form onSubmit={handleSubmit} className="fleet-form-main">
        {isSubmitting && <LoadingOverlay />}
        
        <h2 className="fleet-form-title">{isUpdate ? 'Update' : 'Add'} Aircraft</h2>
        
        <div className="fleet-form-grid">
          {/* Left Column */}
          <div className="fleet-form-column">
            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Make of the Aircraft <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`fleet-form-input ${errors.name ? 'input-error' : ''}`}
                required
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Seating Capacity <span className="required-star">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`fleet-form-input ${errors.capacity ? 'input-error' : ''}`}
                min="1"
                required
              />
              {errors.capacity && <span className="error-message">{errors.capacity}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Type of Aircraft <span className="required-star">*</span>
              </label>
              <select 
                name="model" 
                value={formData.model} 
                onChange={handleChange}
                className={`fleet-form-select ${errors.model ? 'input-error' : ''}`}
                required
              >
                <option value="">Select Aircraft Type</option>
                <option>Single engine turbo-prop</option>
                <option>Twin engine turbo-prop</option>
                <option>Single engine light jet</option>
                <option>Twin engine light jet</option>
                <option>Twin engine Medium jet</option>
                <option>Twin engine large jet</option>
                <option>Triple engine large jet</option>
                <option>Single engine piston helicopter</option>
                <option>Single engine turbine helicopter</option>
                <option>Twin engine turbine helicopter</option>
              </select>
              {errors.model && <span className="error-message">{errors.model}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Year of Manufacture (EOM) <span className="required-star">*</span>
              </label>
              <input
                type="number"
                name="eom"
                value={formData.eom}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`fleet-form-input ${errors.eom ? 'input-error' : ''}`}
                min="1900"
                max={currentYear}
                required
                placeholder="e.g. 2008"
              />
              {errors.eom && <span className="error-message">{errors.eom}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Aircraft Registration <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="aircraftRegn"
                value={formData.aircraftRegn}
                onChange={handleChange}
                className={`fleet-form-input ${errors.aircraftRegn ? 'input-error' : ''}`}
                required
                placeholder="V-H123"
                pattern="V[A-Za-z0-9]{4}"
                title="Registration must start with V and be exactly 5 characters (e.g., VABCD or V1234)"
                maxLength={5}
                onInput={(e) => {
                  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  if (e.target.value.length > 0 && e.target.value[0] !== 'V') {
                    e.target.value = 'V' + e.target.value.slice(0, 3);
                  }
                  e.target.value = e.target.value.slice(0, 5);
                }}
              />
              {errors.aircraftRegn && <span className="error-message">{errors.aircraftRegn}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Base Airport <span className="required-star">*</span>
              </label>
              <select
                name="aircraftBase"  
                value={formData.aircraftBase}
                onChange={handleChange}
                className={`fleet-form-select ${errors.aircraftBase ? 'input-error' : ''}`}
                required
              >
                <option value="">Select Aircraft Base</option>
                {airports.map((airport) => (
                  <option key={airport._id} value={airport._id}>
                    {airport.airport_name}
                  </option>
                ))}
              </select>
              {errors.aircraftBase && <span className="error-message">{errors.aircraftBase}</span>}
            </div>

          </div>

          {/* Right Column */}
          <div className="fleet-form-column">
            <div className="fleet-form-group">
              <label className="fleet-form-label">
                AUW (All-Up Weight) <span className="required-star">*</span>
              </label>
              <select 
                name="auw" 
                value={formData.auw} 
                onChange={handleChange}
                className={`fleet-form-select ${errors.auw ? 'input-error' : ''}`}
                required
              >
                <option value="">Select Weight Category</option>
                <option value="below 5700kgs">Below 5700kgs</option>
                <option value="above 5700kgs">Above 5700kgs</option>
              </select>
              {errors.auw && <span className="error-message">{errors.auw}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Cruising Speed (kts) <span className="required-star">*</span>
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  name="cruisingSpeed"
                  value={formData.cruisingSpeed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fleet-form-input ${errors.cruisingSpeed ? 'input-error' : ''}`}
                  min="1"
                  max="630"
                  required
                />
                <span className="input-unit">kts</span>
              </div>
              {errors.cruisingSpeed && <span className="error-message">{errors.cruisingSpeed}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Cruising Level (feet) <span className="required-star">*</span>
              </label>
              <div className="input-with-unit">
                <input
                  type="number"
                  name="cruisingLevel"
                  value={formData.cruisingLevel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`fleet-form-input ${errors.cruisingLevel ? 'input-error' : ''}`}
                  min="1"
                  required
                />
                <span className="input-unit">ft</span>
              </div>
              {errors.cruisingLevel && <span className="error-message">{errors.cruisingLevel}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Validity Till <span className="required-star">*</span>
              </label>
              <input
                type="date"
                name="validityTill"
                value={formData.validityTill}
                onChange={handleChange}
                className={`fleet-form-input ${errors.validityTill ? 'input-error' : ''}`}
                min={today}
                required
              />
              {errors.validityTill && <span className="error-message">{errors.validityTill}</span>}
            </div>

            <div className="fleet-form-group">
              <label className="fleet-form-label">
                Status <span className="required-star">*</span>
              </label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className={`fleet-form-select ${errors.status ? 'input-error' : ''}`}
                required
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="unmaintenance">Under Maintenance</option>
              </select>
              {errors.status && <span className="error-message">{errors.status}</span>}
            </div>
          </div>

          
        </div>

        {/* Pricing Section - Highlighted */}
          <div className="fleet-pricing-section">
              <h3 className="fleet-section-title">Pricing Information</h3>
              <div className="fleet-form-group">
                <label className="fleet-form-label">
                  Price Per Hour (₹) <span className="required-star">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    name="price_per_hour"
                    value={formData.price_per_hour}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`fleet-form-input ${errors.price_per_hour ? 'input-error' : ''}`}
                    min="0.01"
                    step="0.01"
                    required
                  />
                  <span className="input-unit">₹</span>
                </div>
                {errors.price_per_hour && <span className="error-message">{errors.price_per_hour}</span>}
              </div>

              <div className="fleet-form-group">
                <label className="fleet-form-label">
                  Price Per Seat (₹) <span className="required-star">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    name="priceperseat"
                    value={formData.priceperseat}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`fleet-form-input ${errors.priceperseat ? 'input-error' : ''}`}
                    min="0.01"
                    step="0.01"
                    required
                  />
                  <span className="input-unit">₹</span>
                </div>
                {errors.priceperseat && <span className="error-message">{errors.priceperseat}</span>}
              </div>

              <div className="fleet-form-group">
                <label className="fleet-form-label">
                  Full Plane Price (₹) <span className="required-star">*</span>
                </label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    name="full_plane_price"
                    value={formData.full_plane_price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`fleet-form-input ${errors.full_plane_price ? 'input-error' : ''}`}
                    min="0.01"
                    step="0.01"
                    required
                  />
                  <span className="input-unit">₹</span>
                </div>
                {errors.full_plane_price && <span className="error-message">{errors.full_plane_price}</span>}
              </div>
          </div>

        {/* Aircraft Features Section */}
        <div className="fleet-features-section">
          <h3 className="fleet-features-title">Aircraft Features</h3>
          
          <div className="fleet-feature-row">
            <label className="fleet-feature-label">
              Is your aircraft able to land in uncontrolled area? <span className="required-star">*</span>
            </label>
            <div className="fleet-feature-options">
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="isAbleToLandUncontrolled"
                  checked={formData.isAbleToLandUncontrolled === true}
                  onChange={() => setFormData({...formData, isAbleToLandUncontrolled: true})}
                  required
                />
                <span>Yes</span>
              </label>
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="isAbleToLandUncontrolled"
                  checked={formData.isAbleToLandUncontrolled === false}
                  onChange={() => setFormData({...formData, isAbleToLandUncontrolled: false})}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="fleet-feature-row">
            <label className="fleet-feature-label">
              Performance limited? <span className="required-star">*</span>
            </label>
            <div className="fleet-feature-options">
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="isPerformanceLimited"
                  checked={formData.isPerformanceLimited === true}
                  onChange={() => setFormData({...formData, isPerformanceLimited: true})}
                  required
                />
                <span>Yes</span>
              </label>
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="isPerformanceLimited"
                  checked={formData.isPerformanceLimited === false}
                  onChange={() => setFormData({...formData, isPerformanceLimited: false})}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="fleet-feature-row">
            <label className="fleet-feature-label">
              Can your aircraft land on runways shorter than 5000ft? <span className="required-star">*</span>
            </label>
            <div className="fleet-feature-options">
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="isAbleToLandShortRunway"
                  checked={formData.isAbleToLandShortRunway === true}
                  onChange={() => setFormData({...formData, isAbleToLandShortRunway: true})}
                  required
                />
                <span>Yes</span>
              </label>
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="isAbleToLandShortRunway"
                  checked={formData.isAbleToLandShortRunway === false}
                  onChange={() => setFormData({...formData, isAbleToLandShortRunway: false})}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="fleet-feature-row">
            <label className="fleet-feature-label">
              Pet Friendly? <span className="required-star">*</span>
            </label>
            <div className="fleet-feature-options">
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="petFriendly"
                  checked={formData.petFriendly === true}
                  onChange={() => setFormData({...formData, petFriendly: true})}
                  required
                />
                <span>Yes</span>
              </label>
              <label className="fleet-radio-label">
                <input
                  type="radio"
                  name="petFriendly"
                  checked={formData.petFriendly === false}
                  onChange={() => setFormData({...formData, petFriendly: false})}
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="fleet-upload-section">
          <h3 className="fleet-upload-title">
            Attach Aircraft Images (3-6) <span className="required-star">*</span>
          </h3>
          <div className="fleet-upload-box">
            <label className="fleet-upload-button">
              Choose Images
              <br></br>
              <span className="fleet-upload-hint">JPEG, PNG up to 6MB</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange} 
                className="fleet-file-input"
              />
            </label>
            
          </div>
          {errors.images && <span className="error-message">{errors.images}</span>}

          <div className="fleet-image-preview">
            {existingImages.map((url, i) => (
              <div key={`existing-${i}`} className="fleet-preview-item">
                <img src={url} alt="existing" className="fleet-preview-img" />
                <button 
                  type="button" 
                  onClick={() => removeExistingImage(i)}
                  className="fleet-remove-image"
                >
                  ✖
                </button>
              </div>
            ))}
            {newImages.map((file, i) => (
              <div key={`new-${i}`} className="fleet-preview-item">
                <img src={URL.createObjectURL(file)} alt="new" className="fleet-preview-img"/>
                <button 
                  type="button" 
                  onClick={() => removeNewImage(i)}
                  className="fleet-remove-image"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="fleet-form-group">
        <label className="fleet-form-label">
                Description / Special Info <span className="required-star">*</span>
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                className={`fleet-form-textarea ${errors.description ? 'input-error' : ''}`}
                required
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="fleet-form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="fleet-submit-button"
          >
            {isSubmitting ? (
              <span className="fleet-spinner"></span>
            ) : isUpdate ? (
              "Update Aircraft"
            ) : (
              "Add Aircraft"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FleetForm;