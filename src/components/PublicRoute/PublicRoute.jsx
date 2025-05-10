import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token exists, allow access to public route
  if (!token) {
    return children;
  }

  try {
    // Verify token is valid
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return children;
    }

    // Token is valid, redirect to home page
    return <Navigate to="/" replace />;
    
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    
    // console.error("Token validation error:", error.message);
    
    // Invalid token format
    localStorage.removeItem("token");
    return children;
  }
}