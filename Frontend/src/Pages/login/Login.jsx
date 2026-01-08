import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../ReduxFeatures/auth/auth.slice';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginHandler } from '../../hooks/google/usegoogle';
import { toast } from 'react-toastify'; // ✅ Toastify import
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify CSS
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {

  const { handleGoogleLoginSuccess } = useGoogleLoginHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logindata, setlogindata] = useState({
    email: '',
    password: ''
  });

  const ChangeHandler = (e) => {
    const { name, value } = e.target;
    setlogindata(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const SubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(`${BASE_URL}/api/auth/login`,
        logindata,
        { withCredentials: true }
      )
      if (response.status === 200) {
        dispatch(loginSuccess(response.data));
        toast.success("Login successful! Redirecting...");
        navigate('/discussion');
      }

      setlogindata({
        email: '',
        password: ''
      });

    } catch (error) {
      console.error("Error response:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div id='Login'>
      <div className="Login-heading">
        <h1>Campus-Connect</h1>
        <h4>Your campus connected</h4>
      </div>

      <form onSubmit={SubmitHandler}>
        <h1>Login</h1>
        <h4>Enter your credentials to access your account</h4>
        <p>Email</p>
        <input
          type="text"
          placeholder='Email'
          name="email"
          value={logindata.email}
          onChange={ChangeHandler}
        />

        <p>Password</p>
        <input
          type="password"
          placeholder='Password'
          name="password"
          value={logindata.password}
          onChange={ChangeHandler}
        />
        <button type="submit">Login</button>
        <div className="google-login">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => console.log("Google login failed")}
          />
        </div>
        <div className="Login-bottom">
          <p>Don't have an account? <Link to="/signup" className="signup-link">Signup</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;