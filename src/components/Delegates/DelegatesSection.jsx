import { useEffect, useState } from 'react';
import axios from 'axios';
import DelegatesCard from "./DelegatesCard";
import { Button } from '@react-email/components';


const DelegatesSection = () => {


    const [submissions, setSubmissions] = useState([]);

    // Submission API
     useEffect(() => {
      axios.get('http://localhost:5001/delegatesorgan/')
        .then(response => setSubmissions(response.data))
        .catch(error => console.error('Error fetching submissions:', error));
    }, []);


return (
        <div className="flex pt-2 bg-gray-200 min-h-screen justify-center items-start">
            <div>
                <h1 className="text-2xl font-bold mb-4">Delegates</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {submissions.map(submission => (
                        <div key={submission.id}> {/* Replace `submission.id` with the actual unique identifier */}
                            <DelegatesCard
                                title={submission.title}
                                delegateamount={submission.delegateamount}
                                lastengagement={submission.lastengagement}
                            />
                           
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};



export default DelegatesSection;
