const AuthLayout = ({ children }) => {
    return (
      <div className="min-h-screen flex lg:flex-row bg-gradient-to-br from-red-600 to-red-500 text-white p-6">
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 h-full p-10">
          <h1 className="text-5xl text-black font-extrabold">People <span className="text-white">First</span></h1>
          <div className="mt-36 ">
            <h1 className="text-3xl text-white font-bold">Our New Hope</h1>
          </div>
        </div>
        {/* Right Section (Login Form) */}
        <div className="w-full lg:w-1/2 flex items-center justify-start pl-20">
          <div className="w-full max-w-md">{/* Ensuring form is properly spaced */}
            {children}
          </div>
        </div>
      </div>
    );
};

export default AuthLayout;