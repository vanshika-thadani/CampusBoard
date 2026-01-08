// src/hooks/projectshooks/useaddprojects.js
import axios from "axios";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useaddprojects = () => {
  const [projectdata, setprojectdata] = useState(null);

  const createproject = async (project) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/projects`, project, {
        withCredentials: true,
      });
      setprojectdata(res.data);
    } catch (error) {
      console.error("Error creating project:", error.message);
    }
  };

  return { createproject, projectdata };
};