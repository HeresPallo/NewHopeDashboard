import { useNavigate } from "react-router-dom";


const DelegatesCard = ({ title, delegateamount, lastengagement}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/admin/nationalwomencongress");
  };

    return (

<div className="relative min-h-80 w-full flex flex-col justify-center items-center my-6 bg-white shadow-sm border border-slate-200 rounded-lg p-2">
  <div className="p-3 text-center">
    <div className="flex justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-purple-400">
        
      </svg>
    </div>
    <div className="flex justify-center mb-2">
      <h5 className="text-slate-800 text-2xl font-semibold">
       {title}
      </h5>
    </div>
    <h1 className="block text-green-600 leading-normal font-bold mb-4 max-w-lg text-3xl">
    {delegateamount}
    </h1>
    <div className=" flex items-center">
    <p className=" p-8">{lastengagement}</p>
    <p className=" p-8">Last engagement </p>
    </div>
    
  </div>
</div>
    )
};



export default DelegatesCard;