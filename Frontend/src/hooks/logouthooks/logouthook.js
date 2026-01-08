// src/hooks/auth/useLogout.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout as logoutAction} from "../../ReduxFeatures/auth/auth.slice";
import { persistor } from "../../reduxStorage/redux.store";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlelogout= async () => {
    try {
      await axios.post( `${BASE_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });

      dispatch(logoutAction()); 
      await persistor.purge();
      navigate("/login");        
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return handlelogout;
};