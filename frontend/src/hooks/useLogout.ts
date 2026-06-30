import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Shared logout: clears auth (calls /logout) then redirects to login.
export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return async () => {
    await logout();
    navigate("/login");
  };
}
