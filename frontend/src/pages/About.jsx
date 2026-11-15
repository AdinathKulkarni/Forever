import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import Newsletter from '../components/Newsletter'

const About = () => {
  return (
    <div className='mt-12'>
      <div className='flex flex-col mb-12 items-center'>
          <div className='text-3xl'>
            <Title text1={'About '} text2={'Us'} />
          </div>
          
         <div className='flex flex-col sm:flex-row space-y-6 gap-8'>
             {/* Image div */}
             <div className='w-full sm:w-[50%] md:w-[50%] lg:w-[40%]'>
              <img src={assets.about_img} className=''/>
            </div>

            <div className='flex-col space-y-6 sm:w-[50%]'>
              <div className=' space-y-4'>
                {/* <h2 className='text-2xl font-medium text-[#4E4E4E]'>Our Store</h2> */}
                <p className='text-[18px] text-[#6D6D6D]'>
                  Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. 
                  Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
                </p>

                <p className='text-[18px] text-[#6D6D6D]'>
                  Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. 
                  From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.
                </p>
              </div>

              <div className='space-y-3'>
              <h2 className='text-2xl font-medium text-[#4E4E4E]'>Our Mission</h2>
              <p className='text-[18px] text-[#6D6D6D]'>
                Our mission at Forever is to empower customers with choice, convenience, and confidence. 
                We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
              </p>
            </div>
            </div>
         </div>
      </div>

      <div className='gap-7'>
        <div className='text-3xl'>
          <Title text1={'Why '} text2={'Choose Us'} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3'>
          <div className='border border-gray-200 p-8 m-auto'>
            <div className='font-medium text-[#2A2A2A]'>
              <p>Quality Assurance:</p>
            </div>

            <p className='text-[#6D6D6D]'>We meticulously select and vet each product to ensure it meets our stringent quality standards</p>
          </div>

          <div className='border border-gray-200 p-8 m-auto'>
            <div className='font-medium text-[#2A2A2A]'>
              <p>Convenience: </p>
            </div>

            <p className='text-[#6D6D6D]'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier. </p>
          </div>

          <div className='border border-gray-200 p-8 m-auto'>
            <div className='font-medium text-[#2A2A2A]'>
              <p>Customer Service:</p>
            </div>

            <p className='text-[#6D6D6D]'>Our team of dedicated professionals is here to assist you the way, your satisfaction is our top priority.</p>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <Newsletter />
      </div>
    </div>
  )
}

export default About