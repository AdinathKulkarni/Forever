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
              <div className='flex text-[18px] gap-x-3 font-medium '>
                <img 
                  src={assets.cross_icon} width={28} 
                />
                <p>Close Menu</p>
              </div>
              )
            }
        </div>

      <div className={`${visible ? 'block w-screen py-6' : 'hidden'} sm:block border-r border-r-gray-300 sm:min-w-[200px] min-h-screen`}>

        <Link to={'/add-products'} 
        onClick={() => setVisible(false)}
        className={`flex gap-3 border-b border-b-gray-300 p-3
        ${pathname === '/add-products' ? 'bg-pink-200 text-black' : 'bg-white text-gray-600'}`}
         >
        <img src={assets.add_icon} width={25} />
          <p className='font-medium text-[18px]'>Add Items</p>
        </Link>

        <Link to={'/list-items'} 
        onClick={() => setVisible(false)}
        className={`flex gap-3 border-b border-b-gray-300 p-3
        ${pathname === '/list-items' ? 'bg-pink-200 text-black' : 'bg-white text-gray-600'}`}
         >
          <img src={assets.order_icon} width={25} />
          <p className='font-medium text-[18px]'>List Items</p>
        </Link>

        <Link to={'/orders'} 
        onClick={() => setVisible(false)}
        className={`flex gap-3 border-b border-b-gray-300 p-3
        ${pathname === '/orders' ? 'bg-pink-200 text-black' : 'bg-white text-gray-600'}`}
         >
          <IoBagOutline className='text-[25px] text-black' />
          <p className='font-medium text-[18px]'>Orders</p>
        </Link>

      </div>
        
    </div>
  )
}

export default Sidebar
