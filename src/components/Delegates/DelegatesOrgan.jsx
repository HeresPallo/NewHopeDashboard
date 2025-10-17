import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://new-hope-8796c77630ff.herokuapp.com";

const DelegatesOrgan = () => {
  const navigate = useNavigate();
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchOrgans = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/delegateorgans`, {
          params: { t: Date.now() }, // avoid caching
        });
        if (isMounted) {
          setOrgans(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching delegateorgans:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrgans();
    return () => (isMounted = false);
  }, []);

  const filtered = organs.filter((o) =>
    (o.organname || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Delegate Organs</h1>

      <input
        type="text"
        placeholder="Search organs…"
        className="p-3 mb-6 w-2/3 max-w-lg text-gray-700 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <button
        onClick={() => navigate("/adddelegate")}
        className="mb-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
      >
        ➕ Add Delegate
      </button>

      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
          {filtered.map((organ) => {
            const count = typeof organ.delegateamount === "number"
              ? organ.delegateamount
              : 0;
            // backend already formats last_engagement; fallback to raw date if present
            const last =
              organ.last_engagement ||
              (organ.last_engagement_raw
                ? new Date(organ.last_engagement_raw).toLocaleDateString()
                : null);

            return (
              <div
                key={organ.id ?? organ.organname}
                className="relative p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200"
              >
                <div className="absolute top-2 right-2 px-4 py-1 font-semibold bg-red-600 text-white text-sm rounded-full">
                  {count} Delegates
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">
                  {organ.organname}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  Last engaged: {last || "N/A"}
                </p>

                <button
                  onClick={() => navigate(`/delegateDetails/${encodeURIComponent(organ.organname)}`)}
                  className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DelegatesOrgan;
