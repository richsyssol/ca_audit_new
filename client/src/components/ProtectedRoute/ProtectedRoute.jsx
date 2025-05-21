import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    children || <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location.pathname }} replace />
  );
};

export default ProtectedRoute;
