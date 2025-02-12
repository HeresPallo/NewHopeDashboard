import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full bg-white border-gray-200 dark:bg-black">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="http://localhost:5173/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="public/LOGO-Signature-Master-Right-White_RGB_EN.svg" className="h-8" alt="Orange Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Requestor</span>
                </a>
                <div className="items-center content-center hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-black md:dark:bg-black dark:border-black">
                     {/* <li>
                            <NavLink className="text-white" to='/'>Overview</NavLink>
                        </li> */}
                         {/* Payment Requests Link */}
                        <li className="relative group">
                            {/* Container for better hover */}
                            <div className="relative group">
                                <NavLink className="text-white p-4">Payment Requests</NavLink>
                                {/* Dropdown  */}
                                <ul className="absolute hidden group-hover:block group-focus:block bg-gray-50 border-gray-200 rounded-lg dark:bg-black mt-2 transition duration-300 ease-in-out delay-100">
                                    <li className="px-4 py-2">
                                        <NavLink className="text-black dark:text-white hover:text-orange-500" to='/payment/gsm'>GSM</NavLink>
                                    </li>
                                    <li className="px-4 py-2">
                                        <NavLink className="text-black dark:text-white hover:text-orange-500" to='/payment/om'>OM</NavLink>
                                    </li>
                                    <li className="px-4 py-2">
                                        <NavLink className="text-black dark:text-white hover:text-orange-500" to='/payment/fd'>Foundation</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <NavLink className="text-white" to='/nextofkin'>Next of Kin</NavLink>
                        </li>
                       {/* Phone Claim Link */}
                       <li className="relative group">
                            {/* Container for better hover */}
                            <div className="relative group">
                                <NavLink className="text-white p-4">Phone Claims</NavLink>
                                {/* Dropdown  */}
                                <ul className="absolute hidden group-hover:block group-focus:block bg-gray-50 border-gray-200 rounded-lg dark:bg-black mt-2 transition duration-300 ease-in-out delay-100">
                                    <li className="px-4 py-2">
                                        <NavLink className="text-black dark:text-white hover:text-orange-500" to='/phoneclaim'>GSM Phone Claim</NavLink>
                                    </li>
                                    <li className="px-4 py-2">
                                        <NavLink className="text-black dark:text-white hover:text-orange-500" to='/omphoneclaim'>OM Phone Claim</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <NavLink className="text-white" to='/insurance'>Medical Insurance</NavLink>
                        </li>
                        <li>
                            <NavLink className="text-white" to='/fiber'>Fiber</NavLink>
                        </li>
                          {/* Access Management */}
                       <li className="relative group">
                            {/* Container for better hover */}
                            <div className="relative group">
                                <NavLink className="text-white p-4">Access Management</NavLink>
                                {/* Dropdown  */}
                                <ul className="absolute hidden group-hover:block group-focus:block bg-gray-50 border-gray-200 rounded-lg dark:bg-black mt-2 transition duration-300 ease-in-out delay-100">
                                    <li className="px-4 py-2">
                                        <NavLink className="text-black dark:text-white hover:text-orange-500" to='/idcard'>ID Card Request</NavLink>
                                    </li>
                                    <li className="px-4 py-2">
                                        <NavLink className="text-black dark:text-white hover:text-orange-500" to='/absence'>Absence Report</NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
