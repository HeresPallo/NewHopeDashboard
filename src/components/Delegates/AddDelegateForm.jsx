import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const API = "https://new-hope-e46616a5d911.herokuapp.com";

export default function AddDelegateForm() {
  const navigate = useNavigate();
  const formRef = useRef();
  const [organs, setOrgans] = useState([]);
  const [delegates, setDelegates] = useState([]);      // CSV/XLSX or paste preview
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // picture upload
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // which bulk UI tab?
  const [mode, setMode] = useState("file"); // "file" | "paste"

  // paste textarea
  const [pasteText, setPasteText] = useState("");

  // load organs
  useEffect(() => {
    axios
      .get(`${API}/delegateorgans`)
      .then(r => setOrgans(r.data))
      .catch(console.error);
  }, []);

  // parse file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: r => setDelegates(r.data),
      });
    } else {
      const reader = new FileReader();
      reader.onload = evt => {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        setDelegates(XLSX.utils.sheet_to_json(sheet, { defval: "" }));
      };
      reader.readAsBinaryString(file);
    }
  };

  // parse paste
  const handlePasteParse = () => {
    const r = Papa.parse(pasteText.trim(), {
      header: true,
      skipEmptyLines: true
    });
    if (r.errors.length) {
      setErrorMessage("Parse errors in pasted data.");
      console.error(r.errors);
    } else {
      setDelegates(r.data);
      setErrorMessage(null);
    }
  };

  // submit pasted delegates
  const handlePasteSubmit = async () => {
    if (delegates.length === 0) {
      return alert("No rows to submit.");
    }
    try {
      const res = await axios.post(`${API}/delegates/bulk-paste`, { delegates });
      setSuccessMessage(res.data.message);
      setErrorMessage(null);
      setDelegates([]);
      setPasteText("");
      setTimeout(() => navigate("/delegateorgans"), 1000);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || "Upload failed.");
    }
  };

  // single‐row form
  const schema = z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    phonenumber: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
    constituency: z.string().min(1),
    supportstatus: z.enum(["supports","opposes","neutral"]),
    organname: z.string().min(1),
  });
  const { register, handleSubmit, formState:{errors}, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      supportstatus:"neutral",
    }
  });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/png","image/jpeg"];
    if (!allowed.includes(file.type)) return alert("Only PNG/JPEG");
    setPicture(file);
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result);
    r.readAsDataURL(file);
    setValue("profilepic", file);
  };

  const onSubmit = async data => {
    const form = new FormData();
    for (let k of ["name","role","phonenumber","email","address","constituency","supportstatus","organname"]) {
      form.append(k, data[k]);
    }
    if (picture) form.append("profilepic", picture);
    try {
      await axios.post(`${API}/delegates`, form, {
        headers: { "Content-Type":"multipart/form-data" }
      });
      setSuccessMessage("Delegate added!");
      setErrorMessage(null);
      setTimeout(()=>navigate("/delegateorgans"),500);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || "Failed to add delegate");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h2 className="text-3xl mb-6">Add Delegates</h2>

      {/* tab switcher */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${mode==="file"? "bg-blue-600 text-white":"bg-gray-200"}`}
          onClick={()=>setMode("file")}
        >Upload File</button>
        <button
          className={`px-4 py-2 rounded ${mode==="paste"? "bg-blue-600 text-white":"bg-gray-200"}`}
          onClick={()=>setMode("paste")}
        >Paste Rows</button>
      </div>

      {/* FILE UPLOAD mode */}
      {mode==="file" && (
        <div className="mb-8">
          <input
            type="file"
            accept=".csv, .xls, .xlsx"
            onChange={handleFileUpload}
            className="border p-2"
          />
          {delegates.length>0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Preview (first 5)</h4>
              <table className="w-full text-sm border">
                <thead>
                  <tr><th>Name</th><th>Role</th><th>Phone</th><th>Email</th><th>Org</th></tr>
                </thead>
                <tbody>
                  {delegates.slice(0,5).map((d,i)=>(
                    <tr key={i} className="border-t">
                      <td className="p-1">{d.name}</td>
                      <td className="p-1">{d.role}</td>
                      <td className="p-1">{d.phonenumber}</td>
                      <td className="p-1">{d.email}</td>
                      <td className="p-1">{d.organname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={async ()=>{
                  try { 
                    await axios.post(`${API}/delegates/bulk-paste`,{delegates});
                    alert("Inserted!");
                    setDelegates([]);
                  } catch(e) { console.error(e); alert("Bulk failed"); }
                }}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              >Submit File Data</button>
            </div>
          )}
        </div>
      )}

      {/* PASTE mode */}
      {mode==="paste" && (
        <div className="mb-8">
          <textarea
            rows={8}
            className="w-full p-2 border"
            placeholder="CSV with header row: name,role,phonenumber,email,address,constituency,supportstatus,organname"
            value={pasteText}
            onChange={e=>setPasteText(e.target.value)}
          />
          <div className="mt-2 flex space-x-2">
            <button
              onClick={handlePasteParse}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >Parse</button>
            <button
              onClick={handlePasteSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >Submit Parsed</button>
          </div>
          {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
          {successMessage && <p className="text-green-600 mt-2">{successMessage}</p>}

          {delegates.length>0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Parsed Preview</h4>
              <table className="w-full text-sm border">
                <thead>
                  <tr><th>Name</th><th>Role</th><th>Phone</th><th>Email</th><th>Org</th></tr>
                </thead>
                <tbody>
                  {delegates.slice(0,5).map((d,i)=>(
                    <tr key={i} className="border-t">
                      <td className="p-1">{d.name}</td>
                      <td className="p-1">{d.role}</td>
                      <td className="p-1">{d.phonenumber}</td>
                      <td className="p-1">{d.email}</td>
                      <td className="p-1">{d.organname}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Single‐delegate form */}
      <div className="border p-6 rounded">
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* your existing inputs… */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Name</label>
              <input {...register("name")} className="w-full p-2 border rounded" />
              {errors.name && <p className="text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label>Role</label>
              <input {...register("role")} className="w-full p-2 border rounded" />
            </div>
          </div>
          {/* …and the rest of your fields + picture upload as before */}
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
            Add Single Delegate
          </button>
        </form>
      </div>
    </div>
  );
}
