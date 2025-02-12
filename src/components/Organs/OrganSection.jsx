import { useEffect, useState } from 'react';
import axios from 'axios';
import NationalWomenCongress from './NationalWomenCongress';

const OrganSection = () => {


    const [submissions, setSubmissions] = useState([]);

    // Submission API
     useEffect(() => {
      axios.get('http://localhost:5001/delegatesorgan/')
        .then(response => setSubmissions(response.data))
        .catch(error => console.error('Error fetching submissions:', error));
    }, []);


return (
        <div className="flex pt-2 bg-gray-200 min-h-screen justify-center items-start">
           <NationalWomenCongress/>
        </div>
    );
};



export default OrganSection;
