import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useAddCarpool = () => {
  const [carpoolData, setCarpoolData] = useState(null);

  const addCarpool = async (carpoolInfo) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/carpool`,
        carpoolInfo,
        { withCredentials: true } 
      );
      setCarpoolData(response.data);
    } catch (error) {
      console.error("AddCarpool Error:", error);
    }
  };

  return { addCarpool, carpoolData };
};