import React from 'react';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com"; // Production API URL

const AuthPage = ({ type }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use /register only if type is "register", otherwise use /login
            const endpoint = type === "register" ? "/register" : "/login";
            const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData);

            if (type === "login") {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user_id", response.data.user_id);
                window.location.href = "/overview"; // Force reload to ensure navigation
            } else {
                alert("Registration successful! You can now log in.");
                navigate("/login");
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Something went wrong. Please try again.");
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-red-500">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {type === "register" ? "Create an Account" : "Login"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === "register" && (
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input 
                              type="text" 
                              name="name" 
                              onChange={handleChange} 
                              className="w-full p-2 border rounded text-black" 
                              required 
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input 
                          type="email" 
                          name="email" 
                          onChange={handleChange} 
                          className="w-full p-2 border rounded text-black" 
                          required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input 
                          type="password" 
                          name="password" 
                          onChange={handleChange} 
                          className="w-full p-2 border rounded text-black" 
                          required 
                        />
                    </div>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
                        {type === "register" ? "Sign Up" : "Login"}
                    </button>
                </form>
                {/* Only show the link if we're in register mode.
                    In login mode, we remove the sign-up link. */}
                {type === "register" && (
                  <p className="text-center text-gray-600 mt-4">
                      Already have an account?{" "}
                      <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
                          Login
                      </button>
                  </p>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
