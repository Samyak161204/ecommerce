import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { backendUrl, navigate, sendOtp } = useContext(ShopContext);
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { token } = useParams();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      await sendOtp(email);
      setOtpSent(true);
    } catch (error) {
      console.log(error);
      toast.error("Error sending OTP");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, { token, otp, newPassword });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message || "Some unexpected error occured");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error resetting password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Reset Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email Address'
        required
      />
      {otpSent && (
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Enter OTP'
          required
        />
      )}
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='New Password'
        required
      />
      {!otpSent ? (
        <button
          type="button"
          onClick={handleSendOtp}
          className='bg-gray-600 text-white font-light px-8 py-2 mt-4'
        >
          Send OTP
        </button>
      ) : (
        <button
          type="submit"
          className='bg-black text-white font-light px-8 py-2 mt-4'
        >
          Reset Password
        </button>
      )}
    </form>
  );
};

export default ResetPassword;