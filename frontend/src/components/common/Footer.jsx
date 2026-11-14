import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/frontend_assets/assets'

const Footer = () => {
  return (
    <div className='flex flex-col gap-6 '>
        <div className='flex flex-col mt-16 gap-6 items-center sm:items-start text-center sm:grid sm:grid-cols-3 lg:w-11/12'>
            <div className='flex flex-col text-center items-center gap-6 mb-4'>
                <Link to='/'>
                    <img src={assets.logo} width={200} />
                </Link>
                
                <p className='text-[18px] text-[#595959]'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </p>
            </div>

            <div className='text-[18px] text-[#595959] flex flex-col gap-4'>
                <h2 className='text-[22px] font-semibold text-[#5A5A5A] uppercase'>Company</h2>
                <div className='flex gap-4 sm:flex-col sm:gap-3'>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/about'}>About Us</Link>
                    <Link to={'/'}>Delivery</Link>
                    <Link to={'/'}>Privacy Policy</Link>
                </div>
            </div>

            <div className='flex gap-2 text-[18px] text-[#595959] flex-col'>
                <h2 className='text-[22px] font-semibold text-[#5A5A5A] uppercase'>Get in touch</h2>
                <div className='flex gap-2 text-[18px] text-[#595959] flex-col'>
                    {/* Phone link (always include country code) */}
                    <a href="tel:+9112121733314">+91 12127 33314</a>

                    {/* Email link */}
                    <a href="mailto:adinathkulkarni86@gmail.com">adinathkulkarni86@gmail.com</a>
                </div>
            </div>
        </div>

        <div className='border-t-[1.5px] border-[#BDBDBD] py-6 text-[#565656] text-center'>
            <p>Copyright 2026 © AdinathKulkarni - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
