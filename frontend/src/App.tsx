import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;
