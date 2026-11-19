import { useState } from 'react'
import axios from 'axios'
import Newsletter from '../components/Newsletter';
import { toast } from 'react-hot-toast';

const Login = ({setLoginToken}) => {
  
  const [currentState, setCurrentState] = useState('Login');
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  const sendOtpHandler = async () => {
    if (!loginFormData.email) {
      toast.error('Enter your email before requesting a verification code');
      return;
    }

    try {
      setOtpSending(true);
      const response = await axios.post('http://localhost:4000/api/user/send-otp', {
        email: loginFormData.email,
      });

      if (!response.data.success) {
        toast.error(response.data.message || 'Unable to send verification code');
        return;
      }

      setOtp('');
      setOtpSent(true);
      toast.success(response.data.message || 'Verification code sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send verification code');
    } finally {
      setOtpSending(false);
    }
  };

  const submitHandler = async(e) => {
    e.preventDefault();

    try {
      const backendURL = 'http://localhost:4000';
      const isSignUp = currentState === 'Sign Up';
      if (isSignUp && !otpSent) {
        toast.error('Send a verification code to your email before signing up');
        return;
      }

      const endpoint = isSignUp ? 'register' : 'login';
      const payload = isSignUp
        ? { name: loginFormData.name, email: loginFormData.email, password: loginFormData.password, otp }
        : { email: loginFormData.email, password: loginFormData.password };
      const response = await axios.post(`${backendURL}/api/user/${endpoint}`, payload);

      if (!response.data.success) {
        toast.error(response.data.message || 'Unable to sign in');
        return;
      }

      if (!response.data.token) {
        toast.error('The server did not return an authentication token');
        return;
      }

      setLoginToken(response.data.token);
      toast.success(response.data.message || (isSignUp ? 'Account created' : 'Login successful'));
    } catch (error) {
      console.error('Authentication request failed:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  }

  const handleLoginChange = (e) => {
    const {name, value} = e.target;

    setLoginFormData( (prev) => ({
      ...prev, 
      [name]: value,
    }) );

    if (name === 'email') {
      setOtp('');
      setOtpSent(false);
    }
  }

  return (
    <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

     {currentState === 'Sign Up' ? <input
      id='name'
      name='name'
      placeholder='Name'
      type='text'
      required
      onChange={handleLoginChange}
      className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      /> : ''} 

      <input
      id='email'
      name='email'
      placeholder='Email'
      type='email'
      required
      autoComplete='email'
      onChange={handleLoginChange}
      value={loginFormData.email}
      className='w-full focus:outline-none border border-gray-800 px-3 py-2'
      />

      {currentState === 'Sign Up' && (
        <>
          <button
            type='button'
            onClick={sendOtpHandler}
            disabled={otpSending}
            className='w-full border border-gray-800 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {otpSending ? 'Sending code...' : otpSent ? 'Resend verification code' : 'Send verification code'}
          </button>
          <input
            name='otp'
            type='text'
            inputMode='numeric'
            pattern='[0-9]{6}'
            maxLength={6}
            required
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder='6-digit verification code'
            autoComplete='one-time-code'
            className='w-full focus:outline-none border border-gray-800 px-3 py-2'
          />
        </>
      )}

      <input
      id='password'
      name='password'
      placeholder='Password'
      type='password'
      required
      minLength={currentState === 'Sign Up' ? 8 : undefined}
      autoComplete={currentState === 'Sign Up' ? 'new-password' : 'current-password'}
      onChange={handleLoginChange}
      value={loginFormData.password}
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