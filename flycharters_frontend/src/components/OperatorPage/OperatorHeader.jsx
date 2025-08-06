import React, { useState, useEffect } from 'react';
import logoImg from '../../assets/Logo.png';
import '../../App.css';
import { NavLink } from 'react-router-dom';
import { FaAnglesLeft, FaCalculator } from "react-icons/fa6";
import { TbBuildingAirport } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { LuContact } from "react-icons/lu";
import { GoHome } from "react-icons/go";
import { BsInfoSquare } from "react-icons/bs";
import useOperatorStatus from "./useOperatorStatus.js";
import { logout } from '../../api/authAPI.js';
import NotificationIcon from '../../components/common/Notification.jsx';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const operatorId = localStorage.getItem("id");
  const { isVerified, loading } = useOperatorStatus(operatorId);
  const [lastMouseX, setLastMouseX] = useState(0);
  const userId = localStorage.getItem("id");

  const navigate = useNavigate();
  
  useEffect(() => {
    const storedName = localStorage.getItem("first_name");
    if (storedName) {
      setFirstName(storedName.toUpperCase());
    }
  }, []);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsScrolled(scrollTop > 50);
    setIsVisible(scrollTop < lastScrollTop || scrollTop < 10);
    setLastScrollTop(scrollTop);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMouseEnter = (e) => {
  const currentX = e.clientX;
  if (currentX <= lastMouseX) { 
    setIsHovered(true);
    setIsSidebarOpen(true);
  }
  setLastMouseX(currentX);
};


  // const handleMouseLeave = () => {
  //   setIsHovered(false);
  //   setIsSidebarOpen(false); // Close sidebar on mouse leave
  // };

  return (
    <>
      <header style={{backgroundColor:'white'}} className={`header ${isScrolled ? 'scrolled' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
        <a href="#home" className="logo">
          <img src={logoImg} alt="My Logo" className="logo-img" />
        </a>

        <nav className="nav-links">
          <NavLink to="/operator/" style={{color:'#333'}} className="nav-item">home</NavLink>
          <NavLink to="/operator/booking-status" style={{color:'#333'}} className="nav-item">Booking Status</NavLink>
          {/* <NavLink to="/operator/passenger-manifest" style={{color:'#333'}} className="nav-item">Passenger Manifest</NavLink> */}
          <NavLink to="/operator/history" style={{color:'#333'}} className="nav-item">History</NavLink>
        </nav>

        <div style={{display:'flex',gap:"10px",position:'relative'}}>
            <NotificationIcon userId={userId}/>
            <div 
              onClick={toggleSidebar} 
              onMouseEnter={handleMouseEnter}
              onMouseMove={(e) => setLastMouseX(e.clientX)}
              // onMouseLeave={handleMouseLeave}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
              }}
            >
              <FaAnglesLeft 
                className={isHovered ? 'leftArrowBlink hover' : 'leftArrowBlink'} 
                style={{ 
                  marginRight: "8px",
                  transition: 'all 0.3s ease'
                }} 
              />
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                textAlign:'center',
                justifyContent:'center',
                alignItems:'center',
                alignSelf:'end',
              }}>
                <button className="sideBar" style={{
                  fontSize:'14px',
                  lineHeight:'1', 
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}>
                  hi {firstName}!
                </button>
                {loading ? (
                  <span style={{ fontSize: '.7rem', color: 'gray', textTransform: 'capitalize' }}>Checking...</span>
                ) : isVerified ? (
                  <span style={{ fontSize: '.7rem', color: 'green', textTransform: 'capitalize' }}>Verified</span>
                ) : (
                  <span className={isHovered ? 'leftArrowBlink hover' : 'leftArrowBlink'} style={{ fontSize: '.7rem', color: 'red', textTransform: 'capitalize' }}>Not Verified</span>
                )}
              </div>
              <div className="profile-icon-operator" style={{ marginLeft: '10px' }}>
                <img style={{
                  maxWidth:'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                }} src='/manProfile.png' alt="Profile" />
              </div>
            </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>✕</button>
        {/* <NavLink to="/operator/profile" className="nav-item" onClick={toggleSidebar}><GoHome style={{fontSize:'1.5rem',marginRight:'1rem'}}/>Dashboard</NavLink> */}
        <NavLink to="/operator/contact-admin" className="nav-item" onClick={toggleSidebar}><LuContact style={{fontSize:'1.5rem',marginRight:'1rem'}}/>Contact Admin</NavLink>
        <NavLink to="/operator/Airport-restriction" className="nav-item" onClick={toggleSidebar}>< TbBuildingAirport style={{fontSize:'1.5rem',marginRight:'1rem',fontWeight:'900'}}/>Airport Restriction</NavLink>
        <NavLink to="/operator/Check-Quote" className="nav-item" onClick={toggleSidebar}><FaCalculator style={{fontSize:'1.5rem',marginRight:'1rem'}}/>Check Quote</NavLink>
        <button className="signin-btn" onClick={handleLogout}>Log out</button>
        <p>© {new Date().getFullYear()} Fly charters. All rights reserved.</p>
      </nav>
    </>
  );
};

export default Header;