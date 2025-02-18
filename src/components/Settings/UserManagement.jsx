import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

const UserManagementDashboard = () => {
  const navigate = useNavigate();

  // State for admin user creation form
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // State for mobile users
  const [mobileUsers, setMobileUsers] = useState([]);
  const [loadingMobileUsers, setLoadingMobileUsers] = useState(true);

  // Fetch mobile users on component mount
  useEffect(() => {
    fetchMobileUsers();
  }, []);

  const fetchMobileUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mobileusers`);
      setMobileUsers(response.data);
    } catch (error) {
      console.error("Error fetching mobile users:", error);
      alert("Failed to fetch mobile users.");
    } finally {
      setLoadingMobileUsers(false);
    }
  };

  // Handle admin user creation
  const handleCreateAdmin = async () => {
    if (!adminName || !adminEmail || !adminPassword) {
      alert("Please fill in all fields to create an admin user.");
      return;
    }
    setCreatingAdmin(true);
    try {
      // Create a new admin user. We assume your backend creates an admin
      // when you set the role to "admin".
      const response = await axios.post(`${API_BASE_URL}/users`, {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      alert("Admin user created successfully!");
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
    } catch (error) {
      console.error("Error creating admin user:", error.response?.data || error);
      alert("Failed to create admin user.");
    } finally {
      setCreatingAdmin(false);
    }
  };

  // Handle deletion of a mobile user
  const handleDeleteMobileUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this mobile user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/mobileusers/${userId}`);
      alert("Mobile user deleted successfully!");
      fetchMobileUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting mobile user:", error.response?.data || error);
      alert("Failed to delete mobile user.");
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">User Management Dashboard</h2>

      {/* Section: Create Admin User */}
      <div className="mb-8 p-6 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Create Admin User</h3>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          onClick={handleCreateAdmin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={creatingAdmin}
        >
          {creatingAdmin ? "Creating..." : "Create Admin User"}
        </button>
      </div>

      {/* Section: Manage Mobile Users */}
      <div className="p-6 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Mobile Users</h3>
        {loadingMobileUsers ? (
          <p>Loading mobile users...</p>
        ) : mobileUsers.length === 0 ? (
          <p>No mobile users found.</p>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone Number</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mobileUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.phone_number}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleDeleteMobileUser(user.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagementDashboard;
