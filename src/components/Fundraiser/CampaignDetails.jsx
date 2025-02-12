import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5001/campaigns/${id}`)
      .then(response => {
        setCampaign(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching campaign details:", error);
        setErrorMessage("Campaign not found.");
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5001/campaigns/${id}`);
      alert("Campaign deleted successfully!");
      navigate("/fundraiser/viewcampaigns");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Failed to delete campaign.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading campaign details...</p>;
  if (errorMessage) return <p className="text-center text-red-500">{errorMessage}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline mb-4">
        ← Back
      </button>
      {campaign.thumbnail && (
  <img 
    src={campaign.thumbnail.startsWith("http") ? campaign.thumbnail : `http://localhost:5001/${campaign.thumbnail}`} 
    alt={campaign.name} 
    className="w-full h-60 object-cover rounded-lg mb-4" 
  />
)}

      <h2 className="text-3xl font-semibold text-gray-800">{campaign.name}</h2>
      <p className="text-gray-600 mt-2"><strong>Category:</strong> {campaign.category}</p>
      <p className="text-gray-600 mt-2"><strong>Target Amount:</strong> ${campaign.target_amount.toLocaleString()}</p>
      <p className="text-gray-600 mt-2"><strong>Start:</strong> {new Date(campaign.start_date).toLocaleDateString("en-GB")} | <strong>End:</strong> {new Date(campaign.end_date).toLocaleDateString("en-GB")}</p>
      <p className="text-gray-700 mt-4">{campaign.details}</p>
      
      <div className="flex justify-between mt-6">
        <button onClick={() => navigate(`/editcampaign/${campaign.id}`)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
      </div>
    </div>
  );
};

export default CampaignDetails;