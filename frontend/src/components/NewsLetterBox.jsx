import React, { useState } from "react";
import axios from "axios";


const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const NewsLetterBox = () => {
    const [email, setEmail] = useState("");
  
    const onSubmitHandler = async (event) => {
      event.preventDefault();
  
      try {
        const response = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { email });
        setEmail(""); // Clear input box
        alert(response.data.message); // Show success or error message
      } catch (error) {
        alert(error.response?.data?.message || "There was an error subscribing. Please try again.");
      }
    };  

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">Subscribe now & get 20% OFF</p>
      <p className="text-gray-400 mt-3">
        Join the Parvaz family today and unlock exclusive designer deals, style tips, and your instant 20% discount – straight to your inbox!
      </p>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3">
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-black text-white text-xs px-10 py-4">
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
