import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

function ProtectedRoute({ element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return element;
}

export default ProtectedRoute;
