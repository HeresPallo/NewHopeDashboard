// src/pages/AddDelegateForm.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const API = "https://new-hope-e46616a5d911.herokuapp.com";

const AddDelegateForm = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [organs, setOrgans] = useState([]);
  const [delegates, setDelegates] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // fetch organs
  useEffect(() => {
    axios
      .get(`${API}/delegateorgans`)
      .then(r => setOrgans(r.data))
      .catch(e => console.error(e));
  }, []);

  // schema now includes organ_id, engaged, last_engaged
  const schema = z.object({
    name: z.string().min(3),
    role: z.string().min(2),
    phonenumber: z.string().min(9),
    email: z.string().email(),
    address: z.string().min(3),
    constituency: z.string().min(3),
    supportstatus: z.enum(["supports", "opposes", "neutral"]),
    organ_id: z.string().min(1, "Please select an organ"),
    engaged: z.boolean().optional(),
    last_engaged: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      role: "",
      phonenumber: "",
      email: "",
      address: "",
      constituency: "",
      supportstatus: "neutral",
      organ_id: "",
      engaged: false,
      last_engaged: "",
    },
  });

  // when organ_id changes, also set organname
  const selectedOrganId = watch("organ_id");
  useEffect(() => {
    if (selectedOrganId) {
      const o = organs.find(o => o.id.toString() === selectedOrganId);
      if (o) setValue("organname", o.organname);
    }
  }, [selectedOrganId, organs, setValue]);

  // handle picture preview
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/png","image/jpeg"];
    if (!allowed.includes(file.type)) {
      alert("Only JPEG/PNG allowed");
      return;
    }
    setPicture(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // CSV / XLSX bulk upload unchanged from you
  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true, skipEmptyLines: true,
        complete: r => setDelegates(r.data),
      });
    } else if (['xlsx','xls'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = evt => {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        setDelegates(XLSX.utils.sheet_to_json(ws, { defval: "" }));
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Only CSV/XLSX");
    }
  };
  const handleBulkSubmit = async () => {
    if (!delegates.length) { alert("No data."); return; }
    try {
      await axios.post(`${API}/delegates/bulk`, { delegates });
      alert("Bulk delegates added!");
      setDelegates([]);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.error || "Bulk upload failed");
    }
  };

  // onSubmit sends ALL fields
  const onSubmit = async data => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("role", data.role);
    formData.append("phonenumber", data.phonenumber);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("constituency", data.constituency);
    formData.append("supportstatus", data.supportstatus);
    formData.append("organname", organs.find(o=>o.id.toString()===data.organ_id).organname);
    formData.append("organ_id", data.organ_id);
    formData.append("engaged", data.engaged);
    if (data.last_engaged) {
      formData.append("last_engaged", data.last_engaged);
    }
    if (picture) formData.append("profilepic", picture);

    try {
      const resp = await axios.post(`${API}/delegates`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Delegate added!");
      setErrorMessage(null);
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || "Error adding delegate");
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <h2 className="text-4xl mb-6">Add Delegate</h2>

      {/* Bulk upload */}
      <div className="mb-8">
        <label>Upload CSV/XLSX</label>
        <input type="file" onChange={handleFileUpload} />
        {delegates.length>0 && (
          <button onClick={handleBulkSubmit} className="ml-4 bg-blue-600 text-white px-4 py-2">
            Submit Bulk ({delegates.length})
          </button>
        )}
      </div>

      {/* Individual form */}
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef} className="space-y-6">
        {/* name/role */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Name</label>
            <input {...register("name")} className="w-full p-2 border" />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label>Role</label>
            <input {...register("role")} className="w-full p-2 border" />
            {errors.role && <p className="text-red-500">{errors.role.message}</p>}
          </div>
        </div>

        {/* phone / email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Phone</label>
            <input {...register("phonenumber")} className="w-full p-2 border" />
            {errors.phonenumber && <p className="text-red-500">{errors.phonenumber.message}</p>}
          </div>
          <div>
            <label>Email</label>
            <input {...register("email")} className="w-full p-2 border" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        {/* address / constituency */}
        <div>
          <label>Address</label>
          <input {...register("address")} className="w-full p-2 border" />
          {errors.address && <p className="text-red-500">{errors.address.message}</p>}
        </div>
        <div>
          <label>Constituency</label>
          <input {...register("constituency")} className="w-full p-2 border" />
          {errors.constituency && <p className="text-red-500">{errors.constituency.message}</p>}
        </div>

        {/* support status / organ select */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Support Status</label>
            <select {...register("supportstatus")} className="w-full p-2 border">
              <option value="supports">Supports</option>
              <option value="opposes">Opposes</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
          <div>
            <label>Organ</label>
            <select {...register("organ_id")} className="w-full p-2 border">
              <option value="">Select an organ</option>
              {organs.map(o => (
                <option key={o.id} value={o.id}>{o.organname}</option>
              ))}
            </select>
            {errors.organ_id && <p className="text-red-500">{errors.organ_id.message}</p>}
          </div>
        </div>

        {/* engaged / last_engaged */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="flex items-center">
            <input type="checkbox" {...register("engaged")} id="engaged" className="mr-2" />
            <label htmlFor="engaged">Engaged?</label>
          </div>
          <div>
            <label>Last Engaged</label>
            <input type="date" {...register("last_engaged")} className="w-full p-2 border" />
          </div>
        </div>

        {/* profile pic */}
        <div>
          <label>Profile Picture (png/jpeg)</label>
          <input type="file" accept=".png,.jpeg,.jpg" onChange={handleFileChange} className="block" />
          {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-full mt-2" />}
        </div>

        {/* submit */}
        <button type="submit" className="w-full py-3 bg-red-600 text-white rounded">Submit</button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </form>
    </div>
);

};

export default AddDelegateForm;
