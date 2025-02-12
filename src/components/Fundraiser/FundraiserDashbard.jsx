import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const FundraiserDashboard = () => {
    const navigate = useNavigate();
    const [wallet, setWallet] = useState(0);
    const [currency, setCurrency] = useState("SLL");

    // Fetch wallet balance
    useEffect(() => {
        axios.get("http://localhost:5001/wallet")
            .then(response => setWallet(response.data.balance))
            .catch(error => console.error("Error fetching wallet balance:", error));
    }, [currency]);

    // Currency conversion rates
    const conversionRates = {
        "SLL": 1,
        "USD": 0.00005,
        "EUR": 0.00004,
    };

    const convertCurrency = () => {
        const currencies = ["SLL", "USD", "EUR"];
        const nextIndex = (currencies.indexOf(currency) + 1) % currencies.length;
        setCurrency(currencies[nextIndex]);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-white px-10 py-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Fundraiser Dashboard</h2>
                <button
                    onClick={() => navigate("/fundraiser/createcampaign")}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all"
                >
                    Create Campaign
                </button>
            </div>

            {/* Wallet Section */}
            <div className="w-full bg-gray-100 p-6 rounded-md border border-gray-200 mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Total Funds</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {(wallet * conversionRates[currency]).toLocaleString()} {currency}
                    </p>
                </div>
                <button
                    onClick={convertCurrency}
                    className="px-5 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-all"
                >
                    Change Currency
                </button>
            </div>

            {/* Quick Navigation Sections */}
            <div className="grid grid-cols-3 gap-6">
                {/* View Campaigns */}
                <div
                    className="p-6 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate("/fundraiser/viewcampaigns")}
                >
                    <h3 className="text-lg font-semibold text-gray-900">View Campaigns</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage all campaigns in progress.</p>
                </div>

                {/* Donors */}
                <div
                    className="p-6 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate("/donors")}
                >
                    <h3 className="text-lg font-semibold text-gray-900">Donors</h3>
                    <p className="text-sm text-gray-600 mt-1">View all donors who contributed.</p>
                </div>

                {/* Platforms */}
                <div
                    className="p-6 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate("/platforms")}
                >
                    <h3 className="text-lg font-semibold text-gray-900">Platforms</h3>
                    <p className="text-sm text-gray-600 mt-1">Check which platforms received funds.</p>
                </div>

                {/* Locations */}
                <div
                    className="p-6 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate("/locations")}
                >
                    <h3 className="text-lg font-semibold text-gray-900">Donation Locations</h3>
                    <p className="text-sm text-gray-600 mt-1">Track where donations came from.</p>
                </div>

                {/* Transactions */}
                <div
                    className="p-6 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate("/transactions")}
                >
                    <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
                    <p className="text-sm text-gray-600 mt-1">View the latest donation transactions.</p>
                </div>

                {/* Reports */}
                <div
                    className="p-6 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => navigate("/reports")}
                >
                    <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
                    <p className="text-sm text-gray-600 mt-1">Generate reports on fundraiser progress.</p>
                </div>
            </div>
        </div>
    );
};

export default FundraiserDashboard;
