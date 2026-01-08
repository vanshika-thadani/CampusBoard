import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../ReduxFeatures/auth/auth.slice';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGoogleLoginHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      // ✅ Use the correctly named jwtDecode function
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await axios.post(`${BASE_URL}/api/auth/google`, {
        email: decoded.email,
        username: decoded.name,
        profilePhoto: decoded.picture,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        dispatch(loginSuccess(response.data));
        navigate('/discussion');
      }
    } catch (error) {
      console.error("Google login error:", error.response?.data || error.message);
      alert("Google login failed");
    }
  };

  return { handleGoogleLoginSuccess };
};