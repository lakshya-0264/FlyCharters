import React from "react";

const FixedNav = ({ onLogoHover, onLogoLeave }) => {
  return (
    <div 
      className="fixed top-0 left-0 z-50 group"
      onMouseEnter={onLogoHover}
      onMouseLeave={onLogoLeave}
    >
      {/* Extended hover zone */}
      <div className="w-96 h-32 absolute top-0 left-0" />
      
      {/* Logo container */}
      <div className="relative p-8">
        <img 
          src="/Logo.png" 
          alt="Charter Jet Logo" 
          className="h-16 w-auto filter drop-shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:brightness-110 animate-fade-in"
        />
        
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1 text-white/60 text-sm">
            <span className="hidden group-hover:block animate-fade-in font-medium"></span>
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedNav;