import React, { useState } from 'react'

const Newsletter = ({ message = 'Join the Forever community for product updates, styling ideas, and exclusive offers.' }) => {

    const [newsLetterEmail, setNewsLetterEmail] = useState('');

    const newsLetterHandler = (e) => {
        setNewsLetterEmail(e.target.value);
        console.log(newsLetterEmail);
    }

    const subscribeHandler = (e) => {
        e.preventDefault();
    }

  return (
    <div className='flex flex-col mb-10 items-center'>
        <div className='flex flex-col mb-4 items-center'>
            <h2 className='text-[28px] font-medium mb-4'>Subscribe now & get 20% off</h2>
            <p className='text-[16px] text-[#9A9A9A] text-center'>{message}</p>
        </div>

        <div className='flex sm:w-4/5 w-full'>
            <input
            className='border border-[#C7C7C7] px-2 py-4 focus-within:outline-none sm:w-2/3 w-full'
            placeholder='Enter your email id'
            type='email'
            value={newsLetterEmail}
            onChange={newsLetterHandler}
            />

            <button 
            className='bg-black text-white py-4 px-2 sm:w-2/6 w-2/3'
            onSubmit={subscribeHandler}
            >
                Subscribe
            </button>
        </div>
    </div>
  )
}

export default Newsletter
