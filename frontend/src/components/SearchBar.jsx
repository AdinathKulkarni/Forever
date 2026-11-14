import React, { useContext } from 'react'
import {ShopContext} from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'

const SearchBar = () => {

    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);

  return showSearch ? (
    <div className='border-t border-b bg-gray-50 text-center transition ease-in-out'>
        <div className='inline-flex items-center justify-center border-gray-400 
        px-5 py-4 mx-3 rouded-3 w-3/4 sm:w-1/2 rounded-full'>
            <input 
            placeholder='Search'
            type='text'
            onChange={(e) => {setSearch(e.target.value)}}
            className='flex-1 border py-2 px-3 outline-none border-gray-500 
            bg-inherit text-sm rounded-full'
            />
            {/* <img src={assets.search_icon} className='w-4' /> */}
        </div>

        <img 
        src={assets.cross_icon}
        onClick={() => {setShowSearch(false)}}
        className='w-3 inline cursor-pointer'
        />
    </div>
  ) : null
}

export default SearchBar