import { useState,useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const useUserResources = () => {
  const [resources, setResources] = useState({
    carpools: [],
    carrentals: [],
    lostnfound: [],
    projects: [],
  });


  const fetchResources = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/resources`, {
        withCredentials: true,
      });

      setResources(response.data);
    } catch (err) {
      console.error("❌ Error fetching user resources:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return { resources,  refetchResources: fetchResources };
};