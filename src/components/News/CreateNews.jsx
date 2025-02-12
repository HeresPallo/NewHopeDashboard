import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateNews = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
        status: "user", // Default status
        thumbnail: null,
    });

    const categories = ["Presidential Campaign", "Health", "Education", "Environment", "Elderly Care", "Labor", "Technology", "Political Support"];
    const statuses = ["admin", "user"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevState) => ({ ...prevState, thumbnail: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const user_id = localStorage.getItem("user_id"); // ✅ Ensure correct retrieval
        const token = localStorage.getItem("token");
    
        console.log("🔍 Debugging Frontend:");
        console.log("User ID:", user_id);
        console.log("Token:", token);
    
        if (!user_id || !token) {
            alert("User ID or token is missing. Please log in again.");
            return;
        }
    
        const data = new FormData();
        data.append("title", formData.title);
        data.append("content", formData.content);
        data.append("category", formData.category);
        data.append("status", formData.status);
        data.append("user_id", user_id); // ✅ Include user_id explicitly
        if (formData.thumbnail) {
            data.append("thumbnail", formData.thumbnail);
        }
        console.log("📤 FormData Sent:", Object.fromEntries(data.entries())); // Debugging
        

        try {
            await axios.post("http://192.168.1.120:5001/news", data, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // ✅ Include JWT token
                },
            });
            
    
            alert("News story created successfully!");
            navigate("/newsdashboard");
        } catch (error) {
            console.error("❌ Error creating news story:", error.response?.data || error.message);
            alert(`Failed to create news: ${error.response?.data?.error || "Unknown Error"}`);
        }
    };
    
    
    

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
            <div className="max-w-3xl w-full bg-gray-100 p-8">
                <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">Create News Story</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-semibold">Post Title</label>
                        <input 
                            type="text" 
                            name="title" 
                            onChange={handleChange} 
                            value={formData.title} 
                            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                            required 
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-gray-700 font-semibold">Post Content</label>
                        <textarea 
                            name="content" 
                            onChange={handleChange} 
                            value={formData.content} 
                            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                            required
                        ></textarea>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-gray-700 font-semibold">Category</label>
                        <select 
                            name="category" 
                            onChange={handleChange} 
                            value={formData.category} 
                            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Select a Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-gray-700 font-semibold">Status</label>
                        <select 
                            name="status" 
                            onChange={handleChange} 
                            value={formData.status} 
                            className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Upload Thumbnail */}
                    <div>
                        <label className="block text-gray-700 font-semibold">Upload Thumbnail</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="w-full p-2 border rounded-md focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:bg-red-100 file:text-red-600 hover:file:bg-red-200"
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-all"
                    >
                        Create News
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNews;
