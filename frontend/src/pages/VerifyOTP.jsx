import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import Title from '../components/Title';
import { BACKEND_URL } from '../api'

const VerifyOTP = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    const [email, setEmail] = useState(state?.email || '');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const resendHandler = async () => {
        try {
            setSubmitting(true);
            const response = await axios.post(`${BACKEND_URL}/api/user/forgot-password/send-otp`, { email });
            if (!response.data.success) {
                toast.error(response.data.message || 'Unable to send a new code');
                return;
            }
            setOtp('');
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to send a new code');
        } finally {
            setSubmitting(false);
        }
    };

    const verifyHandler = async (event) => {
        event.preventDefault();
        try {
            setSubmitting(true);
            const response = await axios.post(`${BACKEND_URL}/api/user/forgot-password/verify-otp`, { email, otp });
            if (!response.data.success) {
                toast.error(response.data.message || 'Unable to verify code');
                return;
            }
            setResetToken(response.data.resetToken);
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to verify code');
        } finally {
            setSubmitting(false);
        }
    };

    const resetHandler = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            setSubmitting(true);
            const response = await axios.post(`${BACKEND_URL}/api/user/forgot-password/reset`, { resetToken, password });
            if (!response.data.success) {
                toast.error(response.data.message || 'Unable to update password');
                return;
            }
            toast.success(response.data.message);
            navigate('/login', { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update password');
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>

        <div className='text-3xl mb-16'>
            <Title text1={resetToken ? 'Update' : 'Verify'} text2={resetToken ? ' Password' : ' OTP'} />
        </div>

        {!resetToken ? (
            <form onSubmit={verifyHandler} className='w-full space-y-4 text-center'>
                <p className='text-start'>Enter your email:</p>
                <input
                    name='email'
                    id='email'
                    type='email'
                    autoComplete='email'
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='Enter your email'
                    className='w-full focus:outline-none border border-gray-800 px-3 py-2'
                />
                <p className='text-start'>Enter the 6-digit code:</p>
                <input
                    name='otp'
                    id='otp'
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]{6}'
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    autoComplete='one-time-code'
                    placeholder='6-digit verification code'
                    className='w-full focus:outline-none border border-gray-800 px-3 py-2'
                />
                <button disabled={submitting} className='bg-black text-white w-full px-3 py-3 font-medium disabled:opacity-60'>
                    {submitting ? 'Verifying...' : 'Verify Code'}
                </button>
                <button type='button' disabled={submitting} onClick={resendHandler} className='w-full text-sm underline disabled:opacity-60'>
                    Resend code
                </button>
            </form>
        ) : (
            <form onSubmit={resetHandler} className='w-full space-y-4 text-center'>
                <p className='text-start'>Enter your new password:</p>
                <input
                    type='password'
                    autoComplete='new-password'
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder='New password (at least 8 characters)'
                    className='w-full focus:outline-none border border-gray-800 px-3 py-2'
                />
                <input
                    type='password'
                    autoComplete='new-password'
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder='Confirm new password'
                    className='w-full focus:outline-none border border-gray-800 px-3 py-2'
                />
                <button disabled={submitting} className='bg-black text-white w-full px-3 py-3 font-medium disabled:opacity-60'>
                    {submitting ? 'Updating password...' : 'Update Password'}
                </button>
            </form>
        )}
        
    </div>
  )
}

export default VerifyOTP
