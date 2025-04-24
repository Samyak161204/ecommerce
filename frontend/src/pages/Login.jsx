import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl, sendOtp, otpSent, setOtpSent } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        if (!otpSent || !otp) {
          toast.error("Please request and enter an OTP");
          return;
        }
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password, otp });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setOtpSent(false);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    await sendOtp(email);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    try {
      const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error sending reset link");
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email Address' required/>
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
      {currentState === 'Sign Up' && otpSent && (
        <input onChange={(e) => setOtp(e.target.value)} value={otp} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Enter OTP' required />
      )}
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p onClick={handleForgotPassword} className='cursor-pointer'>Forgot your password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
        ) : (
          <p onClick={() => { setCurrentState('Login'); setOtpSent(false); }} className='cursor-pointer'>Login Here</p>
        )}
      </div>
      {currentState === 'Sign Up' && !otpSent && (
        <button type="button" onClick={handleSendOtp} className='bg-gray-600 text-white font-light px-8 py-2 mt-4'>Send OTP</button>
      )}
      <button 
        type="submit" 
        className='bg-black text-white font-light px-8 py-2 mt-4' 
        disabled={currentState === 'Sign Up' && (!otpSent || !otp)}
      >
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;