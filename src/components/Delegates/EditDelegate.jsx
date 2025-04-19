import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft } from "react-icons/fi";

const API_BASE_URL = "https://new-hope-e46616a5d911.herokuapp.com";

export default function EditDelegate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organs, setOrgans] = useState([]);
  const [preview, setPreview] = useState(null);
  const [picture, setPicture] = useState(null);

  const schema = z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    phonenumber: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
    constituency: z.string().min(1),
    supportstatus: z.enum(["supports","opposes","neutral"]),
    organname: z.string().min(1),
    profilepic: z.any().optional(),
    engaged: z.boolean().optional(),
    last_engaged: z.string().optional()
  });

  const {
    register, handleSubmit, setValue,
    reset, formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit"
  });

  // Fetch delegate
  useEffect(() => {
    axios.get(`${API_BASE_URL}/delegates/${id}`)
      .then(({ data }) => {
        // populate form fields
        reset({
          ...data,
          last_engaged: data.last_engaged || ""
        });
        if (data.profilepic) setPreview(data.profilepic);
      })
      .catch(() => {})
      .finally(() => {});
  }, [id, reset]);

  // Fetch organs
  useEffect(() => {
    axios.get(`${API_BASE_URL}/delegateorgans`)
      .then(res => setOrgans(res.data))
      .catch(() => {});
  }, []);

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPicture(file);
    setValue("profilepic", file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async formData => {
    const data = new FormData();
    // append all fields
    Object.entries(formData).forEach(([k,v]) => {
      if (k === "organ_id") return;
      data.append(k, v);
    });
    // overwrite organ_id
    const organ = organs.find(o => o.organname === formData.organname);
    data.append("organ_id", organ?.id || "");
    if (picture) data.append("profilepic", picture);

    try {
      await axios.patch(`${API_BASE_URL}/delegates/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Delegate updated!");
      navigate("/delegateorgans");
    } catch {
      alert("Update failed.");
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
        {/* ... existing inputs ... */}

        {/* Support Status */}
        <div>
          <label>Support Status</label>
          <select {...register("supportstatus")} className="w-full p-2 border rounded mt-1">
            <option value="supports">Supports</option>
            <option value="opposes">Opposes</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        {/* Engaged */}
        <div className="flex items-center mt-4">
          <input type="checkbox" {...register("engaged")} id="engaged" />
          <label htmlFor="engaged" className="ml-2">Engaged</label>
        </div>

        {/* Last Engaged Date */}
        <div>
          <label>Last Engaged Date</label>
          <input
            type="date"
            {...register("last_engaged")}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label>Profile Picture (Optional)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded mt-1"
            onChange={handleFileChange}
          />
          {preview && (
            <img src={preview} className="w-32 h-32 rounded-full mt-4" alt="preview"/>
          )}
        </div>

        {/* Save / Delete */}
        <div className="col-span-2 flex justify-between mt-6">
          <button type="submit" className="bg-red-500 text-white px-6 py-3 rounded">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}