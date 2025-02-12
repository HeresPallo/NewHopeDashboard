import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SurveyResponseForm = ({ survey }) => {
  const navigate = useNavigate();
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(Array(survey.questions.length).fill(""));

  // ✅ Handle Input Change for Answers
  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index] = value;
      return updatedAnswers;
    });
  };

  // ✅ Submit Response
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://localhost:5001/surveyresponses", {
        name,
        email,
        answers,
        survey_id: survey.id, // ✅ The ID of the selected survey
      });

      alert("Survey response submitted successfully!");
      navigate("/contactsdashboard");

    } catch (error) {
      console.error("❌ Error submitting survey response:", error);
      alert("Failed to submit survey response.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{survey.title}</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Input */}
        <label className="block text-gray-700">Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required 
        />

        {/* Email Input */}
        <label className="block text-gray-700">Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required 
        />

        {/* Survey Questions */}
        {survey.questions.map((question, index) => (
          <div key={index} className="mb-3">
            <label className="block text-gray-700">{question}</label>
            <input 
              type="text" 
              value={answers[index]} 
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="w-full p-2 border rounded"
              required 
            />
          </div>
        ))}

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default SurveyResponseForm;
``
