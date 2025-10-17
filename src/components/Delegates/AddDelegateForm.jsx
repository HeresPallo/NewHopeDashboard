import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const API_BASE = "https://new-hope-8796c77630ff.herokuapp.com";

const AddDelegateForm = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [organs, setOrgans] = useState([]);
  const [delegates, setDelegates] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // NEW: CSV-paste state
  const [csvText, setCsvText] = useState("");

  // Axios with auth (if your dashboard is protected)
  const api = axios.create({ baseURL: API_BASE });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Fetch Organ Names
  useEffect(() => {
    api
      .get("/delegateorgans")
      .then((r) => setOrgans(Array.isArray(r.data) ? r.data : []))
      .catch((e) => console.error("Error fetching organs:", e));
  }, []);

  // File upload handler (CSV or XLSX)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => setDelegates(res.data || []),
        error: (err) => console.error("CSV parse error:", err),
      });
    } else if (["xlsx", "xls"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        setDelegates(XLSX.utils.sheet_to_json(ws, { defval: "" }));
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file type. Please upload CSV or XLSX.");
    }
  };

  // NEW: Paste-CSV handler
  const handlePasteCSV = () => {
    if (!csvText.trim()) {
      alert("Please paste some CSV text first.");
      return;
    }
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setDelegates(res.data || []),
      error: (err) => console.error("CSV parse error:", err),
    });
  };

  // Bulk submit
  const handleBulkSubmit = async () => {
    if (delegates.length === 0) {
      alert("No delegates to submit.");
      return;
    }
    try {
      await api.post("/delegates/bulk", { delegates });
      setSuccessMessage("Bulk upload successful!");
      setErrorMessage(null);
      setDelegates([]);
      setCsvText("");
    } catch (err) {
      setErrorMessage(err?.response?.data?.error || "Bulk upload failed.");
    }
  };

  // Single image upload preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only JPEG/PNG allowed");
      return;
    }
    setPicture(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Zod schema & React-Hook-Form
  const schema = z.object({
    name: z.string().min(3),
    role: z.string().min(2),
    phonenumber: z.string().min(6),
    email: z.string().email(),
    address: z.string().min(3),
    constituency: z.string().min(1),
    supportstatus: z.enum(["supports", "opposes", "neutral"]),
    organname: z.string().min(1),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      organname: "",
    },
  });

  // Single form submit
  const onSubmit = async (fd) => {
    const data = new FormData();
    Object.entries(fd).forEach(([k, v]) => data.append(k, v));
    if (picture) data.append("profilepic", picture);

    try {
      await api.post("/delegates", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Delegate added!");
      setErrorMessage(null);
      setTimeout(() => navigate("/delegateorgans"), 800);
    } catch (err) {
      setErrorMessage(err?.response?.data?.error || "Error adding delegate");
    }
  };

  return (
    <div className="min-h-screen bg-white p-10 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-4xl font-bold mb-6 text-center">Add Delegate</h2>

        {/* ——— Paste CSV Section ——— */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Paste CSV rows here:</label>
          <textarea
            className="w-full p-2 border rounded mb-2 h-32"
            placeholder="name,role,phonenumber,email,address,constituency,supportstatus,organname,organ_id,engaged,last_engaged"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
          />
          <button
            onClick={handlePasteCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Parse Pasted CSV
          </button>
        </div>

        {/* ——— File Upload Section ——— */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Or upload CSV/XLSX</label>
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* ——— Preview & Bulk Submit ——— */}
        {delegates.length > 0 && (
          <div className="bg-gray-50 p-4 rounded shadow mb-6">
            <h3 className="font-semibold mb-2">Preview ({delegates.length} rows)</h3>
            <div className="overflow-auto max-h-40 border">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Organ</th>
                  </tr>
                </thead>
                <tbody>
                  {delegates.slice(0, 5).map((d, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{d.name}</td>
                      <td className="p-2">{d.role}</td>
                      <td className="p-2">{d.phonenumber}</td>
                      <td className="p-2">{d.email}</td>
                      <td className="p-2">{d.organname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleBulkSubmit}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Submit Bulk ({delegates.length})
            </button>
          </div>
        )}

        {/* ——— Single Delegate Form ——— */}
        <div className="bg-gray-100 p-8 rounded shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Name</label>
                <input {...register("name")} className="w-full p-3 border rounded" />
                {errors.name && <p className="text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block mb-1">Role</label>
                <input {...register("role")} className="w-full p-3 border rounded" />
                {errors.role && <p className="text-red-600">{errors.role.message}</p>}
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1">Phone Number</label>
                <input {...register("phonenumber")} className="w-full p-3 border rounded" />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input {...register("email")} className="w-full p-3 border rounded" />
              </div>
            </div>

            {/* Address & Constituency */}
            <div>
              <label className="block mb-1">Address</label>
              <input {...register("address")} className="w-full p-3 border rounded" />
            </div>
            <div>
              <label className="block mb-1">Constituency</label>
              <input {...register("constituency")} className="w-full p-3 border rounded" />
            </div>

            {/* Support status */}
            <div>
              <label className="block mb-1">Support Status</label>
              <select {...register("supportstatus")} className="w-full p-3 border rounded">
                <option value="supports">supports</option>
                <option value="neutral">neutral</option>
                <option value="opposes">opposes</option>
              </select>
            </div>

            {/* Organ */}
            <div>
              <label className="block mb-1">Organ Name</label>
              <select {...register("organname")} className="w-full p-3 border rounded">
                <option value="">Select an Organ</option>
                {organs.map((o) => (
                  <option key={o.id} value={o.organname}>
                    {o.organname}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Picture */}
            <div>
              <label className="block mb-1">Profile Picture (optional)</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
              {preview && <img src={preview} className="w-24 h-24 rounded-full mt-2" alt="preview" />}
            </div>

            {/* Submit */}
            <button className="w-full py-3 bg-red-600 text-white rounded hover:bg-red-700">
              Add Delegate
            </button>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDelegateForm;
