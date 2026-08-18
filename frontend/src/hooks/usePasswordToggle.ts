import { useState } from "react";

export const usePasswordToggle = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  return { showPassword, toggleShowPassword };
};
