import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  return isAuthenticated ? (
    <Navigate to={location.state?.from || "/dashboard"} replace />
  ) : (
    children
  );
};

export default AuthRedirect;
