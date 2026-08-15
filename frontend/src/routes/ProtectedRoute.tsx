import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = () => {
  const authUser = useAuthStore((state) => state.authUser);
  return authUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
