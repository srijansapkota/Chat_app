import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";

export const useLoginPage => () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data);
  };
  return {errors, showPassword, register, handleSubmit, setShowPassword, login, isLoggingIn, onSubmit}
}