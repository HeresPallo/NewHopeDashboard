import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft } from "react-icons/fi"; // Import back arrow icon

const EditDelegate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [picture, setPicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [organs, setOrgans] = useState([]); // Stores organ options

    // ✅ Define Schema for Validation
    const schema = z.object({
        name: z.string().min(3, { message: "Name is required" }),
        role: z.string().min(2, { message: "Role is required" }),
        phonenumber: z.string().min(9, { message: "Phone number is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        address: z.string().min(3, { message: "Address is required" }),
        constituency: z.string().min(3, { message: "Constituency is required" }),
        supportstatus: z.enum(["supports", "opposes", "neutral"], { message: "Select a support status" }),
        organname: z.string().min(1, { message: "Please select an organ" }),
        profilepic: z.any().optional(), // ✅ Profile pic remains optional
    });

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        resolver: zodResolver(schema),
        mode: "onSubmit",
    });

    // ✅ Fetch Delegate Data on Load
    useEffect(() => {
        if (!id) return;

        axios.get(`http://localhost:5001/delegates/${id}`)
            .then(response => {
                reset(response.data);
                if (response.data.profilepic) setPreview(response.data.profilepic);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching delegate details:", error);
                setErrorMessage("Delegate not found or deleted.");
                setLoading(false);
            });
    }, [id, reset]);

    // ✅ Fetch Organ Names
    useEffect(() => {
        axios.get("http://localhost:5001/delegateorgans")
            .then(response => setOrgans(response.data))
            .catch(error => console.error("Error fetching organs:", error));
    }, []);

    // ✅ Handle Image Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
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

    // ✅ Form Submission
    const onSubmit = async (formData) => {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("role", formData.role);
        data.append("phonenumber", formData.phonenumber);
        data.append("email", formData.email);
        data.append("address", formData.address);
        data.append("constituency", formData.constituency);
        data.append("supportstatus", formData.supportstatus);
        data.append("organname", formData.organname);
        data.append("organ_id", organs.find(org => org.organname === formData.organname)?.id || "");

        if (picture) {
            data.append("profilepic", picture);
        }

        try {
            await axios.patch(`http://localhost:5001/delegates/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSuccessMessage(alert("Delegate Updated Successfully!"));
            setTimeout(() => navigate("/delegateorgans"), 1000);
        } catch (error) {
            console.error("❌ Error submitting form:", error);
            setErrorMessage(error.response?.data?.error || "An unexpected error occurred.");
        }
    };

    // ✅ Delete Delegate Function
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this delegate?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5001/delegates/${id}`);
            alert("Delegate deleted successfully!");
            navigate("/delegateorgans");
        } catch (error) {
            console.error("❌ Error deleting delegate:", error);
            alert("Failed to delete delegate.");
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading delegate details...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 border border-gray-200  mt-6">
            {/* 🔙 Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-700 hover:text-red-500 mb-6 transition-all"
            >
                <FiArrowLeft className="mr-2 text-lg" />
                <span className="text-lg font-medium">Back</span>
            </button>

            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Delegate</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input type="text" {...register("name")} className="w-full p-3 border rounded-lg mt-1" />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Role */}
                <div>
                    <label className="block text-gray-700">Role</label>
                    <input type="text" {...register("role")} className="w-full p-3 border rounded-lg mt-1" />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input type="text" {...register("phonenumber")} className="w-full p-3 border rounded-lg mt-1" />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input type="text" {...register("email")} className="w-full p-3 border rounded-lg mt-1" />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-gray-700">Address</label>
                    <input type="text" {...register("address")} className="w-full p-3 border rounded-lg mt-1" />
                </div>

                {/* Constituency */}
                <div>
                    <label className="block text-gray-700">Constituency</label>
                    <input type="text" {...register("constituency")} className="w-full p-3 border rounded-lg mt-1" />
                </div>

                {/* Organ Name */}
                <div>
                    <label className="block text-gray-700">Organ Name</label>
                    <select {...register("organname")} className="w-full p-3 border rounded-lg mt-1">
                        <option value="">Select an Organ</option>
                        {organs.map(org => <option key={org.id} value={org.organname}>{org.organname}</option>)}
                    </select>
                </div>

                {/* Support Status */}
                <div>
                    <label className="block text-gray-700">Support Status</label>
                    <select {...register("supportstatus")} className="w-full p-3 border rounded-lg mt-1">
                        <option value="supports">Supports</option>
                        <option value="opposes">Opposes</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </div>

                {/* Save & Delete Buttons */}
                <div className="col-span-2 flex justify-between mt-6">
                    <button type="submit" className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all">Save Changes</button>
                    <button type="button" onClick={handleDelete} className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all">Delete Delegate</button>
                </div>
            </form>
        </div>
    );
};

export default EditDelegate;
