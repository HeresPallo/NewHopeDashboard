
const FundRaiserCard = () => {
  

    return (
      <div className="mt-24">
   <div className="w-[598px] h-[498px] p-6 bg-white rounded-xl shadow-[0px_4px_30px_0px_rgba(131,98,234,0.05)] border border-[#e6e6e6] flex-col justify-start items-start gap-6 inline-flex overflow-hidden">
    <div className="self-stretch justify-start items-start gap-3 inline-flex">
        <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
            <div className="self-stretch text-[#161616] text-2xl font-semibold font-['Poppins']">Fundraising Locations</div>
            <div className="text-[#8c8c8c] text-sm font-normal font-['Poppins'] leading-tight tracking-tight">Based on Country</div>
        </div>
        <div className="w-5 h-5 justify-center items-center flex overflow-hidden">
            <div className="w-[3.33px] h-5 relative">
            </div>
        </div>
    </div>
    <div className="h-[188px] relative bg-[#f9f9fc] rounded-lg  overflow-hidden">
        <div className="w-[575px] h-[246px] left-[-12px] top-[4px] absolute  overflow-hidden" />
        <div className="left-[8px] top-[148px] absolute justify-start items-start gap-2 inline-flex">
            <div className="p-1.5 bg-[#e6e6e6] rounded-lg justify-center items-center gap-1 flex overflow-hidden">
                <div className="w-5 h-5 p-2 justify-center items-center gap-2 flex">
                    <div className="w-4 h-4 relative  overflow-hidden" />
                </div>
            </div>
            <div className="p-1.5 bg-[#e6e6e6] rounded-lg justify-center items-center gap-1 flex overflow-hidden">
                <div className="w-5 h-5 p-2 justify-center items-center gap-2 flex">
                    <div className="w-4 h-4 relative  overflow-hidden" />
                </div>
            </div>
        </div>
    </div>
    <div className="self-stretch justify-between items-start inline-flex">
        <div className="flex-col justify-start items-start gap-[18px] inline-flex">
            <div className="justify-center items-center gap-3 inline-flex">
                <div className="w-10 h-10 relative  overflow-hidden">
                    <div className="w-10 h-10 left-0 top-0 absolute">
                    </div>
                </div>
                <div className="justify-start items-center gap-4 flex">
                    <div className="w-[88px] text-[#202226] text-sm font-semibold font-['Poppins'] leading-tight tracking-tight">USA</div>
                    <div className="text-[#161616] text-sm font-medium font-['Poppins'] leading-[18px] tracking-tight">$850.00</div>
                </div>
            </div>
            <div className="justify-center items-center gap-3 inline-flex">
                <div className="w-10 h-10 relative rounded-[100px]  overflow-hidden">
                    <div className="w-10 h-10 left-0 top-0 absolute">
                    </div>
                    <img className="w-[77px] h-[62px] left-[-11px] top-[-4px] absolute" src="https://via.placeholder.com/77x62" />
                </div>
                <div className="justify-start items-center gap-4 flex">
                    <div className="w-[88px] text-[#202226] text-sm font-semibold font-['Poppins'] leading-tight tracking-tight">UK</div>
                    <div className="w-[70px] text-[#161616] text-sm font-medium font-['Poppins'] leading-[18px] tracking-tight">€654.00</div>
                </div>
            </div>
            <div className="justify-center items-center gap-3 inline-flex">
                <div className="w-10 h-10 relative  overflow-hidden" />
                <div className="justify-start items-center gap-4 flex">
                    <div className="w-[88px] text-[#202226] text-sm font-semibold font-['Poppins'] leading-tight tracking-tight">France</div>
                    <div className="w-14 text-[#161616] text-sm font-medium font-['Poppins'] leading-[18px] tracking-tight">F321.00</div>
                </div>
            </div>
        </div>
        <div className="flex-col justify-start items-start gap-[18px] inline-flex">
            <div className="justify-center items-center gap-[23px] inline-flex">
                <div className="rounded-[100px] justify-center items-center flex overflow-hidden">
                    <img className="w-32 h-[109px]" src="https://via.placeholder.com/128x109" />
                </div>
                <div className="justify-start items-center flex">
                    <div className="w-[88px] text-[#202226] text-sm font-semibold font-['Poppins'] leading-tight tracking-tight">SL</div>
                    <div className="w-[95px] text-[#161616] text-sm font-medium font-['Poppins'] leading-[18px] tracking-tight">NLE 13578.00</div>
                </div>
            </div>
            <div className="justify-center items-center gap-3 inline-flex">
                <div className="w-10 h-10 relative  overflow-hidden">
                    <div className="w-[29.33px] h-[23.33px] left-[5.34px] top-[8.34px] absolute">
                    </div>
                </div>
                <div className="justify-start items-center gap-4 flex">
                    <div className="text-[#202226] text-sm font-semibold font-['Poppins'] leading-tight tracking-tight">South Korea</div>
                    <div className="w-[65px] text-[#161616] text-sm font-medium font-['Poppins'] leading-[18px] tracking-tight">₩246.00</div>
                </div>
            </div>
            <div className="justify-center items-center gap-3 inline-flex">
                <div className="w-10 h-10 relative  overflow-hidden">
                    <div className="w-10 h-10 left-0 top-0 absolute">
                    </div>
                </div>
                <div className="justify-start items-center flex">
                    <div className="w-[88px] text-[#202226] text-sm font-semibold font-['Poppins'] leading-tight tracking-tight">Others</div>
                    <div className="text-[#161616] text-sm font-medium font-['Poppins'] leading-[18px] tracking-tight">NLE9876.00</div>
                </div>
            </div>
        </div>
    </div>
</div>
      </div>
    );
  };
  
  export default FundRaiserCard;