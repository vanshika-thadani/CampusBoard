import axios from "axios";
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uselostnfound = () => {
    const [lostAndFound, setlostAndFound] = useState(null);
    const [loading, setLoading] = useState(true);

    const getallLostnfound = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/lostnfound`, { withCredentials: true });
            setlostAndFound(response.data);
        } catch (error) {
            console.error("lostnfound hook error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getallLostnfound();
    }, []);

    return { getallLostnfound, lostAndFound, loading };
}