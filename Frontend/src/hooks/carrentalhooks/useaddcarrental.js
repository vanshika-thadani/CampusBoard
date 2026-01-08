import axios from "axios";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAddcarrental = () => {
  const [carrentaldata, setCarrentaldata] = useState([]);
  

  const createcarrental = async (carrental, imagefile) => {
    try {
      const formdata = new FormData();

      formdata.append("VechicleModel", carrental.VechicleModel);
      formdata.append("RentalAmount", carrental.RentalAmount);
      formdata.append("RentalPeriod", carrental.RentalPeriod);
      formdata.append("VechileMileage", carrental.VechileMileage);
      formdata.append("VechicleDescription", carrental.VechicleDescription);
      formdata.append("Available", carrental.Available); // boolean preserved
      if (imagefile) {
        formdata.append("Choosefile", imagefile); 
      }
      const response = await axios.post(
        `${BASE_URL}/api/carrental`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setCarrentaldata(response.data);
    } catch (error) {
      console.error("Error adding car rental:", error.message);
      
    }
  };

  return { createcarrental, carrentaldata  };
};