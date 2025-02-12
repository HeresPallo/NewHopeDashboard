import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const NOKForm = () => {
  const form = useRef();

    const [details, setDetails] = useState("");

    const [picture, setPicture] = useState(null);
    const [picture_two, setPictureTwo] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null); 
    const navigate = useNavigate();

    const user = "/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg";

    const schema = z.object({
        number: z.string().min(7, {message:"Use Oracle ID"}),
        name: z.string().min(3, {message:"Name required"}),
        other_name: z.string().optional(),
        address: z.string().min(3,{message:"Address required"}),
        contact: z.number().gte(9, {message:"Phone number should start with 0"}),
        date: z.string().min(3, {message:"date requires a minimum of 3 letters"}),
        nok_type: z.union([z.literal('Primary')]),
        relationship: z.union([z.literal('Spouse'), z.literal('Child'),z.literal('Parent'),z.literal('Sibling'),z.literal('Other')]),
        surname: z.string().min(2, {message:" Type surname"}),
        first_name: z.string().min(2, {message:" Type First Name"}),
        employee_date_of_birth: z.string().min(3, {message:"date requires a minimum of 3 letters"}),
        employee_start_date: z.string().min(3, {message:"date requires a minimum of 3 letters"}),
        position: z.string().min(3, {message:"Type  Position with Orange at Time of Filing"}),
        marital_status: z.union([z.literal('Single'), z.literal('Married'),z.literal('Widowed'),z.literal('Divorced'),z.literal('Other')]),
        nationality: z.string().min(2, {message:"Type nationality Here"}),
        no_of_children: z.string().min(1, {message:"Type No. of Children"}),
        home_address: z.string().min(2, {message:"Address required"}),
        telephone_no: z.number().gte(9, {message:"Phone number should start with 0"}),
        type_secondary: z.union([ z.literal('Secondary')]),
        name_secondary: z.string().min(3, {message:"Name required"}),
        address_secondary: z.string().min(3,{message:"Address required"}),
        relationship_secondary: z.union([z.literal('Spouse'), z.literal('Child'),z.literal('Parent'),z.literal('Sibling'),z.literal('Other')]),
        date_of_birth_secondary: z.string().min(3, {message:"date requires a minimum of 3 letters"}),
        phone_number_secondary: z.number().gte(9, {message:"Phone number should start with 0"}),
    })

    const {register, handleSubmit, formState:{errors}} = useForm({resolver: zodResolver(schema),
        defaultValues: {
          other_name: "",
        }
    });

      // Image
  const handleImageChange = (e) => {
    setPicture(e.target.files[0]);
  };

        // Image2
        const handleImageChange2 = (e) => {
          setPictureTwo(e.target.files[0]);
        };

    // Form submission
  const onSubmit = async (formData) => {
  console.log('Form submitted:', formData); 
  
    const data = new FormData();

    data.append('employee_number', formData.number);
    data.append('surname', formData.surname);
    data.append('first_name', formData.first_name);
    data.append('other_name', formData.other_name);
    data.append('employee_date_of_birth', formData.employee_date_of_birth);
    data.append('employee_start_date', formData.employee_start_date);
    data.append('position', formData.position);
    data.append('nationality', formData.nationality);
    data.append('marital_status', formData.marital_status);
    data.append('no_of_children', formData.no_of_children);
    data.append('home_address', formData.home_address);
    data.append('telephone_no', formData.telephone_no);
    data.append('nok_type', formData.nok_type);
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('relationship', formData.relationship);
    data.append('date_of_birth', formData.date);
    data.append('phone_number', formData.contact);
    data.append('type_secondary', formData.type_secondary);
    data.append('name_secondary', formData.name_secondary);
    data.append('address_secondary', formData.address_secondary);
    data.append('relationship_secondary', formData.relationship_secondary);
    data.append('date_of_birth_secondary', formData.date_of_birth_secondary);
    data.append('phone_number_secondary', formData.phone_number_secondary);
    if (picture) data.append('image1', picture);
    if (picture_two) data.append('image2', picture_two);

    try {
      const response = await axios.post('http://localhost:5001/nextofkin', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data);
      setSuccessMessage(alert('Next of Kin information submitted successfully!'));
      setErrorMessage(null); 

      emailjs
      .sendForm('service_5jyk8f5', 'template_3q2razj', form.current, {
        publicKey: 'JWh12OzIRvSrjKy7t',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

   setTimeout(() => {
    navigate('/');
  }, 1000);
} catch (error) {
  console.error('Error submitting form:', error);
  if (error.response && error.response.data && error.response.data.error) {
    setErrorMessage(error.response.data.error); 
  } else {
    setErrorMessage('An unexpected error occurred. Please try again later.');
  }
}
};

  return (
    <div className=" mb-8 mx-auto text-center">
    <h2 className="text-black text-4xl font-extrabold">Polling Submission</h2>
    <p className="text-gray-800 text-sm mt-4 leading-relaxed"></p>
    <section className="py-10 my-auto dark:bg-surface-dark">
    <div className="lg:w-[80%] md:w-[90%] xs:w-[96%] mx-auto flex gap-4">
        <div
            className="lg:w-[88%] md:w-[80%] sm:w-[88%] xs:w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-white">
            <div className="">
                <form 
                ref={form}
                value={details}
                onChange={e => setDetails(e.target.value)}
                onSubmit={handleSubmit(onSubmit)}>
                        <h1
                    className="lg:text-3xl md:text-2xl sm:text-xl xs:text-xl font-serif font-extrabold mb-2 dark:text-black">
                    Agent Details
                </h1>
                        <div>
                        </div>
                         {/* Employee number*/}
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full  mb-4 mt-6">
                            <label htmlFor="number" className="mb-2 dark:text-black">Name:</label>
                            <input type="text"
                                    className="mt-2 p-4 w-full border-2 rounded-lg dark:text-black dark:border-black dark:bg-white"
                                    placeholder="Type Employee Number"
                                        {...register("number")}
                                    />
                                    {errors.number &&<em className="text-red-500">
                                    {errors.number.message}</em>}
                                    {errors.number?.type === "minLength" &&<em className="text-red-500">
                                        Type Employee Number</em>}
                        </div>
                    </div> 
                     {/* SURname & Firstname*/}
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">
                        <div className="w-full  mb-4 mt-6">
                            <label htmlFor="surname" className="mb-2 dark:text-black">Confirmation Number:</label>
                            <input type="text"
                                    className="mt-2 p-4 w-full border-2 rounded-lg dark:text-black dark:border-black dark:bg-white"
                                    placeholder="Type surname here"
                                        {...register("surname")}
                                    />
                                    {errors.surname &&<em className="text-red-500">
                                    {errors.surname.message}</em>}
                                    {errors.surname?.type === "minLength" &&<em className="text-red-500">
                                        Type surname</em>}
                        </div>
                        {/* Firstname*/}
                        <div className="w-full  mb-4 mt-6">
                            <label htmlFor="first_name" className="mb-2 dark:text-black">VIU Reciept Number:</label>
                            <input type="text"
                                    className="mt-2 p-4 w-full border-2 rounded-lg dark:text-black dark:border-black dark:bg-white"
                                    placeholder="Type first name here"
                                        {...register("first_name")}
                                    />
                                    {errors.first_name &&<em className="text-red-500">
                                    {errors.first_name.message}</em>}
                                    {errors.first_name?.type === "minLength" &&<em className="text-red-500">
                                        Type First Name</em>}
                        </div>
                    </div> 
                     {/* Other Name & employee_date_of_birth*/}
                    <div className="flex lg:flex-row md:flex-col sm:flex-col xs:flex-col gap-2 justify-center w-full">  
                     {/* Other Name*/}
                     <div className="w-full  mb-4 mt-6">
                            <label htmlFor="other_name" className="mb-2 dark:text-black"> Telephone Number:</label>
                            <input type="text"
                                    className="mt-2 p-4 w-full border-2 rounded-lg dark:text-black dark:border-black dark:bg-white"
                                    placeholder="Type Other Name"
                                    {...register("other_name")}  
                                    />
                                     {errors.other_name &&<em className="text-red-500">
                                    {errors.other_name.message}</em>}
                                    {errors.other_name?.type === "minLength" &&<em className="text-red-500">
                                        Required</em>}
                        </div>
                          {/* Date Of Birth */}
                          <div className="w-full mb-4 mt-6">
                            <label htmlFor="employee_date_of_birth" className="dark:text-black mb-2">Date Of Confirmation</label>
                            <input className="text-black mt-2 p-4 w-full border-2 rounded-lg dark:text-black dark:border-gray-600 bg-white"  type="date"
                                   id="employee_date_of_birth"  {...register("employee_date_of_birth")}/>
                        </div>
                        </div>
                     
                    <div className="w-full rounded-lg bg-orange-500 mt-4 text-white text-lg font-semibold">
                        <button type="submit" className="w-full p-4">Submit</button>
                    </div>
                </form>
                 {/* Display error message if it exists */}
      {errorMessage && (
        <div className="error-message" style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}
         {/* Display success message if exists */}
      {successMessage && (
        <div className="text-3xl text-green-700">
          {successMessage}
        </div>
      )}
            </div>
        </div>
    </div>
</section>
</div>
  )
}

export default NOKForm;
