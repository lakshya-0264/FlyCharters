import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaUser, FaPhone, FaEnvelope, FaSave, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../utils/cropImage";
import "./ProfileEditor.css";
import defaultProfile from '../../assets/default-profile.jpg';

const ProfileEditor = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    setFirstName(localStorage.getItem("first_name") || "");
    setLastName(localStorage.getItem("last_name") || "");
    setPhone(localStorage.getItem("phone") || "");
    setEmail(localStorage.getItem("email") || "");
    setPreview(localStorage.getItem("profile_pic") || defaultProfile);
  }, []);

  const handleSave = () => {
    if (!firstName || !lastName || !phone) {
      toast.warn("Please fill all fields except email.", { autoClose: 3000 });
      return;
    }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.", { autoClose: 3000 });
      return;
    }

    localStorage.setItem("first_name", firstName);
    localStorage.setItem("last_name", lastName);
    localStorage.setItem("phone", phone);
    if (preview) localStorage.setItem("profile_pic", preview);
    toast.success("Profile updated successfully!", { autoClose: 3000 });
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setShowCropper(true);
    }
  };

  const handleCropSave = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    setPreview(croppedImage);
    setImage(null);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setImage(null);
    setShowCropper(false);
  };

  const handleClickImage = () => {
    // setShowCropper(true);
  };

  return (
    <motion.div
      className="profile-editor-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="profile-title">Edit Your Profile</h2>

      <div className="profile-picture-section">
        <div className="profile-picture">
          <img src={preview || defaultProfile} alt="Profile" className="profile-img" />
          <label className="upload-label">
            <FaCamera />
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
        </div>
      </div>

      <div className="profile-form-section">
        <div className="profile-field">
          <FaUser />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>

        <div className="profile-field">
          <FaUser />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>

        <div className="profile-field">
          <FaPhone />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
        </div>

        <div className="profile-field">
          <FaEnvelope />
          <input
            type="email"
            value={email}
            disabled
            placeholder="Email"
            className="disabled"
          />
        </div>

        <button className="save-btn" onClick={handleSave}>
          <FaSave /> Save Changes
        </button>
      </div>

      {showCropper && (
        <div className="cropper-modal">
          <div className="cropper-popup">
            <div className="cropper-wrapper">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
                cropShape="round"
                objectFit="auto-cover"
              />
            </div>

            <div className="zoom-control">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
              />
            </div>

            <div className="cropper-actions">
              <button onClick={handleCancelCrop}>Cancel</button>
              <button onClick={handleCropSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileEditor;
