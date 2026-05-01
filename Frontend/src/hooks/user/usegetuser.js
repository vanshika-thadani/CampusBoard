import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/user`, {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUserProfile();
    }
  }, [isAuthenticated]);

  return { user, loading, getUserProfile };
};