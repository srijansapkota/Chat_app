import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginFormData } from "../types";

export const useLoginPage = () => {
 
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
    register,
    handleSubmit,
    isLoggingIn,
    onSubmit,
  };
};
