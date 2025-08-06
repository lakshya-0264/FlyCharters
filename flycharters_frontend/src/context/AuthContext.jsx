import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, logout as logoutApi } from "../api/authAPI";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const fetchUser = async (shouldRedirect = false) => {
    try {
      const res = await getCurrentUser();
      const currentUser = res.data.user;

      setUser(currentUser);

      if (shouldRedirect) {
        const pathname = window.location.pathname;

        if (currentUser.role === "admin" && !pathname.startsWith("/admin")) {
          navigate("/admin");
        } else if (currentUser.role === "operator" && !pathname.startsWith("/operator")) {
          navigate("/operator");
        } else if (currentUser.role === "user" && !pathname.startsWith("/user")) {
          navigate("/user");
        }
      }

    } catch (err) {
      console.warn("Not logged in or session expired");
      setUser(null);
      navigate("/"); 
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUser(true);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchUser(false);
    }, 5 * 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
