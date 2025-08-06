import React from "react";
import { Home, LogIn, Plane, Users, User, Book, Contact ,Crown, Globe} from "lucide-react";
import PropTypes from 'prop-types';
import { useAuthPopup } from '../../context/AuthPopupContext';

const SideNav = ({ isOpen, onClose }) => {
  const { setShowAuthPopup } = useAuthPopup();

  const handleNavigation = (sectionId = '') => {
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClose(); // This will close the side nav after any click
  };

  const menuItems = [
    { 
      icon: Home, 
      label: "Home", 
      action: () => window.location = "/"
    },
    { 
      icon: LogIn, 
      label: "Login/Signup", 
      action: () => {
        setShowAuthPopup(true);
        onClose();
      }
    },
    { 
      icon: Users, 
      label: "Our Services", 
      action: () => handleNavigation('services') 
    },
    { 
      icon: Book, 
      label: "About Us", 
      action: () => handleNavigation('about') 
    },
    { 
      icon: Globe, 
      label: "Our Audience", 
      action: () => handleNavigation('thridSection') 
    },
    { 
      icon: Crown, 
      label: "Privilege Club", 
      action: () => handleNavigation('privilegeClub') 
    },
    { 
      icon: Contact, 
      label: "Contact Us", 
      action: () => handleNavigation('contact') 
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      
      {/* Side Navigation */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: 'linear-gradient(to bottom, rgba(135, 206, 235, 0.01) 0%, rgba(70, 130, 180, 0.01) 50%, rgba(25, 25, 112, 0.01) 100%)',
          backdropFilter: 'blur(4px)'
        }}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10">
          <img 
            src="/Logo.png" 
            alt="Charter Jet Logo" 
            className="h-16 w-auto mb-4"
          />
          <h2 className="text-white text-xl font-semibold">Navigation</h2>
          <p className="text-white/60 text-sm">Explore our luxury services</p>
        </div>
        
        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center space-x-4 p-4 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2 animate-slide-in-right`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <item.icon size={20} className="text-blue-200" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            © 2024 Luxury Aviation. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

SideNav.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SideNav;