import { assets } from '../../assets/admin_assets/assets'
import {Link} from 'react-router'

const Navbar = ({setToken}) => {

  return (
    <div className='flex items-center py-2 px-[4%] justify-between border-b border-b-gray-300'>
        <Link to={'/'} >
            <img 
            src={assets.logo}
            className='w-[130px] sm:w-[max(10%, 80px)]'
            />
        </Link>
        <button
        onClick={() => setToken('')}
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full'
        >Logout</button>
    </div>
  )
}

export default Navbar