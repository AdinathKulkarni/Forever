import React from 'react'
import { assets } from '../assets/frontend_assets/assets'

const OurPolicy = () => {
  return (
    <div 
    className='flex flex-col sm:flex-row justify-around gap-12 
                md:gap-2 text-center py-20 text-xs sm:text-sm md:text-base 
              text-gray-700'
    >
        <div>
            <img 
            src={assets.exchange_icon}
            className='w-12 m-auto mb-5'
            />
            <p className='text-[18px] text-[#373737] font-semibold mb-2'>Easy Exchange Policy</p>
            <p className='text-[18px] text-[#898989]'>We offer hassle free  exchange policy</p>
        </div>

        <div>
            <img 
            src={assets.quality_icon}
            className='w-12 m-auto mb-5'
            />
            <p className='text-[18px] text-[#373737] font-semibold mb-2'>7 Days Return Policy</p>
            <p className='text-[18px] text-[#898989]'>We provide 7 days free return policy </p>
        </div>

        <div>
            <img 
            src={assets.support_img}
            className='w-12 m-auto mb-5'
            />
            <p className='text-[18px] text-[#373737] font-semibold mb-2'>Best Customer Support</p>
            <p className='text-[18px] text-[#898989]'>We provide 24/7 customer support</p>
        </div>
    </div>
  )
}

export default OurPolicy