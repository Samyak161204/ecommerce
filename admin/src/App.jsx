import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency='₹';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const navigate = useNavigate();

  // Sync token with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem('authToken') || '');
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken('');
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token ? (
        <>
          <Navbar onLogout={handleLogout} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-grow mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="*" element={<Navigate to="/add" />} /> {/* Default to /add */}
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
};

export default App;