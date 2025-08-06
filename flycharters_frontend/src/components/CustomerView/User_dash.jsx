import React, { useState, useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { Plane, User, Star, Home, LogOut, Facebook, Twitter, Instagram, Linkedin, Search, Calendar, Users, MapPin, Download, Eye, Menu, X, BookOpen, Plus, Settings } from 'lucide-react';
import './User_dash.css';
import { Link, Outlet, useLocation } from 'react-router-dom';
import FlightBookingForm from "./Flight_Booking/FlightBookingForm";
import UpcomingBookings from "./UpcomingBookings"
import Footer from '../LandingPage/Footer';
import myImage from '../../assets/landcommuteservice.png';
import celebration from '../../assets/celebration.png';
import pettravel from '../../assets/pettravel.png';
import addlandcommute from '../../assets/addlandcommute.png';
import UpcomingBookingsOneway from './UpcomingBookingsOneway';

const User_dash = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hoverTimeoutRef = useRef(null);
    const first_name = localStorage.getItem("first_name"); 
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const upgradeOptions = [
        { 
            title: 'Add Land Commute',
            image: addlandcommute,
            route: '/user/landcommute'
        },
        { 
            title: 'Add Onboard Catering',
            image: myImage,
            route: '/user/catering'
        },
        {
            title: 'Add Pet Travel',
            image: pettravel,
            route: '/user/pettravel'
        },
        { 
            title: 'Add a Celebration',
            image: celebration,
            route: '/user/celebration'
        }
    ];

    // Handle dropdown hover
    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200); // Small delay to allow moving to dropdown
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        console.log("Feedback submitted:", feedback);
        setFeedback('');
        alert("Thank you for your feedback!");
    };

    // Handle upgrade card click
    const handleUpgradeClick = (route) => {
        navigate(route);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setIsDropdownOpen(false);
        localStorage.clear();
        localStorage.setItem("showLogoutToast", "true");
        navigate('/', { replace: true });

        setTimeout(() => {
            // toast.success("Logged out successfully!", {
            //     position: "top-center",
            //     duration: 3000,
            // });
            setIsLoggingOut(false);
        }, 600);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownItemClick = () => {
        setIsDropdownOpen(false);
    };

    // Check if we're on a nested route (should show Outlet content)
    const isNestedRoute = location.pathname !== '/user' && location.pathname !== '/user/';

    // Dashboard content component
    const DashboardContent = () => (
        <>
            {/* Search Flight Section */}
            <FlightBookingForm/>

            {/* Upcoming Flight Details */}
            <UpcomingBookingsOneway/>
            {/* <UpcomingBookings/> */}

            {/* Upgrade Your Experience Section */}
            <div className="card card-large">
                <h2 className="card-title card-title-large">
                    Upgrade Your Experience
                </h2>
                
                <div className="upgrade-grid">
                    {upgradeOptions.map((item, index) => (
                        <div
                            key={index}
                            className="upgrade-card"
                            style={{ 
                                backgroundImage: `url(${item.image})`,
                                cursor: 'pointer'
                            }}
                            onClick={() => handleUpgradeClick(item.route)}
                        >
                            <div className="upgrade-overlay">
                                <h3 className="upgrade-title">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leave a Feedback Section */}
            <div className="card">
                <h2 className="card-title">Leave a Feedback</h2>
                
                <form onSubmit={handleFeedbackSubmit}>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your experience with us..."
                        rows="5"
                        className="feedback-textarea"
                    />
                    
                    <div className="text-center">
                        <button type="submit" className="submit-button">
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </>
    );

    return (
        <div className="user-dash-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link to = "/user"><img src="/Logo.png" alt="Logo" className="navbar-logo" /></Link>
                </div>
                
                {/* Welcome Message */}
                <div className="navbar-welcome">
                    <User size={20} color="#061953" />
                    <span className="welcome-text">Welcome back, {first_name}!</span>
                </div>
                
                <div className="navbar-actions">
                    {/* Profile Dropdown */}
                    <div 
                        className="dropdown-container" 
                        ref={dropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="profile-icon">
                            <Settings size={24} />
                        </div>
                        
                        {isDropdownOpen && (
                            <div className="dropdown-card">
                                <Link 
                                    to="/user/profile" 
                                    className="dropdown-item"
                                    onClick={handleDropdownItemClick}
                                >
                                    <User size={18} />
                                    Profile
                                </Link>
                                
                                <Link 
                                    to="/user/addons" 
                                    className="dropdown-item"
                                    onClick={handleDropdownItemClick}
                                >
                                    <Plus size={18} />
                                    Add-ons
                                </Link>
                                
                                <Link 
                                    to="/user/bookings" 
                                    className="dropdown-item"
                                    onClick={handleDropdownItemClick}
                                >
                                    <BookOpen size={18} />
                                    My Bookings
                                </Link>
                                
                                <div 
                                    className={`dropdown-item logout-item ${isLoggingOut ? 'loading' : ''}`}
                                    onClick={!isLoggingOut ? handleLogout : undefined}
                                >
                                    {isLoggingOut ? (
                                        <div className="loader-spinner" style={{ 
                                            width: '18px', 
                                            height: '18px', 
                                            border: '2px solid #dc3545', 
                                            borderTop: '2px solid transparent', 
                                            borderRadius: '50%', 
                                            animation: 'spin 1s linear infinite' 
                                        }} />
                                    ) : (
                                        <LogOut size={18} />
                                    )}
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                {/* Conditionally render dashboard content or outlet content */}
                {isNestedRoute ? <Outlet /> : <DashboardContent />}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default User_dash;