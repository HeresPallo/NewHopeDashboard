import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DelegatesOrgan = () => {
    const navigate = useNavigate();
    const [organs, setOrgans] = useState([]);
    const [delegates, setDelegates] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchDelegateOrgans = async () => {
            try {
                const response = await axios.get("http://localhost:5001/delegateorgans");
                setOrgans(response.data);
            } catch (error) {
                console.error("Error fetching delegate organs:", error);
            }
        };

        const fetchDelegates = async () => {
            try {
                const response = await axios.get("http://localhost:5001/delegates");
                setDelegates(response.data);
            } catch (error) {
                console.error("Error fetching delegates:", error);
            }
        };

        fetchDelegateOrgans();
        fetchDelegates();
    }, []);

    // 🔍 Filter delegate names, organ names, and constituencies
    const filteredResults = organs
        .map(organ => ({
            ...organ,
            delegates: delegates.filter(delegate => delegate.organname === organ.organname)
        }))
        .filter(item =>
            item.organname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.delegates.some(delegate =>
                delegate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                delegate.constituency.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );

    return (
        <div className="flex flex-col items-center bg-white min-h-screen p-6">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Delegate Organs</h1>

            {/* 🔍 Search Bar */}
            <input
                type="text"
                placeholder="Search delegates, organs, or constituencies..."
                className="p-3 mb-6 w-2/3 max-w-lg text-gray-700 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* ➕ Add Delegate Button */}
            <button
                onClick={() => navigate("/adddelegate")}
                className="mb-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300"
            >
                ➕ Add Delegate
            </button>

            {/* 🔹 Display Filtered Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
                {filteredResults.map((organ) => (
                    <div 
                        key={organ.id} 
                        className="relative p-6 bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out border border-gray-200"
                    >
                        {/* Delegate count badge */}
                        <div className="absolute top-2 right-2 px-4 py-1 font-semibold bg-red-600 text-white text-sm rounded-full">
                            {organ.delegateamount} Delegates
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">{organ.organname}</h2>
                        
                        <p className="text-sm text-gray-500 mb-4">Last engagement: {organ.last_engagement}</p>

                        {/* View Details Button */}
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
