import React, { useState } from "react";
import * as Components from './SignInCSS';
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import './styles.css';
import { useAuthPopup } from '../context/AuthPopupContext';
import { useNavigate } from "react-router-dom";
import { signup, signin } from '../api/authAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOperatorById } from '../api/authAPI';
import { useAuth } from "../context/AuthContext";


function AuthForm( { setShowOtpModal } ) {
    const [signIn, toggle] = useState(true);

    const { setShowAuthPopup } = useAuthPopup();
    const handleClose = () => setShowAuthPopup(false);

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
const handleSignIn = async () => {
  if (!email || !password) {
    toast.warn("Please enter both email and password.", {
      position: "top-center",
      autoClose: 3000,
    });
    return;
  }

  setLoading(true);

  try {
    const res = await signin({ email, password });
    
    console.log("Login successful", res.data);

    const user = res?.data?.data?.user || {};

    localStorage.setItem("id", user.id);
    localStorage.setItem("role", user.role);
    localStorage.setItem("first_name", user.firstName);
    localStorage.setItem("last_name", user.lastName || "");
    localStorage.setItem("phone", user.phone || "");
    localStorage.setItem("email", user.email);

    login(user); 

    toast.success("Logged in successfully!", {
      position: "top-center",
      autoClose: 1000,
    });

    const routeMap = {
      user: "/user",
      customer: "/user",
      admin: "/admin",
    };

    const userRole = user.role;

    if (userRole === "operator") {
      try {
        const operatorRes = await getOperatorById();
        if (operatorRes?.data?.success) {
          navigate("/operator");
        } else {
          navigate("/operator-details");
        }
      } catch (err) {
        console.warn("Operator fetch failed:", err.response?.data?.message);
        navigate("/operator-details");
      }
    } else {
      const path = routeMap[userRole];
      if (path) {
        navigate(path);
      } else {
        toast.info("No dashboard route configured for this role.", {
          position: "top-center"
        });
      }
    }

    setShowAuthPopup(false);
  } catch (error) {
  const errorMessage =
    error.response?.data?.message || error.response?.data || error.message;

  console.error("Login failed:", errorMessage);

  toast.error(errorMessage, {
    position: "top-center",
    autoClose: 3000,
  });
  } finally {
    setLoading(false);
  }
};



    const handleSignUp = async (e) => {
        e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const validRoles = ["user", "customer", "admin", "broker", "operator", "corporate"];

        // Validate fields
        if (!first_name || !last_name || !email || !phone || !password || !role) {
            toast.warn("Please fill in all fields", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
            return;
        }

        if (first_name.length < 2 || last_name.length < 2) {
            toast.error("First and last name must be at least 2 characters", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error("Invalid email format", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!phoneRegex.test(phone)) {
            toast.error("Phone number must be exactly 10 digits", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character", {
                position: "top-center",
                autoClose: 4000,
            });
            return;
        }

        if (!validRoles.includes(role)) {
            toast.error("Invalid role selected", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const userData = { first_name,last_name, email, phone, password, role };
        
        localStorage.setItem("first_name", first_name);
        localStorage.setItem("last_name", last_name);
        localStorage.setItem("email", email);
        localStorage.setItem("phone", phone);
        localStorage.setItem("role", role);

        setLoading(true);  // start loading

        try {
            console.log("Submitting user with role:", role);
            const res = await signup(userData);
            console.log("Signup Success:", res.data);
            setShowOtpModal(true);

            // Clear sign-up form fields
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setRole("");
        } catch (error) {
            const errMsg = error.response?.data || "";

            if (typeof errMsg === "string" && errMsg.includes("Duplicate entry") && errMsg.includes("for key 'users.email'")) {
                toast.error("Email already exists. Please use another email or log in.", {
                    position: "top-center",
                    autoClose: 3000,
                });
            } else {
                const backendMessage = error.response?.data?.message || "Signup failed. Please try again.";
                toast.error(backendMessage, {
                    position: "top-center",
                    autoClose: 3000,
                });
            }

            console.error("Signup Error:", errMsg);
        } finally {
            setLoading(false); // stop loading in both success/fail cases
        }
    };

    const roleMap = {
        admin: "admin",
        operator: "operator",
        user: "user",
        customer: "user",
        corporate: "corporate"
    };


    return (
        <Components.Container className="w-[1200px] min-h-[600px] shadow-2xl relative">

            {/* ✕ Close Button - Always visible on top-right */}
            <Components.CloseButton onClick={handleClose}>✕</Components.CloseButton>

            {/* SIGN UP SECTION */}
            <Components.SignUpContainer signinIn={signIn}>
                {!signIn && (
                    <Components.SignUpForm>
                        <h1 className="cookie-regular text-[20px] pt-2 tracking-widest uppercase font-[500] text-[#003366]">
                            Sign Up For Your Exclusive Altitude!
                        </h1>

                        <Components.Input 
                            type="text" placeholder="First Name" 
                            value={first_name} 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Components.Input 
                            type="text" placeholder="Last Name" 
                            value={last_name} 
                            onChange={(e) => setLastName(e.target.value)}
                        />

                        <Components.Input 
                            type="email" placeholder="Email Address" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Components.Input 
                            type="tel" placeholder="Phone Number" 
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                        />

                        <div className="relative w-full">
                            <Components.Input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingRight: '40px' }}
                            />
                            <span 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* <Components.Input type="password" placeholder="Confirm Password" /> */}

                        <div style={{ marginTop: '1px', marginBottom: '1px', width: '100%', textAlign: 'center' }}>
                            <h3 className="cookie-regular text-lg text-[#003366] mb-4">
                                Choose Role
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '600px', margin: '10px auto' }}>
                                {['corporate', 'operator', 'user'].map((roleOption) => (
                                <Components.RadioWrapper key={roleOption}>
                                    <input
                                    type="radio"
                                    id={roleOption}
                                    name="role"
                                    value={roleMap[roleOption]} // Send mapped value
                                    checked={role === roleMap[roleOption]}
                                    onChange={(e) => setRole(e.target.value)}
                                    />
                                    <label htmlFor={roleOption}>
                                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                    </label>
                                </Components.RadioWrapper>
                                ))}
                            </div>
                        </div>

                        <Components.GhostButton onClick={handleSignUp} disabled={loading} >
                            {loading ? "Sending OTP..." : "Create Account"}
                        </Components.GhostButton>
                    </Components.SignUpForm>
                )}
            </Components.SignUpContainer>

            {/* SIGN IN SECTION */}
            <Components.SignInContainer signinIn={signIn}>
                {signIn && (
                    <Components.SignInForm>
                        {/* Logo on Sign In form */}
                        <div className="absolute top-4 left-6 z-50">
                            <img src="./Logo.png" alt="Logo" className="w-10 h-10" />
                        </div>

                        <h1 className="cookie-regular text-3xl text-[#003366] mb-4">
                            {"Sign-In"}
                        </h1>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key="signin"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 2 }}
                            >
                                <Components.Input 
                                    type='email' 
                                    placeholder='Email' 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="relative w-full">
                                    <Components.Input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ paddingRight: '210px' }}
                                    />
                                    <span 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <Components.GhostButton type="button" onClick={handleSignIn} disabled={loading}> {loading ? "Login..." : "Login"}</Components.GhostButton>
                                </div>
                                <div style={{ width: '100%', textAlign: 'center', marginTop: '5px' }}>
                                    <Components.Anchor 
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); toggle(false)}}
                                        style={{ display: "inline-block", fontSize: "14px" }}
                                        >
                                        Don't have an account?
                                    </Components.Anchor>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </Components.SignInForm>
                )}
            </Components.SignInContainer>

            {/* OVERLAY SECTION */}
            <Components.OverlayContainer signinIn={signIn}>
                <Components.Overlay signinIn={signIn}>
                    <Components.LeftOverlayPanel signinIn={signIn}>
                        <div className="absolute top-4 left-6 z-50">
                            <img src="./Logo.png" alt="Logo" className="w-10 h-10" />
                        </div>
                        <div className="flex items-center justify-center mb-50 ">
                            <h3 className="cookie-regular text-xl text-[#003366]">Gateway to your Sky Sanctuary</h3>
                        </div>
                        <Components.OverlayGhostButton onClick={() => toggle(true)}>
                            Sign In
                        </Components.OverlayGhostButton>
                    </Components.LeftOverlayPanel>

                    <Components.RightOverlayPanel signinIn={signIn}>
                        {/* Close button on Sign-In Overlay */}
                        <Components.CloseButton onClick={handleClose}>✕</Components.CloseButton>
                        <div className="flex items-center justify-center mt-10 mb-50">
                            <h1 className="cookie-regular text-3xl text-[#003366]">Welcome!</h1>
                        </div>
                        <div className="mb-20">
                            <Components.OverlayGhostButton onClick={() => toggle(false)}>
                                Sign Up
                            </Components.OverlayGhostButton>
                        </div>
                    </Components.RightOverlayPanel>
                </Components.Overlay>
            </Components.OverlayContainer>
        </Components.Container>
    );
}

export default AuthForm;
