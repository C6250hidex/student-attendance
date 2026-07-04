import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try-catch ensures that if localStorage is corrupted, the app doesn't crash
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const navigate = useNavigate();

  const login = (userData) => {
    // Check if userData contains what we expect
    if (!userData.user || !userData.token) {
      console.error("Invalid login data received");
      return;
    }

    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token);
    setUser(userData.user);

    // Logic: Navigate based on role for a better experience
    if (userData.user.role === "student") {
      navigate("/my-id");
    } else {
      navigate("/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  // Optional: Add a listener to logout user if token expires (401 error)
  // We will handle this in the API interceptor, but keeping the logout function clean here is good.

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
