import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOperator } from "../api/authAPI";
import { toast } from "react-toastify";

const OperatorForm = () => {
  const [documents, setDocuments] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    pointOfContact: "",
    location: "",
    aopNo: "",
    aopValidity: "",
    numAircraft: "",
    nsopBase: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments(file);
      setUploadProgress(0);
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 200);
  };

  const removeFile = () => {
    setDocuments(null);
    setUploadProgress(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documents) {
      toast.error("Please upload a document.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("pointOfContact", formData.pointOfContact);
      dataToSend.append("location", formData.location);
      dataToSend.append("aopNo", formData.aopNo);
      dataToSend.append("aopValidity", formData.aopValidity);
      dataToSend.append("numAircraft", formData.numAircraft);
      dataToSend.append("nsopBase", formData.nsopBase);
      dataToSend.append("documents", documents); // adjust for multiple if needed

      await createOperator(dataToSend);

      toast.success("Operator created successfully!");
      navigate("/operator");
    } catch (err) {
      toast.error("Failed to create operator");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h2 className="form-title">Operator Details</h2>
      <form className="operator-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="name" className="styled-input">Operator Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="pointOfContact" className="styled-input">Name of POC</label>
            <input
              type="text"
              id="pointOfContact"
              name="pointOfContact"
              value={formData.pointOfContact}
              onChange={handleChange}
              required
            />

            <label htmlFor="location" className="styled-input">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <label htmlFor="aopValidity" className="styled-input">Validity of AOP</label>
            <input
              type="month"
              id="aopValidity"
              name="aopValidity"
              value={formData.aopValidity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="aopNo" className="styled-input">AOP No</label>
            <input
              type="text"
              id="aopNo"
              name="aopNo"
              value={formData.aopNo}
              onChange={handleChange}
              required
            />

            <label htmlFor="numAircraft" className="styled-input">No. of Aircraft</label>
            <input
              type="number"
              id="numAircraft"
              name="numAircraft"
              value={formData.numAircraft}
              onChange={handleChange}
              required
            />

            <label htmlFor="nsopBase" className="styled-input">NSOP Base (ICAO Code)</label>
            <input
              type="text"
              id="nsopBase"
              name="nsopBase"
              value={formData.nsopBase}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="upload-box" style={{ margin: 0 }}>
          <h2>Upload Documents</h2>
          <label className="upload-area" style={{ padding: '10px' }}>
            <input type="file" accept=".pdf,.doc,.docx,.txt,.zip" onChange={handleFileChange} />
            <span>Click to upload</span> or drag and drop
          </label>

          {documents && (
            <div className="file-item">
              <div className="file-info">
                <span>{documents.name}</span>
                <span>{(documents.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: "#333",
                    color: "black",
                  }}
                ></div>
              </div>
              <button type="button" onClick={removeFile}>✖</button>
            </div>
          )}
        </div>

        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default OperatorForm;
