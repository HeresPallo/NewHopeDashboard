import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDelegateForm = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [organs, setOrgans] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch Organ Names from Database
  useEffect(() => {
    axios
      .get("http://localhost:5001/delegateorgans")
      .then((response) => setOrgans(response.data))
      .catch((error) => console.error("Error fetching delegate organs:", error));
  }, []);

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
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    if (picture) data.append("profilepic", picture);

    try {
      await axios.post("http://localhost:5001/delegates", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Delegate added successfully!");
      setErrorMessage(null);
      setTimeout(() => navigate("/delegateorgans"), 1000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
      <div className="max-w-3xl w-full">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-6">
          Add Delegate
        </h2>

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
