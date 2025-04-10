import React from 'react';
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const AddDelegateForm = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [organs, setOrgans] = useState([]);
  const [delegates, setDelegates] = useState([]); // Add this line
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch Organ Names from Database
  useEffect(() => {
    axios
      .get("https://new-hope-e46616a5d911.herokuapp.com/delegateorgans")
      .then((response) => setOrgans(response.data))
      .catch((error) => console.error("Error fetching delegate organs:", error));
  }, []);

  // ✅ Handle CSV Upload & Parse
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setDelegates(results.data);
      },
      error: (err) => console.error("CSV Parsing Error:", err),
    });
  };

  // ✅ Handle CSV Bulk Upload Submission
  const handleBulkSubmit = async () => {
    if (delegates.length === 0) {
      alert("No data available to submit.");
      return;
    }

    try {
      await axios.post("https://new-hope-e46616a5d911.herokuapp.com/delegates/bulk", { delegates });
      setSuccessMessage("Delegates added successfully!");
      setDelegates([]); // ✅ Clear data after submission
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An unexpected error occurred.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const fileExtension = file.name.split('.').pop().toLowerCase();
  
    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setDelegates(results.data);
        },
        error: (err) => console.error("CSV Parsing Error:", err),
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target.result;
        // Read the binary string and parse the workbook
        const workbook = XLSX.read(data, { type: 'binary' });
        // Assume the first sheet is the one we want
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setDelegates(jsonData);
      };
      reader.onerror = (evt) => {
        console.error("Error reading XLSX file:", evt);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file type. Please upload a CSV or XLSX file.");
    }
  };

  // Zod Validation Schema
  const schema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    role: z.string().min(2, { message: "Role is required" }),
    phonenumber: z.string().min(9, { message: "Phone number is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    address: z.string().min(3, { message: "Address is required" }),
    constituency: z.string().min(3, { message: "Constituency is required" }),
    supportstatus: z.enum(["supports", "opposes", "neutral"], {
      message: "Select a support status",
    }),
    organname: z.string().min(1, { message: "Please select an organ" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      role: "",
      phonenumber: "",
      email: "",
      address: "",
      constituency: "",
      supportstatus: "neutral",
      organname: "",
      profilepic: null,
    },
  });

  // Handle Image Upload & Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG and PNG images are allowed!");
      return;
    }

    setPicture(file);
    setValue("profilepic", file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Form Submission
  const onSubmit = async (formData) => {
    const data = new FormData();
    
    // ✅ Only append required fields
    const { name, role, phonenumber, email, address, constituency, supportstatus, organname } = formData;
    data.append("name", name);
    data.append("role", role);
    data.append("phonenumber", phonenumber);
    data.append("email", email);
    data.append("address", address);
    data.append("constituency", constituency);
    data.append("supportstatus", supportstatus);
    data.append("organname", organname);
  
    if (picture) data.append("profilepic", picture); // ✅ Only include profile picture
  
    try {
      await axios.post("https://new-hope-e46616a5d911.herokuapp.com/delegates", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSuccessMessage("Delegate added successfully!");
      setErrorMessage(null);
      setTimeout(() => navigate("/delegateorgans"), 1000);
    } catch (error) {
      console.error("❌ Error submitting delegate:", error.response?.data || error);
      setErrorMessage(error.response?.data?.error || "An unexpected error occurred.");
    }
  };
  
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <div className="max-w-3xl w-full">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
          Add Delegate
        </h2>

         {/* ✅ CSV Upload Section */}
         <div className="mb-6">
            <label className="block text-gray-700 font-semibold">Upload CSV File</label>
            <input
  type="file"
  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  onChange={handleFileUpload}
  className="w-full p-2 border rounded-md"
/>

          </div>

        {/* ✅ Display CSV Data Preview */}
        {delegates.length > 0 && (
            <div className="bg-white p-4 shadow-md rounded-md">
              <h3 className="text-lg font-semibold mb-2">CSV Preview</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-gray-700 border-b">
                    <th className="p-2">Name</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Organ</th>
                  </tr>
                </thead>
                <tbody>
                  {delegates.slice(0, 5).map((delegate, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{delegate.name}</td>
                      <td className="p-2">{delegate.role}</td>
                      <td className="p-2">{delegate.phonenumber}</td>
                      <td className="p-2">{delegate.email}</td>
                      <td className="p-2">{delegate.organname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleBulkSubmit}
                className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Submit CSV Data
              </button>
            </div>
          )}

        <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Name & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                  {...register("name")}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Role</label>
                <input
                  type="text"
                  placeholder="Enter role"
                  className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                  {...register("role")}
                />
                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                  {...register("phonenumber")}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                  {...register("email")}
                />
              </div>
            </div>

            {/* Address & Constituency */}
            <div>
              <label className="block text-gray-700 font-semibold">Address</label>
              <input
                type="text"
                placeholder="Enter address"
                className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                {...register("address")}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Constituency</label>
              <input
                type="text"
                placeholder="Enter constituency"
                className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
                {...register("constituency")}
              />
            </div>

            {/* Organ Name */}
            <div>
              <label className="block text-gray-700 font-semibold">Organ Name</label>
              <select
                {...register("organname")}
                className="w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select an Organ</option>
                {organs.map((organ) => (
                  <option key={organ.id} value={organ.organname}>{organ.organname}</option>
                ))}
              </select>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-gray-700 font-semibold">Profile Picture (Optional)</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="w-full p-2 border rounded-md focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:bg-red-100 file:text-red-600 hover:file:bg-red-200"
                onChange={handleFileChange}
              />
              {preview && (
                <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full mt-4" />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-all"
            >
              Submit
            </button>

            {/* Messages */}
            {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 text-center mt-2">{successMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDelegateForm;
