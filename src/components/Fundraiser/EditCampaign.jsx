import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const paymentOptions = ["Apple Pay", "Orange Money", "PayPal", "Stripe", "Afrimoney", "Vult"];

  useEffect(() => {
    axios.get(`http://localhost:5001/campaigns/${id}`)
      .then(response => {
        const campaignData = response.data;
        let parsedPaymentMethods = [];
        
        if (typeof campaignData.payment_methods === "string") {
          parsedPaymentMethods = campaignData.payment_methods.replace(/[{}]/g, "").split(",").map(method => method.trim());
        }

        setCampaign(campaignData);
        setFormData({ 
          ...campaignData, 
          payment_methods: parsedPaymentMethods,
          thumbnail: campaignData.thumbnail || "" 
        });
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching campaign details:", error);
        setErrorMessage("Campaign not found.");
        setLoading(false);
      });
  }, [id]);

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
    if (file) {
      setFormData({ ...formData, thumbnail: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "payment_methods") {
          data.append(key, JSON.stringify(value)); // ✅ Convert to JSON before sending
        } else if (key === "thumbnail" && value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, value);
        }
      });
  
      await axios.patch(`http://localhost:5001/campaigns/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSuccessMessage("Campaign updated successfully!");
      setTimeout(() => navigate("/fundraiser/viewcampaigns"), 1000);
    } catch (error) {
      console.error("Error updating campaign:", error);
      setErrorMessage("Failed to update campaign.");
    }
  };
  

  if (loading) return <p className="text-center text-gray-500">Loading campaign details...</p>;
  if (errorMessage) return <p className="text-center text-red-500">{errorMessage}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-3xl font-semibold text-center text-gray-800">Edit Campaign</h2>
      <form onSubmit={handleSubmit} className="mt-6">
        <label className="block text-gray-700">Campaign Name</label>
        <input type="text" name="name" onChange={handleChange} value={formData.name} className="w-full p-2 border rounded mb-3" required />

        <label className="block text-gray-700">Target Amount ($)</label>
        <input type="number" name="target_amount" onChange={handleChange} value={formData.target_amount} className="w-full p-2 border rounded mb-3" required />

        <label className="block text-gray-700">Campaign Details</label>
        <textarea name="details" onChange={handleChange} value={formData.details} className="w-full p-2 border rounded mb-3" required></textarea>

        <label className="block text-gray-700">Upload Thumbnail (Optional)</label>
        <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded mb-3" />

        <label className="block text-gray-700">Update Payment Methods</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {paymentOptions.map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input type="checkbox" checked={formData.payment_methods.includes(method)} onChange={() => handleCheckboxChange(method)} />
              <span>{method}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
        </div>
      </form>
      {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
    </div>
  );
};

export default EditCampaign;