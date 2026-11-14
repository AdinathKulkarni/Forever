import { useContext, useEffect, useState } from 'react'
import {assets} from '../../assets/frontend_assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext';

const Navbar = () => {

    const [ visible, setVisible ] = useState(false);
    const {showSearch, setShowSearch} = useContext(ShopContext);
    const location = useLocation();

    useEffect( () => {
        if(location.pathname.includes('collection')){
            setShowSearch(true);
        }
        else{
            setShowSearch(false)
        }
    },[location] );

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
        <Link to={"/"}>
            <img src={assets.logo} className='w-36' />
        </Link>
        <ul className='hidden sm:flex text-gray-700 gap-7'>
            <NavLink to={'/'} className='flex flex-col items-center'>
                <p>Home</p>
                <hr className='w-2/3 h-[2px] bg-gray-800 hidden' />
            </NavLink>

            <NavLink to={'/collection'} className='flex flex-col items-center'>
                <p>Collection</p>
                <hr className='w-2/3  h-[2px] bg-gray-800 hidden' />
            </NavLink>

            <NavLink to={'/about'} className='flex flex-col items-center' >
                <p>About</p>
                <hr className='w-2/3  h-[2px] bg-gray-800 hidden' />
            </NavLink>

            <NavLink to={'/contact'} className='flex flex-col items-center' >
                <p>Contact</p>
                <hr className='w-2/3  h-[2px] bg-gray-800 hidden' />
            </NavLink>
        </ul>

        <div className='flex items-center gap-6'>
            
            <Link to={'/collection'}>
                <img 
                src={assets.search_icon} 
                className='w-5 cursor-pointer' 
                onClick={() => {setShowSearch(!showSearch)}}
                />
            </Link>

            <div className='relative group'>
                <img src={assets.profile_icon} className='w-5 cursor-pointer' />
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500'>
                        <p className='cursor-pointer hover:text-black'>My Profile</p>
                        <p className='cursor-pointer hover:text-black'>Orders</p>
                        <p className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>
            </div>

            <Link to='/cart' className='relative'>
                <img src={assets.cart_icon} className='w-5 min-w-5' />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-gray-200 aspect-square text-[8px]'>10</p>
            </Link>

            <img 
            src={assets.menu_icon} 
            className='sm:hidden w-5 cursor-pointer' 
            onClick={() => setVisible(true)}
            />

            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div
                    onClick={()=>setVisible(false)}  
                    className='flex items-center gap-4 p-3'>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180 ' />
                        <p>Back</p>
                    </div>

                    <div className='flex flex-col gap-8 justify-center items-center mt-32'>
                        <NavLink to={'/'} 
                        onClick={()=>setVisible(false)}  
                        className='flex flex-col items-center'>
                            <p>Home</p>
                            {/* <hr className='w-2/3 h-[1.5px] bg-gray-800 hidden gap-1' /> */}
                        </NavLink>

                        <NavLink 
                        to={'/collection'}
                        onClick={()=>setVisible(false)}
                        className='flex flex-col items-center gap-1'>
                            <p>Collection</p>
                            {/* <hr className='w-2/3 h-[1.5px] bg-gray-800 hidden' /> */}
                        </NavLink>

                        <NavLink 
                        to={'/about'} 
                        onClick={()=>setVisible(false)}
                        className='flex flex-col items-center gap-1' >
                            <p>About</p>
                            {/* <hr className='w-2/3 h-[1.5px] bg-gray-800 hidden' /> */}
                        </NavLink>

                        <NavLink 
                        to={'/contact'} 
                        onClick={()=>setVisible(false)}
                        className='flex flex-col items-center gap-1' >
                            <p>Contact</p>
                            {/* <hr className='w-2/3 h-[1.5px] bg-gray-800 hidden' /> */}
                        </NavLink>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar