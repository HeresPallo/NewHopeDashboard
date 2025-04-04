// src/pages/Forms.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Forms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Forms</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Card 1: Confirmation Journal */}
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
             onClick={() => navigate("/forms/confirmation-journal")}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Confirmation Journal
          </h2>
          <p className="text-gray-600">
            Click here to fill the Confirmation Journal form.
          </p>
        </div>
        
        {/* Card 2: New Applicant Journal */}
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
             onClick={() => navigate("/forms/new-applicant-journal")}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            New Applicant Journal
          </h2>
          <p className="text-gray-600">
            Click here to fill the New Applicant Journal form.
          </p>
        </div>
        
        {/* Card 3: Registration Rejection Form (RRF) */}
        <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition cursor-pointer border"
             onClick={() => navigate("/forms/registration-rejection-form")}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Registration Rejection Form (RRF)
          </h2>
          <p className="text-gray-600">
            Click here to fill the RRF form.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forms;
