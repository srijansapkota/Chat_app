import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import type { SignupFormData } from "../types";

export const useSignUpPage = () => {
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
    register,
    handleSubmit,
    isSigningUp,
    onSubmit,
  };
};
