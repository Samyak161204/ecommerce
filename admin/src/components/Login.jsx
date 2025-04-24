import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/admin`,
        { email, password },
        { timeout: 5000 }
      );

      if (response.data.success && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setToken(response.data.token);
        toast.success('Login Successful!');
        navigate('/add');
      } else {
        toast.error(response.data.message || 'Invalid email or password');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          toast.error('Request timed out. Please try again.');
        } else if (error.response?.status === 401) {
          toast.error('Unauthorized! Invalid email or password.');
        } else if (error.response?.status === 500) {
          toast.error('Server error. Try again later.');
        } else {
          toast.error('Network error. Check your connection.');
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#C586A5]"
            />
          </div>

          {/* Password Input */}
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-md w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-[#C586A5]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 w-full py-2 px-4 rounded-md text-white transition duration-200 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
