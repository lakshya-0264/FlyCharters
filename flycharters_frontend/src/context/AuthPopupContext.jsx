import React, { createContext, useState, useContext } from 'react';

const AuthPopupContext = createContext();

export const AuthPopupProvider = ({ children }) => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  return (
    <AuthPopupContext.Provider value={{ showAuthPopup, setShowAuthPopup }}>
      {children}
    </AuthPopupContext.Provider>
  );
};

export const useAuthPopup = () => useContext(AuthPopupContext);
