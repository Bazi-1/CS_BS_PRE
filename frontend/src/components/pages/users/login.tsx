import React, { useState, useEffect, useContext } from 'react';
import { Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.tsx';
import { loginUser, clearMessage } from '../../../store/auth/authSlice.tsx';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const LoginButton = styled(Button)({
    background: 'linear-gradient(135deg, #1a2a6c, #4CAF50)',
    color: 'white',
    padding: '10px 20px',
    marginTop: '20px',
    borderRadius: '20px',
    '&:hover': {
        background: 'linear-gradient(135deg, #a8e063, #56ab2f)',
    },
});

const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { message, error, user, loading } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        if (user){
            window.location.href="/home";
        };
    }, [user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(clearMessage());
        }, 3000);
        return () => clearTimeout(timer);
    }, [message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div style={{ height: '100%' }} className="bg-white overflow-hidden"></div>
            <IconButton
                sx={{ marginTop: '4%', position: 'absolute', top: 20, left: 20, color: 'black' }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>
            <div className="relative min-h-screen sm:flex sm:flex-row justify-center bg-transparent rounded-3xl shadow-xl">
                <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
                    <div className="self-start hidden lg:flex flex-col text-black-300">
                        <h1 className="my-3 font-semibold text-4xl">Welcome back</h1>
                        <p className="pr-3 text-sm opacity-75">
                            Welcome back to LetsScale! We’re thrilled to see you again. Continue your journey with us and keep building
                            the skills that will help you scale new heights in learning and success!
                        </p>
                    </div>
                </div>

                <div style={{ paddingTop: '60px' }} className="flex justify-center self-center z-10">
                    <div className="p-12 bg-white mx-auto rounded-3xl w-96">
                        <div className="mb-7">
                            <h3 className="font-semibold text-2xl text-gray-800">Sign In</h3>
                            <p className="text-gray-400">
                                Don't have an account?{' '}
                                <a href="/Register" className="text-sm text-purple-700 hover:text-purple-700">
                                    Sign Up
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
                                <div className="flex items-center justify-between">
                                    <div className="text-sm ml-auto">
                                        <a href="#" className="text-purple-700 hover:text-purple-600">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <LoginButton type="submit" fullWidth disabled={loading}>
                                        {loading ? 'Loading...' : 'Login'}
                                    </LoginButton>
                                    <div className="mt-0 text-center">
                                        <p className={error ? 'text-red-500' : 'text-green-500'}>{message}</p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;