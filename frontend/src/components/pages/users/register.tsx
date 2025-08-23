import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AppDispatch, RootState } from '../../../store/store.tsx';
import { registerUser, clearMessage } from '../../../store/auth/authSlice.tsx';

const RegisterButton = styled(Button)({
    background: 'linear-gradient(135deg, #1a2a6c, #4CAF50)',
    color: 'white',
    padding: '10px 20px',
    marginTop: '20px',
    borderRadius: '20px',
    '&:hover': {
        background: 'linear-gradient(135deg, #a8e063, #56ab2f)',
    },
});

const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [profilePic, setProfilePic] = useState<File | null>(null);

    const { message, error, loading } = useSelector((state: RootState) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfilePic(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        if (profilePic) {
            data.append('profilepic', profilePic);
        }

        await dispatch(registerUser(data));
    };

    useEffect(() => {
        if (message.includes('success')) {
            setTimeout(() => {
                dispatch(clearMessage());
                navigate('/login');
            }, 2000);
        }
    }, [message, dispatch, navigate]);



    return (
        <div>
            <div style={{ height: '126%' }} className="bg-white overflow-hidden"></div>
            <IconButton
                sx={{ marginTop: '4%', position: 'absolute', top: 20, left: 20, color: 'black' }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>
            <div style={{ paddingTop: '20px', paddingBottom: '20px' }} className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
                <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
                    <div className="self-start hidden lg:flex flex-col text-black-300">
                        <h1 className="my-3 font-semibold text-4xl">Create Account</h1>
                        <p className="pr-3 text-sm opacity-75">
                            Unlock your potential with our interactive learning platform. Whether you're a beginner or looking to enhance your skills, our courses are designed to guide you step-by-step, providing hands-on experience
                            to help you master new concepts faster and more effectively. Join us and take the next step in your learning journey today!
                        </p>
                    </div>
                </div>

                <div style={{ paddingTop: '60px' }} className="flex justify-center self-center z-10">
                    <div className="p-12 bg-white mx-auto rounded-3xl w-96">
                        <div className="mb-7">
                            <h3 className="font-semibold text-2xl text-gray-800">Sign Up</h3>
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <a href="/login" className="text-sm text-purple-700 hover:text-purple-700">
                                    Sign In
                                </a>
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <input
                                        name="username"
                                        onChange={handleChange}
                                        value={formData.username}
                                        className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                                        type="text"
                                        placeholder="Username"
                                    />
                                </div>
                                <div>
                                    <input
                                        name="email"
                                        onChange={handleChange}
                                        value={formData.email}
                                        className="w-full text-sm px-4 py-3 bg-gray-200 focus:bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                                        type="email"
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        name="password"
                                        onChange={handleChange}
                                        value={formData.password}
                                        type="password"
                                        className="text-sm text-gray-800 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                                        placeholder="Password"
                                    />
                                </div>

                                {/* Profile Picture Upload */}
                                <div className="relative">

                                    <input
                                        type="file"
                                        id="profilePic"
                                        name="profilepic"
                                        onChange={handleFileChange}
                                        className="text-sm text-gray-800 px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-purple-400"
                                    />
                                </div>

                                <div>
                                    <RegisterButton type="submit" fullWidth disabled={loading}>
                                        {loading ? 'Signing Up...' : 'Sign Up'}
                                    </RegisterButton>
                                </div>
                                <div className="mt-3 text-center">
                                    {/* Feedback Messages */}
                                    {message && (
                                        <p className="text-center text-green-600 text-sm mt-2">{message}</p>
                                    )}
                                    {error && Array.isArray(error) && (
                                        <ul className="text-sm text-red-600 mt-4 space-y-2 list-disc pl-5">
                                            {error.map((errMsg: string, idx: number) => (
                                                <li key={idx}>{errMsg}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
