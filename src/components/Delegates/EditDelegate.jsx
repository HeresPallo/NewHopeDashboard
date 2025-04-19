import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft } from "react-icons/fi";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

// Validation schema including new fields
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  phonenumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  constituency: z.string().min(1, "Constituency is required"),
  supportstatus: z.enum(["supports", "opposes", "neutral"]),
  organname: z.string().min(1, "Please select an organ"),
  profilepic: z.any().optional(),
  engaged: z.boolean().optional(),
  last_engaged: z.string().optional(),
});

export default function EditDelegate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organs, setOrgans] = useState([]);
  const [preview, setPreview] = useState(null);
  const [picture, setPicture] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  // Fetch delegate data
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/delegates/${id}`)
      .then(({ data }) => {
        reset({
          name: data.name,
          role: data.role,
          phonenumber: data.phonenumber,
          email: data.email,
          address: data.address,
          constituency: data.constituency,
          supportstatus: data.supportstatus,
          organname: data.organname,
          engaged: data.engaged,
          last_engaged: data.last_engaged
            ? data.last_engaged.split("T")[0]
            : undefined,
        });
        if (data.profilepic) setPreview(data.profilepic);
      })
      .catch((err) => console.error("Error fetching delegate:", err));
  }, [id, reset]);

  // Fetch available organs
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/delegateorgans`)
      .then((res) => setOrgans(res.data))
      .catch((err) => console.error("Error fetching organs:", err));
  }, []);

  // Handle profile pic selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      alert("Only JPEG/PNG images allowed");
      return;
    }
    setPicture(file);
    setValue("profilepic", file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit handler
  const onSubmit = async (formData) => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== "organ_id") {
        data.append(key, val);
      }
    });
    // find organ_id
    const organ = organs.find((o) => o.organname === formData.organname);
    data.append("organ_id", organ ? organ.id : "");
    if (picture) data.append("profilepic", picture);

    try {
      await axios.patch(
        `${API_BASE_URL}/delegates/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Delegate updated successfully!");
      navigate("/delegateorgans");
    } catch (err) {
      console.error("Error updating delegate:", err);
      alert(err.response?.data?.error || "Update failed.");
    }
  };

  // **Delete handler**
  const handleDeleteDelegate = async () => {
    if (!window.confirm("Are you sure you want to delete this delegate?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/delegates/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Delegate deleted successfully!");
      navigate("/delegateorgans");
    } catch (error) {
      console.error("❌ Error deleting delegate:", error);
      alert(error.response?.data?.error || "Failed to delete delegate.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded mt-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-red-500 mb-6"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>

      <h2 className="text-3xl font-semibold mb-6">Edit Delegate</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-3 border rounded-lg mt-1"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700">Role</label>
          <input
            type="text"
            {...register("role")}
            className="w-full p-3 border rounded-lg mt-1"
          />
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            {...register("phonenumber")}
            className="w-full p-3 border rounded-lg mt-1"
          />
          {errors.phonenumber && (
            <p className="text-red-500 text-sm">
              {errors.phonenumber.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-3 border rounded-lg mt-1"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            {...register("address")}
            className="w-full p-3 border rounded-lg mt-1"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Constituency */}
        <div>
          <label className="block text-gray-700">Constituency</label>
          <input
            type="text"
            {...register("constituency")}
            className="w-full p-3 border rounded-lg mt-1"
          />
          {errors.constituency && (
            <p className="text-red-500 text-sm">
              {errors.constituency.message}
            </p>
          )}
        </div>

        {/* Organ */}
        <div>
          <label className="block text-gray-700">Organ Name</label>
          <select
            {...register("organname")}
            className="w-full p-3 border rounded-lg mt-1"
          >
            <option value="">Select an Organ</option>
            {organs.map((o) => (
              <option key={o.id} value={o.organname}>
                {o.organname}
              </option>
            ))}
          </select>
          {errors.organname && (
            <p className="text-red-500 text-sm">
              {errors.organname.message}
            </p>
          )}
        </div>

        {/* Support Status */}
        <div>
          <label className="block text-gray-700">Support Status</label>
          <select
            {...register("supportstatus")}
            className="w-full p-3 border rounded-lg mt-1"
          >
            <option value="supports">Supports</option>
            <option value="opposes">Opposes</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        {/* Engaged Checkbox */}
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            {...register("engaged")}
            id="engaged"
            className="mr-2"
          />
          <label htmlFor="engaged" className="text-gray-700">
            Engaged
          </label>
        </div>

        {/* Last Engaged Date */}
        <div>
          <label className="block text-gray-700">Last Engaged Date</label>
          <input
            type="date"
            {...register("last_engaged")}
            className="w-full p-3 border rounded-lg mt-1"
          />
        </div>

        {/* Profile Pic Upload */}
        <div>
          <label className="block text-gray-700">
            Profile Picture (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md mt-1"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 rounded-full mt-4"
            />
          )}
        </div>

        {/* Save Button */}
        <div className="col-span-2 flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Save Changes
          </button>
        </div>

        {/* Delete Button */}
        <div className="col-span-2 flex justify-start mt-6">
          <button
            type="button"
            onClick={handleDeleteDelegate}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Delete Delegate
          </button>
        </div>
      </form>
    </div>
  );
}
