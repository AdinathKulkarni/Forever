import { useState } from 'react'
import axios from 'axios'
import '../index.css'
import { assets } from '../assets/admin_assets/assets'
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../api'

const Login = ({setToken}) => {

  const [adminLoginFormdata, setAdminFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAdminFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const submitHandler = async(e) => {
    e.preventDefault();
    try{
      const response = await axios.post(
        `${BACKEND_URL}/api/user/admin`,
        {
          email: adminLoginFormdata.email,
          password: adminLoginFormdata.password,
        }
      );

      if(response.data.success){
        setToken(response.data.token)
        toast.success(response.data.message);
      }

    } catch(e){
      console.log('Error while login in')
      console.log(e.message);
      toast.error(e.response?.data?.message);
    }
  };

  return (
    <div className='h-screen overflow-hidden px-6'>
      <div className='flex flex-col mx-auto h-full justify-center items-center sm:max-w-[500px] gap-12'>
        <img src={assets.logo_copy} width={200} />
        <h1 className='text-3xl font-medium text-center '>Admin Panel</h1>

        <form className='flex flex-col gap-6 w-full' onSubmit={submitHandler}>
          <div className='flex flex-col gap'>
              <label>Email</label>
              <input 
              placeholder='Enter Admin email'
              id='email'
              type='email'
              required
              value={adminLoginFormdata.email}
              onChange={handleInputChange}
              className='outline-none px-2 py-4 prata-regular'
              />
          </div>

          <div className='flex flex-col gap'>
             <label>Password</label>
              <input 
              placeholder='Enter Admin password'
              id='password'
              type='password'
              required
              value={adminLoginFormdata.password}
              onChange={handleInputChange}
              className='outline-none px-2 py-4 prata-regular'
              />
          </div>

          <div className='text-center bg-black text-white py-3 font-medium text-[18px]'>
            <button type='submit'>Login</button>
          </div>
        </form>

        
      </div>
    </div>
  )
}

export default Login