/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token exists, redirect to sign in
  if (!token) {
    return <Navigate to="/signIn" replace />;
  }

  try {
    // Verify token is valid
    const decoded = jwtDecode(token);

    const isExpired = decoded.exp * 1000 < Date.now();


    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/signIn" replace />;
    }

    // Token is valid, render the protected component
    return children;

    
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    
    
    // Invalid token format
    localStorage.removeItem("token");
    return <Navigate to="/signIn" replace />;
  }
}

