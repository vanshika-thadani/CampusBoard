import axios from "axios"
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCarpool = () => {
    const [carpools, setCarpools] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAllCarpools = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/carpool`, { withCredentials: true });
            setCarpools(response.data);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCarpools();
    }, []);

    return { carpools, setCarpools, loading, getAllCarpools }
}