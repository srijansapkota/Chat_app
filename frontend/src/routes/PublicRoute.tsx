import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PublicRoute = () => {
  const authUser = useAuthStore((state) => state.authUser);
  return authUser ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
