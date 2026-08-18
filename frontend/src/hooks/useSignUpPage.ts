import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { usePasswordToggle } from "./usePasswordToggle";
import type { SignupFormData } from "../types";

export const useSignUpPage = () => {
  const { showPassword, toggleShowPassword } = usePasswordToggle();
  const { signup, isSigningUp } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = (data: SignupFormData) => {
    signup(data);
  };

  return {
    errors,
    showPassword,
    toggleShowPassword,
    register,
    handleSubmit,
    isSigningUp,
    onSubmit,
  };
};
