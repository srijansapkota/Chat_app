import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { usePasswordToggle } from "./usePasswordToggle";
import type { LoginFormData } from "../types";

export const useLoginPage = () => {
  const { showPassword, toggleShowPassword } = usePasswordToggle();
  const { login, isLoggingIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return {
    errors,
    showPassword,
    toggleShowPassword,
    register,
    handleSubmit,
    isLoggingIn,
    onSubmit,
  };
};
