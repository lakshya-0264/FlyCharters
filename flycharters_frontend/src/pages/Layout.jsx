import React, { useState } from 'react';
import Header from '../components/LandingPage/Header.jsx';
import Footer from '../components/LandingPage/Footer.jsx';
import Services from '../components/LandingPage/Services.jsx';
import About from '../components/LandingPage/About.jsx';
import { Outlet } from 'react-router-dom';
import AuthForm from '../components/AuthForm.jsx';
import { useAuthPopup } from '../context/AuthPopupContext';
import OurFleet from '../components/LandingPage/Fleet.jsx';
import ContactUs from '../components/LandingPage/ContactUs.jsx';
import OTPModal from '../components/OTPModal.jsx';
import EchoPrivilege from '../components/LandingPage/EchoPrivilege.jsx';
import FixedNav from '../components/LandingPage/FixedNav.jsx';
import NewSection from '../components/LandingPage/SecondSection.jsx';
import ThirdSection from '../components/LandingPage/BeautifulStays.jsx';
import HomePage from './HomePage.jsx';

function Layout() {
  const { showAuthPopup, setShowAuthPopup } = useAuthPopup();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogoHover = () => {
    setIsSideNavOpen(true);
  };

  // const handleLogoLeave = () => {
  //   setTimeout(() => {
  //     const nav = document.querySelector('[data-nav="sidebar"]');
  //     if (!nav?.matches(':hover')) {
  //       setIsSideNavOpen(false);
  //     }
  //   }, 100);
  // };

  return (
    <>
      <FixedNav 
        onLogoHover={handleLogoHover}
        // onLogoLeave={handleLogoLeave}
      />
      <Header 
        isOpen={isSideNavOpen}
        onClose={() => setIsSideNavOpen(false)}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />
      <main>
        <section id="home">
          <HomePage />
        </section>
        
        <section id="newsection">
          <NewSection/>
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="thridSection">
          <ThirdSection/>
        </section>
        <section id="about">
          <About />
        </section>
        <section id="fleet">
          <OurFleet />
        </section>
        <section id="contact">
          <ContactUs />
        </section>
        <section id="privilegeClub">
          <EchoPrivilege/>
        </section>
        
      </main>
      
      <Footer />
      
      {/* Auth Popup */}
      {showAuthPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            setShowAuthPopup(false);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AuthForm setShowOtpModal={(state) => {
              setShowOtpModal(state);
            }} />
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
          }}
          onClick={() => setShowOtpModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <OTPModal
              isOpen={showOtpModal}
              onClose={() => setShowOtpModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Layout;