import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export  const uselostnfound = ()=>{
    const [lostAndFound, setlostAndFound] = useState(null);
    const getallLostnfound = async() =>{
        try {
            const response = await axios.get(`${BASE_URL}/api/lostnfound`, { withCredentials: true });
            setlostAndFound(response.data);
            
            
        } catch (error) {
            console.error("lostnfound hook error ");
        }
    }
    useEffect(()=>{
        getallLostnfound();
    },[])

    return{getallLostnfound,lostAndFound}
}