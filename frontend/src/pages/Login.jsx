import {React, useState } from 'react'
import Newsletter from '../components/Newsletter';

const Login = () => {
  
  const [currentState, setCurrentState] = useState('Login');

  const submitHandler = async(e) => {
    e.preventDefault();
  }

  return (
    <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

     {currentState === 'Sign Up' ? <input
      id='name'
      placeholder='Name'
      type='text'
      required
      className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      /> : ''} 

      <input
      id='email'
      placeholder='Email'
      type='text'
      required
      className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      <input
      id='password'
      placeholder='Password'
      type='password'
      required
      className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      {
        currentState === 'Login' ? 
        (
          <div className='w-full flex justify-between text-sm font-medium mt-[-8px]'>
            <p className='cursor-pointer'>Forgot your Password ?</p>
            <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create an Account</p>
          </div>
        ) : 
        (<div className='w-full flex justify-end text-sm font-medium mt-[-8px]'>
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Already a user ? Login</p>
        </div>)
      }

      <div className='bg-black text-white font-medium px-3 py-2'>
        <button>{currentState}</button>
      </div>

      <div className='mt-20'>
        <Newsletter />
      </div>

    </form>
  )
}

export default Login