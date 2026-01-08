import axios from "axios";
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetUser = () => {
  const [user, setUser] = useState(null);
  

  const getUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user`, {
        withCredentials: true,
      });
      setUser(res.data);

    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return { user, getUserProfile };
};