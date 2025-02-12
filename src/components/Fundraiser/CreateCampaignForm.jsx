import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateCampaignForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    details: "",
    category: "",
    start_date: "",
    end_date: "",
    payment_methods: [],
    thumbnail: null,
  });

  const categories = ["Presidential Campaign", "Health", "Education", "Environment", "Elderly Care", "Labor", "Technology", "Political Support"];
  const paymentOptions = ["Apple Pay", "Orange Money", "PayPal", "Stripe", "Afrimoney", "Vult"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (method) => {
    setFormData((prev) => {
      return prev.payment_methods.includes(method)
        ? { ...prev, payment_methods: prev.payment_methods.filter((m) => m !== method) }
        : { ...prev, payment_methods: [...prev.payment_methods, method] };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, thumbnail: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "payment_methods") {
          data.append(key, JSON.stringify(value));
        } else if (key === "thumbnail" && value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, value);
        }
      });
      
      const response = await axios.post("http://localhost:5001/campaigns", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Campaign Created Successfully!");
      setTimeout(() => navigate("/fundraiser/viewcampaigns"), 1000);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting campaign:", error);
      alert("Failed to create campaign");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Create Fundraising Campaign</h2>
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700">Campaign Name</label>
        <input type="text" name="name" onChange={handleChange} value={formData.name} className="w-full p-2 border rounded mb-3" required />

        <label className="block text-gray-700">Target Amount ($)</label>
        <input type="number" name="target_amount" onChange={handleChange} value={formData.target_amount} className="w-full p-2 border rounded mb-3" required />

        <label className="block text-gray-700">Campaign Details</label>
        <textarea name="details" onChange={handleChange} value={formData.details} className="w-full p-2 border rounded mb-3" required></textarea>

        <label className="block text-gray-700">Category</label>
        <select name="category" onChange={handleChange} value={formData.category} className="w-full p-2 border rounded mb-3" required>
          <option value="">Select a Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="block text-gray-700">Start Date</label>
        <input type="date" name="start_date" onChange={handleChange} value={formData.start_date} className="w-full p-2 border rounded mb-3" required />
        
        <label className="block text-gray-700">End Date</label>
        <input type="date" name="end_date" onChange={handleChange} value={formData.end_date} className="w-full p-2 border rounded mb-3" required />

        <label className="block text-gray-700">Select Payment Methods</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {paymentOptions.map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.payment_methods.includes(method)} onChange={() => handleCheckboxChange(method)} />
              <span>{method}</span>
            </label>
          ))}
        </div>

        <label className="block text-gray-700">Upload Thumbnail</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded mb-3" />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">Create Campaign</button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;