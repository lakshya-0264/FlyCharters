
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
// import { useAuthPopup } from "../../context/AuthPopupContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyEmail, resendOtp } from "../api/authAPI"; 
import { useNavigate } from "react-router-dom";
import { useAuthPopup } from "../context/AuthPopupContext";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled(motion.div)`
  width: 450px;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const CloseIcon = styled(IoMdClose)`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 1.5rem;
  color: #555;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #003366;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const OTPFields = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const OTPInput = styled.input`
  width: 2.5rem;
  height: 3rem;
  font-size: 1.25rem;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #003366;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease all;

  &.verify {
    background-color: #003366;
    color: #fff;

    &:hover {
      background-color: #002244;
    }
  }

  &.cancel {
    background-color: #ccc;
    color: #333;

    &:hover {
      background-color: #bbb;
    }
  }
`;

const ResendButton = styled(motion.button)`
  margin-top: 10px;
  padding: 6px 16px;
  font-size: 14px;
  border-radius: 6px;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#003366")};
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s;
  scale: 1;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#002244")};
  }
`;

const OTPModal = ({ isOpen, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  const [verifying, setVerifying] = useState(false);
  const [storedEmail, setStoredEmail] = useState("");
  useEffect(() => {
    const emailFromStorage = localStorage.getItem("email");
    setStoredEmail(emailFromStorage || "");
  }, []);

  const { setShowAuthPopup } = useAuthPopup();
  
  // New effect to start timer when modal opens
    useEffect(() => {
      if (isOpen) {
        setResendTimer(30);
      } else {
        setResendTimer(0);
      }
    }, [isOpen]);

    useEffect(() => {
      if (resendTimer > 0) {
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [resendTimer]);

  const handleResendOTP = async () => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Email not found in local storage.");
      return;
    }

    setResending(true);

    try {
      await resendOtp({ email }); // Make sure to use resendOtp API here
      toast.success("OTP resent successfully!");
      setResendTimer(30); // restart 30s timer on resend
    } catch (error) {
      toast.error("Failed to resend OTP.");
      console.error(error);
    } finally {
      setResending(false);
    }
  };


  const handleChange = (index, value) => {
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value; // text + digit
      setOtp(newOtp);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData("Text").trim();

  // Accept only alphanumeric, up to 6 characters
  if (/^[a-zA-Z0-9]{6}$/.test(pasteData)) {
    const newOtp = pasteData.split("").slice(0, 6);
    setOtp(newOtp);

    // Autofocus next empty field or blur after last
    const nextEmpty = newOtp.findIndex((char) => char === "");
    if (nextEmpty === -1) {
      inputsRef.current[5]?.blur();
    } else {
      inputsRef.current[nextEmpty]?.focus();
    }
  } else {
    toast.error("Please paste a valid 6-character alphanumeric OTP.");
  }
};


  const handleKeyDown = (index, e) => {
  if (e.key === "Backspace") {
    const newOtp = [...otp];
    if (newOtp[index] === "") {
      if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputsRef.current[index - 1]?.focus();
      }
    } else {
      newOtp[index] = "";
      setOtp(newOtp);
    }
  }
};

const navigate = useNavigate();

const handleVerify = async () => {
  const enteredOtp = otp.join(""); 
  const email = localStorage.getItem("email");

  if (!email) {
    toast.error("Email not found. Please try again.");
    return;
  }

  setVerifying(true); // Start loading

  try {
    await verifyEmail({ email, verify_code: enteredOtp });
    toast.success("Email verified successfully!");
    toast.warn("Please Sign in to continue..");

    // const role = localStorage.getItem("role");
    // console.log("Role from localStorage:", role);

    // const routeMap = {
    //   user: "/user",
    //   customer: "/user",
    //   operator: "/operator-details",
    //   corporate: "/dashboard"
    // };

    // const path = routeMap[role] || "/";
    // navigate(path);
    // onClose();
    // localStorage.removeItem("role");

    // To not redirect on dashboard -> Gaurav's Request
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    setTimeout(() => {
      onClose();
      setShowAuthPopup(false);
      navigate("/"); 
    }, 1000);

  } catch (error) {
    console.error("Verification Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Verification failed. Try again.");
  } finally {
    setVerifying(false); // Stop loading
  }
};


  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay>
          <ModalContainer
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <CloseIcon onClick={onClose} />
            <Title>Enter OTP</Title>
            <p className="pb-5">Please check <span className="font-semibold">{storedEmail}</span></p>
            <OTPFields>
              {[...Array(6)].map((_, i) => (
                <OTPInput
                  key={i}
                  type="text"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={(e) => handlePaste(e)}
                  ref={(el) => (inputsRef.current[i] = el)}
                />
              ))}
            </OTPFields>

            <ButtonGroup>
              <Button className="verify" onClick={handleVerify}>
                Verify OTP
              </Button>
              <Button className="cancel" onClick={onClose}>
                Cancel
              </Button>
            </ButtonGroup>

            <motion.div style={{ textAlign: "center" }}>
              <ResendButton
                whileTap={{ scale: 0.95 }} // Smooth click feel
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || resending}
              >
                {resending ? "Resending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </ResendButton>
            </motion.div>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default OTPModal;
