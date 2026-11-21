import React from 'react'
import { useState } from 'react';
import { assets } from '../../assets/admin_assets/assets';
import { Link, useLocation } from 'react-router';
import { IoBagOutline } from "react-icons/io5";

const Sidebar = () => {

    const [visible, setVisible] = useState(false);
    const { pathname } = useLocation();

  return (
    <div className=''>
        
        <div 
          className='sm:hidden pt-5 pl-3'
          onClick={()  => {setVisible(!visible)}}
          >
            {
              !visible ? (<img 
              className='-scale-x-100'
              src={assets.menu_icon} width={27} 
              />) : 
              (
              <div className='flex text-[18px] gap-x-2 font-medium items-center'>
                <img 
                  src={assets.cross_icon} className='w-4 h-4' 
                />
                <p>Back</p>
              </div>
              )
            }
        </div>

      <div className={`${visible ? 'w-screen grid-rows-[1fr] py-6 opacity-100 visible' : 
        'w-0 grid-rows-[0fr] py-0 opacity-0 invisible'} grid overflow-hidden border-r
         border-r-gray-300 transition-all duration-300 ease-in-out sm:w-auto sm:visible 
         sm:grid-rows-[1fr] sm:py-0 sm:overflow-visible sm:opacity-100 sm:min-w-[200px] sm:min-h-screen`}>
        <div className='min-h-0 overflow-hidden sm:overflow-visible'>

        <Link to={'/'} 
        onClick={() => setVisible(false)}
        className={`flex gap-3 border-b border-b-gray-300 p-3
        ${pathname === '/' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}
         >
        <img src={assets.add_icon} width={25} className={`${pathname === '/' ? 'invert' : ''}`} />
          <p className='font-medium text-[18px]'>Add Items</p>
        </Link>

        <Link to={'/list-items'} 
        onClick={() => setVisible(false)}
        className={`flex gap-3 border-b border-b-gray-300 p-3
        ${pathname === '/list-items' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}
         >
          <img src={assets.order_icon} width={25} className={`${pathname === '/list-items' ? 'invert' : ''}`} />
          <p className='font-medium text-[18px]'>List Items</p>
        </Link>

        <Link to={'/orders'} 
        onClick={() => setVisible(false)}
        className={`flex gap-3 border-b border-b-gray-300 p-3
        ${pathname === '/orders' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600'}`}
         >
          <IoBagOutline className={`${pathname === '/orders' ? 'text-white text-[25px]' : 'text-gray-600 text-[25px]'}`} />
          <p className='font-medium text-[18px]'>Orders</p>
        </Link>

        </div>
      </div>
        
    </div>
  )
}

export default Sidebar
