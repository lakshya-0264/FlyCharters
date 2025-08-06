// components/common/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontSize: '1.5rem' 
    }}>
      Loading...
    </div>
  );
}
