// src/components/LoadingOverlay.js
import React from 'react';
import LoadingGIF from '../../assets/LoadingGIF.gif'; // Import your GIF

const LoadingOverlay = ({ message = "Processing..." }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor:'transparent',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '300px'
      }}>
        <img 
          src={LoadingGIF} 
          alt="Loading..." 
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain'
          }} 
        />
        {/* <h3 style={{
          margin: 0,
          fontSize: '1.2rem',
          color: 'white',
        }}>{message}</h3> */}
      </div>
    </div>
  );
};

export default LoadingOverlay;