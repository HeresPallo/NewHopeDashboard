import { Link } from "react-router-dom";


const OverviewCard = () => {
    return (
        <div className="max-w-full mb-8 mx-auto text-center">

        <h2 className="text-black text-4xl font-extrabold">Welcome to the HR Request App</h2>
        <p className="text-gray-800 text-sm mt-4 leading-relaxed"></p>
   
        <div className="flex flex-col rounded-lg bg-white text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white md:max-w-xl md:flex-row">

</div>

{/* PR User Flow */}
  <div className="container mx-auto p-4">
         <img src="public/PR User Flow.png" alt="Payment Request User flow" />
        </div>

        {/* PR User Flow */}
  <div className="container mx-auto p-4">
         <img src="public/NOK User Flow FINAL.png" alt="Next of Kin Submission User flow" />
        </div>
  
<div className="mt-12"></div>
 </div>
 
    );
};

export default OverviewCard;
