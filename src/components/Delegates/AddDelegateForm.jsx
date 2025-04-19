import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const API_BASE_URL = 'https://new-hope-e46616a5d911.herokuapp.com';

const AddDelegateForm = () => {
  const navigate = useNavigate();
  const formRef = useRef();
  const [organs, setOrgans] = useState([]);
  const [delegates, setDelegates] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch organ options
  useEffect(() => {
    axios.get(`${API_BASE_URL}/delegateorgans`)
      .then(res => setOrgans(res.data))
      .catch(err => console.error('Error fetching organs:', err));
  }, []);

  // Handle CSV/XLSX upload and parse
  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: results => setDelegates(results.data),
        error: err => console.error('CSV parse error:', err)
      });
    } else if (['xlsx','xls'].includes(ext)) {
      const reader = new FileReader();
      reader.onload = evt => {
        const data = evt.target.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        setDelegates(XLSX.utils.sheet_to_json(ws, { defval: '' }));
      };
      reader.onerror = err => console.error('XLSX read error:', err);
      reader.readAsBinaryString(file);
    } else {
      alert('Please upload a CSV or XLSX file.');
    }
  };

  // Bulk submit parsed data
  const handleBulkSubmit = async () => {
    if (!delegates.length) return alert('No data to submit.');
    try {
      await axios.post(`${API_BASE_URL}/delegates/bulk`, { delegates });
      setSuccessMessage('Delegates added successfully!');
      setDelegates([]);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Bulk upload failed.');
    }
  };

  // Zod schema including engaged and last_engaged
  const schema = z.object({
    name: z.string().min(3, 'Name is required'),
    role: z.string().min(2, 'Role is required'),
    phonenumber: z.string().min(9, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(3, 'Address is required'),
    constituency: z.string().min(3, 'Constituency is required'),
    supportstatus: z.enum(['supports','opposes','neutral']),
    organname: z.string().min(1, 'Please select an organ'),
    engaged: z.boolean().optional(),
    last_engaged: z.string().optional(),
    profilepic: z.any().optional()
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', role: '', phonenumber: '', email: '', address: '', constituency: '',
      supportstatus: 'neutral', organname: '', engaged: false, last_engaged: '', profilepic: null
    }
  });

  // Handle profile picture upload
  const handleFileChange = e => {
    const file = e.target.files[0]; if (!file) return;
    const allowed = ['image/jpeg','image/png'];
    if (!allowed.includes(file.type)) return alert('Only JPEG/PNG allowed');
    setPicture(file);
    setValue('profilepic', file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Submit single delegate
  const onSubmit = async formData => {
    const data = new FormData();
    // append fields
    ['name','role','phonenumber','email','address','constituency','supportstatus','organname']
      .forEach(key => data.append(key, formData[key]));
    // find organ_id
    const organ = organs.find(o => o.organname === formData.organname);
    data.append('organ_id', organ?.id || '');
    // new fields
    data.append('engaged', formData.engaged ? 'true' : 'false');
    if (formData.last_engaged) data.append('last_engaged', formData.last_engaged);
    if (picture) data.append('profilepic', picture);

    try {
      await axios.post(`${API_BASE_URL}/delegates`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
      setSuccessMessage('Delegate added!'); setErrorMessage(null);
      setTimeout(() => navigate('/delegateorgans'), 1000);
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage(err.response?.data?.error || 'Submit failed.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-3xl mx-auto bg-gray-100 p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-6">Add Delegate</h2>

        {/* Bulk CSV/XLSX upload */}
        <div className="mb-6">
          <label className="font-semibold">Upload CSV/XLSX</label>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="block mt-2" />
          {delegates.length > 0 && (
            <button onClick={handleBulkSubmit} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Submit Bulk Data
            </button>
          )}
        </div>

        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Name</label>
              <input type="text" {...register('name')} className="w-full p-3 border rounded" />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label>Role</label>
              <input type="text" {...register('role')} className="w-full p-3 border rounded" />
              {errors.role && <p className="text-red-500">{errors.role.message}</p>}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Phone Number</label>
              <input type="text" {...register('phonenumber')} className="w-full p-3 border rounded" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" {...register('email')} className="w-full p-3 border rounded" />
            </div>
          </div>
          <div>
            <label>Address</label>
            <input type="text" {...register('address')} className="w-full p-3 border rounded" />
          </div>
          <div>
            <label>Constituency</label>
            <input type="text" {...register('constituency')} className="w-full p-3 border rounded" />
          </div>

          {/* Organ & Status */}
          <div>
            <label>Organ Name</label>
            <select {...register('organname')} className="w-full p-3 border rounded">
              <option value="">Select Organ</option>
              {organs.map(o => <option key={o.id} value={o.organname}>{o.organname}</option>)}
            </select>
          </div>
          <div>
            <label>Support Status</label>
            <select {...register('supportstatus')} className="w-full p-3 border rounded">
              <option value="supports">Supports</option>
              <option value="opposes">Opposes</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          {/* New: Engagement Fields */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('engaged')} id="engaged" />
            <label htmlFor="engaged">Engaged</label>
          </div>
          <div>
            <label>Last Engaged Date (optional)</label>
            <input type="date" {...register('last_engaged')} className="w-full p-3 border rounded" />
          </div>

          {/* Profile Picture */}
          <div>
            <label>Profile Picture (Optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full mt-2" />
            {preview && <img src={preview} alt="preview" className="w-24 h-24 rounded-full mt-2" />}
          </div>

          {/* Submit */}
          <button type="submit" className="w-full py-3 bg-red-600 text-white rounded">Submit</button>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddDelegateForm;
