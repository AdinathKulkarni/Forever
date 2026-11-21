import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import Newsletter from '../components/Newsletter'

const Contact = () => {
  return (
    <div className='mt-12'>
      <div className='flex flex-col gap-6 items-center'>
          <div className='text-3xl'>
            <Title text1={'Contact '} text2={'Us'} />
          </div>
          
         <div className='flex flex-col sm:flex-row space-y-6 gap-8'>
             {/* Image div */}
            <div className='w-full sm:w-[50%] lg:w-[40%]'>
              <img src={assets.contact_img} className=''/>
            </div>

            <div className='flex-col space-y-6'>
              <div className=' space-y-3'>
                <h2 className='text-2xl font-medium text-[#4E4E4E]'>Our Store</h2>
                <p className='text-[18px] text-[#6D6D6D]'>
                  54709 Willms Station <br />
                  Suite 350, Washington, USA
                </p>

                <p className='text-[18px] text-[#6D6D6D]'>
                  +91 12127 33314 <br />
                  Email: adinathkulkarni86@gmail.com
                </p>
              </div>

              <div className='space-y-3'>
              <h2 className='text-2xl font-medium text-[#4E4E4E]'>Careers at Forever</h2>
              <p className='text-[18px] text-[#6D6D6D]'>
                Learn more about our teams and job openings.
              </p>

              <button className='bg-white text-black border border-black
              px-2 py-3 active:bg-black active:text-white transition ease-in-out
              '>
                Explore Jobs
              </button>
            </div>
            </div>

            

         </div>
      </div>

      <div className='mt-12'>
        <Newsletter message='Keep in touch with Forever for store news, service updates, and helpful shopping information.' />
      </div>
    </div>
  )
}

export default Contact
