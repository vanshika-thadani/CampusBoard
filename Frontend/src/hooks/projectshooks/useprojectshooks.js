import axios from "axios";
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useprojects = () => {
  const [projects, setprojects] = useState(null);
  const [loading, setLoading] = useState(true);

  const getallprojects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/projects`, {
        withCredentials: true,
      });
      setprojects(res.data.projects);
    } catch (error) {
      console.error("API fetching error in projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getallprojects();
  }, []);

  return { projects, setprojects, loading, getallprojects };
};