import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Title from '../components/Title'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [sending, setSending] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            setSending(true);
            const response = await axios.post('http://localhost:4000/api/user/forgot-password/send-otp', { email });
            if (!response.data.success) {
                toast.error(response.data.message || 'Unable to send a reset code');
                return;
            }
            toast.success(response.data.message);
            navigate('/verify-otp', { state: { email }, replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to send a reset code');
        } finally {
            setSending(false);
        }
    };

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>

        <div className='text-3xl mb-16'>
            <Title text1={'Forgot'} text2={' Password'} />
        </div>

        <form onSubmit={submitHandler} className='w-full space-y-4 text-center'>
            <p className='text-start'>Enter your email:</p>
            <input
            name='email'
            id='email'
            type='email'
            placeholder='Enter your email'
            autoComplete='email'
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className='w-full focus:outline-none border border-gray-800 px-3 py-2'
            />
            <button disabled={sending} className='bg-black text-white w-full px-3 py-3 font-medium disabled:opacity-60'>
                {sending ? 'Sending code...' : 'Verify Email'}
            </button>
        </form>
        
    </div>
  )
}

export default ForgotPassword
