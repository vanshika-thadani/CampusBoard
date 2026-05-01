import axios from "axios";
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCarRental = () => {
    const [carrental, setcarrental] = useState(null);
    const [loading, setLoading] = useState(true);

    const getallcarrentals = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/carrental`, { withCredentials: true });
            setcarrental(response.data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getallcarrentals();
    }, []);

    return { getallcarrentals, carrental, loading };
};