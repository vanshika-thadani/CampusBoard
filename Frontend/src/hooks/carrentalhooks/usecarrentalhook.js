import axios from "axios";
import { useEffect,useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCarRental = () => {
    const [carrental, setcarrental] = useState(null);
    const getallcarrentals = async() =>{
        try {
             const respone = await axios.get(`${BASE_URL}/api/carrental`, {withCredentials:true});
            setcarrental(respone.data);   
        } catch (error) {
            console.error(error.message);            
        }
        
    };
    useEffect(()=>{
            getallcarrentals();
        },[])
    return {getallcarrentals,carrental}
};