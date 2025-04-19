import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const DelegatesOrgan = () => {
  const navigate = useNavigate();
  const [organs, setOrgans] = useState([]);
  const [delegates, setDelegates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [organsRes, delegatesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/delegateorgans`),
          axios.get(`${API_BASE_URL}/delegates`)
        ]);
        setOrgans(organsRes.data);
        setDelegates(delegatesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const filteredResults = organs
    .map(organ => {
      // all delegates for this organ
      const organDelegates = delegates.filter(d => d.organname === organ.organname);
      const engagedCount = organDelegates.filter(d => d.engaged).length;
      // find most recent last_engaged date
      const lastDates = organDelegates
        .map(d => d.last_engaged)
        .filter(d => d)
        .sort((a, b) => new Date(b) - new Date(a));
      return {
        ...organ,
        delegates: organDelegates,
        delegateCount: organ.delegateamount,
        engagedCount,
        lastEngagement: lastDates[0] || null,
      };
    })
    .filter(item =>
      item.organname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.delegates.some(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.constituency.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Delegate Organs</h1>

      <input
        type="text"
        placeholder="Search delegates, organs, or constituencies..."
        className="p-3 mb-6 w-2/3 max-w-lg text-gray-700 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <button
        onClick={() => navigate("/adddelegate")}
        className="mb-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
      >
        ➕ Add Delegate
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
        {filteredResults.map(organ => (
          <div
            key={organ.id}
            className="relative p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200"
          >
            <div className="absolute top-2 right-2 px-4 py-1 font-semibold bg-red-600 text-white text-sm rounded-full">
              {organ.delegateCount} Delegates
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">
              {organ.organname}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              Engaged: {organ.engagedCount} / {organ.delegateCount}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Last engaged: {organ.lastEngagement ? new Date(organ.lastEngagement).toLocaleDateString() : 'N/A'}
            </p>

            <button
              onClick={() => navigate(`/delegateDetails/${organ.organname}`)}
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DelegatesOrgan;
