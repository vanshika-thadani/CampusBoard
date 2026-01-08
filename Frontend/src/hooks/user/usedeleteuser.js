// src/hooks/user/useDeleteUser.js
import axios from "axios";
import { logout as logoutAction } from "../../ReduxFeatures/auth/auth.slice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { persistor } from "../../reduxStorage/redux.store"; // ✅ Add this line




const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useDeleteUser = () => {
  const navigate = useNavigate();     
  const dispatch = useDispatch(); 

  const deleteUser = async () => {
    try {
      // 1. Delete the user from backend
      await axios.delete(`${BASE_URL}/api/user`, {
        withCredentials: true,
      });

      await persistor.purge();
      dispatch(logoutAction());
      
       
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (err) {
      console.error("❌ User deletion failed:", err.response?.data || err.message);
    }
  };

  return { deleteUser };
};

export default useDeleteUser;