import React, { useState } from 'react'
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // ✅ Toastify import
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify CSS
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const Signup = () => {

  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev, [name]: value
    }));
  }

  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(`${BASE_URL}/api/auth/register`, 
        signupData,
        { withCredentials: true });

      if (response.status === 201) {
        toast.success("Signup successful! Redirecting...");
        setTimeout(() => navigate('/login'), 1500);//delay navigation to login because toast doesn't appear instantly also let user see success feedback
      }

      setSignupData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    }
    catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div id="signup">
      <div className="heading">
        <h2>Campus-Connect</h2>
        <h4>Join your campus community Today</h4>
      </div>
      <form onSubmit={submitHandler}>
        <h1>Signup</h1>
        <h4>Create a account to get started</h4>
        <p>Full Name</p>
        <input
          type="text"
          placeholder='Username'
          name='username'
          value={signupData.username}
          onChange={changeHandler}
        />
        <p>Email</p>
        <input
          type="email"
          placeholder='Email'
          name='email'
          value={signupData.email}
          onChange={changeHandler}
        />
        <p>Password</p>
        <input
          type="password"
          placeholder='Password'
          name='password'
          value={signupData.password}
          onChange={changeHandler}
        />
        <p>Confirm Password</p>
        <input
          type="password"
          placeholder='Confirm Password'
          name='confirmPassword'
          value={signupData.confirmPassword}
          onChange={changeHandler}
        />
        <button>Signup</button>
        <div className="Signup-bottom">
          <p>ALready have an account? <Link to="/login" className="signup-link">Login</Link></p>
        </div>
      </form>
      <h6>&copy; 2025 UniVerse. All rights reserved.</h6>
    </div>
  )
}

export default Signup;