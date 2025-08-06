import React, { useState, useEffect } from "react";
import { getFleetAircrafts, getAllAirports, createCapabilities } from "../api/authAPI";
import { FaPlaneDeparture, FaClock, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import { TbBuildingAirport } from "react-icons/tb";
import Select from "react-select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from './hooks/LoadingOverlay';
import useLoading from './hooks/useLoading';


const LandingCapability = () => {
  const [formData, setFormData] = useState({
    aircraft_id: [],
    from_airport: [],
    status: "",
    date_from: "",
    date_to: "",
    time_from: "",
    time_to: "",
  });

  const [errors, setErrors] = useState({});
  const [aircrafts, setAircrafts] = useState([]);
  const [airports, setAirports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useLoading(isSubmitting);
  useEffect(() => {
    const operatorId = localStorage.getItem("id");
    const fetchData = async () => {
      try {
        const fleetRes = await getFleetAircrafts(operatorId);
        setAircrafts(fleetRes.data.data || []);

        const airportRes = await getAllAirports();
        setAirports(airportRes.data.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Error fetching aircrafts or airports");
      }
    };
    fetchData();
  }, []);

  const airportOptions = airports.map((airport) => ({
    value: airport._id,
    label: `${airport.airport_name} (${airport.source_IATA})`,
  }));

  const aircraftOptions = aircrafts.map((aircraft) => ({
    value: aircraft._id,
    label: aircraft.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Aircraft validation
    if (formData.aircraft_id.length === 0) {
      newErrors.aircraft_id = "At least one aircraft is required";
    }
    
    // Airport validation
    if (formData.from_airport.length === 0) {
      newErrors.from_airport = "At least one airport is required";
    }
    
    // Status validation
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    
    // Note validation for certain statuses
    const needsNote = ["not_landable", "not_departure", "conditional"].includes(formData.status);
    if (needsNote && !formData.note.trim()) {
      newErrors.note = "Note is required for this status";
    }
    
    // Date/time validation for non-standard statuses
    const needsDateTime = formData.status && !["landable", "departure"].includes(formData.status);
    if (needsDateTime) {
      if (!formData.date_from) newErrors.date_from = "Start date is required";
      if (!formData.date_to) newErrors.date_to = "End date is required";
      if (!formData.time_from) newErrors.time_from = "Start time is required";
      if (!formData.time_to) newErrors.time_to = "End time is required";
      
      // Validate date range if both dates exist
      if (formData.date_from && formData.date_to) {
        const startDate = new Date(formData.date_from);
        const endDate = new Date(formData.date_to);
        
        if (startDate > endDate) {
          newErrors.date_to = "End date must be after start date";
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = formData.aircraft_id.map((aircraftId) => ({
        aircraftId,
        airports: formData.from_airport.map((_id) => ({
          airportCode: _id,
          landing:
            (formData.status === "not_landable" || formData.status === "conditional") && {
              status: formData.status,
              note: formData.note,
              date_from: formData.date_from,
              date_to: formData.date_to,
              time_from: formData.time_from,
              time_to: formData.time_to,
            },
          departure:
            (formData.status === "not_departure" || formData.status === "conditional") && {
              status: formData.status,
              note: formData.note,
              date_from: formData.date_from,
              date_to: formData.date_to,
              time_from: formData.time_from,
              time_to: formData.time_to,
            },
        })),
      }));

      const response = await createCapabilities(payload);
      
      if (response.error) {
        toast.error(response.error);
        if (response.details) {
          response.details.forEach(detail => toast.error(detail));
        }
      } else {
        toast.success("Capabilities updated successfully!");
        // Reset form
        setFormData({
      aircraft_id: formData.aircraft_id, 
      from_airport: formData.from_airport,
          status: "",
          note: "",
          date_from: "",
          date_to: "",
          time_from: "",
          time_to: "",
        });
        setErrors({});
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 
                        err.response?.data?.message || 
                        "Error submitting data. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="capability-form-container">
      {isSubmitting && <LoadingOverlay />}

      <div className="capability-form__sections">
        {/* Aircraft Selection */}
        <div className={`capability-form__section capability-form__section--aircraft ${
          errors.aircraft_id ? 'capability-form__section--error' : ''
        }`}>
          <div className="capability-form__section-header">
            <FaPlaneDeparture className="capability-form__icon capability-form__icon--aircraft" />
            <label className="capability-form__label">Select Aircraft(s)</label>
          </div>
          <Select
            isMulti
            name="aircraft_id"
            options={aircraftOptions}
            value={aircraftOptions.filter((opt) => formData.aircraft_id.includes(opt.value))}
            required
            onChange={(selected) => {
              setFormData((prev) => ({
                ...prev,
                aircraft_id: selected.map((opt) => opt.value),
              }));
              setErrors(prev => ({...prev, aircraft_id: undefined}));
            }}
            placeholder="Select one or more aircraft..."
            className={`capability-form__select-container ${
              errors.aircraft_id ? 'capability-form__select-container--error' : ''
            }`}
            classNamePrefix="capability-form__select"
          />
          {errors.aircraft_id && (
            <div className="capability-form__error">
              <FaExclamationTriangle className="capability-form__error-icon" />
              {errors.aircraft_id}
            </div>
          )}
        </div>

        {/* Airport Selection */}
        <div className={`capability-form__section capability-form__section--airport ${
          errors.from_airport ? 'capability-form__section--error' : ''
        }`}>
          <div className="capability-form__section-header">
            <TbBuildingAirport className="capability-form__icon capability-form__icon--airport" />
            <label className="capability-form__label">Select Airport(s)</label>
          </div>
          <Select
            isMulti
            name="from_airport"
            options={airportOptions}
            value={airportOptions.filter((opt) => formData.from_airport.includes(opt.value))}
            required
            onChange={(selected) => {
              setFormData((prev) => ({
                ...prev,
                from_airport: selected.map((opt) => opt.value),
              }));
              setErrors(prev => ({...prev, from_airport: undefined}));
            }}
            placeholder="Select one or more airports..."
            className={`capability-form__select-container ${
              errors.from_airport ? 'capability-form__select-container--error' : ''
            }`}
            classNamePrefix="capability-form__select"
          />
          {errors.from_airport && (
            <div className="capability-form__error">
              <FaExclamationTriangle className="capability-form__error-icon" />
              {errors.from_airport}
            </div>
          )}
        </div>
        
<div className={`capability-form__section capability-form__section--status ${
          errors.status ? 'capability-form__section--error' : ''
        }`}>
          <label className="capability-form__label">Capability Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className={`capability-form__select capability-form__select--status ${
              errors.status ? 'capability-form__select--error' : ''
            }`}
          >
            <option value="">Select a status...</option>
            <option value="PerformanceLimited">Performance limited runway approved</option>
            <option value="Uncontrolled">Ability to land at uncontrolled airfields</option>
            <option value="ShortRunway">Ability to land at runways less than 5000 feet</option>

          </select>
          {errors.status && (
            <div className="capability-form__error">
              <FaExclamationTriangle className="capability-form__error-icon" />
              {errors.status}
            </div>
          )}
        </div>
        {/* Date and Time Range */}
        {formData.status && (
          <div className="capability-form__section capability-form__section--datetime">
            <div className="capability-form__section-header">
              <FaCalendarAlt className="capability-form__icon capability-form__icon--calendar" />
              <label className="capability-form__label">Time Period</label>
            </div>
            <div className="capability-form__datetime-grid">
              <div className="capability-form__datetime-group">
                <label className="capability-form__datetime-label">From</label>
                <div className="capability-form__datetime-inputs">
                  <div className="capability-form__input-wrapper">
                    <input
                      type="date"
                      name="date_from"
                      value={formData.date_from}
                      onChange={handleChange}
                      required
                      className={`capability-form__input capability-form__input--date ${
                        errors.date_from ? 'capability-form__input--error' : ''
                      }`}
                    />
                    {errors.date_from && (
                      <div className="capability-form__error capability-form__error--inline">
                        <FaExclamationTriangle className="capability-form__error-icon" />
                        {errors.date_from}
                      </div>
                    )}
                  </div>
                  <div className="capability-form__input-wrapper">
                    <div className="capability-form__time-wrapper">
                      <FaClock className="capability-form__time-icon" />
                      <input
                        type="time"
                        name="time_from"
                        value={formData.time_from}
                        onChange={handleChange}
                        required
                        className={`capability-form__input capability-form__input--time ${
                          errors.time_from ? 'capability-form__input--error' : ''
                        }`}
                      />
                    </div>
                    {errors.time_from && (
                      <div className="capability-form__error capability-form__error--inline">
                        <FaExclamationTriangle className="capability-form__error-icon" />
                        {errors.time_from}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="capability-form__datetime-group">
                <label className="capability-form__datetime-label">To</label>
                <div className="capability-form__datetime-inputs">
                  <div className="capability-form__input-wrapper">
                    <input
                      type="date"
                      name="date_to"
                      value={formData.date_to}
                      onChange={handleChange}
                      required
                      className={`capability-form__input capability-form__input--date ${
                        errors.date_to ? 'capability-form__input--error' : ''
                      }`}
                    />
                    {errors.date_to && (
                      <div className="capability-form__error capability-form__error--inline">
                        <FaExclamationTriangle className="capability-form__error-icon" />
                        {errors.date_to}
                      </div>
                    )}
                  </div>
                  <div className="capability-form__input-wrapper">
                    <div className="capability-form__time-wrapper">
                      <FaClock className="capability-form__time-icon" />
                      <input
                        type="time"
                        name="time_to"
                        value={formData.time_to}
                        onChange={handleChange}
                        required
                        className={`capability-form__input capability-form__input--time ${
                          errors.time_to ? 'capability-form__input--error' : ''
                        }`}
                      />
                    </div>
                    {errors.time_to && (
                      <div className="capability-form__error capability-form__error--inline">
                        <FaExclamationTriangle className="capability-form__error-icon" />
                        {errors.time_to}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Selection */}
        

        {/* Note Field (conditionally shown) */}
        {formData.status && (
          <div className={`capability-form__section capability-form__section--notes ${
            errors.note ? 'capability-form__section--error' : ''
          }`}>
            <label className="capability-form__label">Additional Notes</label>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Enter any special conditions or notes..."
              className={`capability-form__input capability-form__input--notes ${
                errors.note ? 'capability-form__input--error' : ''
              }`}
            />
            {errors.note && (
              <div className="capability-form__error">
                <FaExclamationTriangle className="capability-form__error-icon" />
                {errors.note}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="capability-form__actions">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`capability-form__button capability-form__button--submit ${
            isSubmitting ? 'capability-form__button--loading' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="capability-form__button-content">
              <svg className="capability-form__button-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="capability-form__button-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="capability-form__button-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Update Capabilities"
          )}
        </button>
      </div>
    </div>
  );
};

export default LandingCapability;