import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://new-hope-8796c77630ff.herokuapp.com"; // Production API URL

export default function UserManagementDashboard() {
  const navigate = useNavigate();

  // State for admin user creation form
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState("admin_viewer");
  const [adminPassword, setAdminPassword] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // State for mobile users
  const [mobileUsers, setMobileUsers] = useState([]);
  const [loadingMobileUsers, setLoadingMobileUsers] = useState(true);

  // State for "Change Your Password" section
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

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

  const handleCreateAdmin = async () => {
    if (!adminName || !adminEmail || !adminPassword) {
      alert("Please fill in all fields to create an admin user.");
      return;
    }
    setCreatingAdmin(true);
    try {
      await axios.post(`${API_BASE_URL}/register`, {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: adminRole, // 👈 added role here
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

  const handleDeleteMobileUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this mobile user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/mobileusers/${userId}`);
      alert("Mobile user deleted successfully!");
      fetchMobileUsers();
    } catch (error) {
      console.error("Error deleting mobile user:", error.response?.data || error);
      alert("Failed to delete mobile user.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || newPwd !== confirmPwd) {
      alert("Please fill in all fields, and make sure new passwords match.");
      return;
    }
    setChangingPwd(true);
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to change your password.");
      setChangingPwd(false);
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/change-password`,
        { currentPassword: currentPwd, newPassword: newPwd },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password changed successfully!");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to change password.");
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="flex flex-col p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">User Management Dashboard</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Create Admin User */}
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
  <label className="block mb-1">Role</label>
  <select
    value={adminRole}
    onChange={(e) => setAdminRole(e.target.value)}
    className="w-full p-2 border rounded"
  >
    <option value="superuser">Superuser</option>
    <option value="admin_viewer">Admin Viewer</option> 
  </select>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          disabled={creatingAdmin}
        >
          {creatingAdmin ? "Creating..." : "Create Admin User"}
        </button>
      </div>

      {/* Change Your Password */}
      <div className="mb-8 p-6 border rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Change Your Password</h3>
        <div className="mb-4">
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          disabled={changingPwd}
        >
          {changingPwd ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Manage Mobile Users */}
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
}
