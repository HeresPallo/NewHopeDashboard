import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/campaigns")
      .then((response) => setCampaigns(response.data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
    
      <button onClick={() => navigate("/fundraiser")} className="text-blue-500 hover:underline mb-4">
        ← Back
      </button>
      <h2 className="text-3xl font-semibold text-center text-gray-800">Active Fundraising Campaigns</h2>
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
            {campaign.thumbnail && (
  <img 
    src={campaign.thumbnail.startsWith("http") ? campaign.thumbnail : `http://localhost:5001/${campaign.thumbnail}`} 
    alt={campaign.name} 
    className="w-full h-60 object-cover rounded-lg mb-4" 
  />
)}

              <h3 className="text-xl font-semibold text-gray-900">{campaign.name}</h3>
              <p className="text-gray-700 mt-2">{campaign.details}</p>
              <p className="text-gray-600 mt-2"><strong>Category:</strong> {campaign.category}</p>
              <p className="text-gray-600 mt-2">
                <strong>Start:</strong> {formatDate(campaign.start_date)} | <strong>End:</strong> {formatDate(campaign.end_date)}
              </p>
              <p className="text-gray-800 font-semibold mt-2">Target: ${campaign.target_amount}</p>
              <button
                onClick={() => navigate(`/campaign/${campaign.id}`)}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No active campaigns available.</p>
      )}
    </div>
  );
};

export default ViewCampaigns;
