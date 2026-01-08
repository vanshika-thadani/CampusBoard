// src/hooks/lostnfound/useaddlnfhooks.js
import axios from "axios";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAddlostnfound = () => {
  const [lostnfounddata, setLostnfounddata] = useState(null);

  const createlostnfound = async (lostnfound, imagefile) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("itemName", lostnfound.itemName);
      formData.append("itemDescription", lostnfound.itemDescription);
      formData.append("itemStatus", lostnfound.itemStatus);

      // Append the file
      if (imagefile) {
        formData.append("choosefile", imagefile); // 🔁 Ensure matches backend field
      }

      const response = await axios.post(
        `${BASE_URL}/api/lostnfound`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setLostnfounddata(response.data);
    } catch (error) {
      console.error("Error adding lost & found item:", error.message);
    }
  };

  return { createlostnfound, lostnfounddata };
};