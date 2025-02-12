import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateSurvey = () => {
    const navigate = useNavigate();
    const [surveyTitle, setSurveyTitle] = useState("");
    const [description, setDescription] = useState(""); // ✅ Match with backend
    const [questions, setQuestions] = useState([""]); // Start with one empty question

    // ✅ Handle Question Addition
    const addQuestion = () => {
        setQuestions([...questions, ""]);
    };

    // ✅ Handle Question Change
    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = value;
        setQuestions(updatedQuestions);
    };

    // ✅ Handle Survey Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!surveyTitle.trim() || !description.trim() || questions.some(q => !q.trim())) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        try {
            await axios.post("http://localhost:5001/surveys", { title: surveyTitle, description, questions });
            alert("Survey created successfully!");
            navigate("/contactsdashboard");
        } catch (error) {
            console.error("Error creating survey:", error);
            alert("Failed to create survey.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-md mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Survey</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Survey Title */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Survey Title</label>
                    <input
                        type="text"
                        placeholder="Enter survey title"
                        value={surveyTitle}
                        onChange={(e) => setSurveyTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>

                {/* ✅ Fixed Survey Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Survey Description</label>
                    <input
                        type="text"
                        placeholder="Enter survey description"
                        value={description} // ✅ Now matches backend
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                </div>

                {/* Dynamic Questions Section */}
                {questions.map((question, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder={`Question ${index + 1}`}
                            value={question}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                        {index === questions.length - 1 && (
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                >
                    Create Survey
                </button>
            </form>
        </div>
    );
};

export default CreateSurvey;
