import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/profile.css';
import { getLocalStorageUser } from '../../../utils/localStorageUtils.tsx';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store.tsx';
import { updateUserProfile, uploadProfilePic } from '../../../store/auth/authSlice.tsx';
import { Alert, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '@fortawesome/fontawesome-free/css/all.min.css';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({
        username: '',
        user_id: 0,
        password: '',
        email: '',
        profilePic: ''
    });

    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    const [showPassword, setShowPassword] = useState(false);
    const { user, message, error } = useSelector((state: RootState) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if (message) {
            setMessageType(user ? 'success' : 'error');
        }
    }, [message]);

    useEffect(() => {
        const user = getLocalStorageUser();
        if (user) {
            setUserProfile({
                username: user.username,
                email: user.email,
                password: user.password,
                profilePic: user.profilepic,
                user_id: user.user_id,
            });

            setProfilePic(`http://localhost:3001//Profiles_Pic/${user.profilepic}`);

        }
    }, []);

    const handleEdit = () => {
        setIsEditable(true);
    };
    const handleSave = async () => {
        const oldUser = getLocalStorageUser();
        if (!oldUser) return;

        const result = await dispatch(updateUserProfile({
            user_id: oldUser.user_id.toString(),
            username: userProfile.username,
            email: userProfile.email,
            password: userProfile.password,
            oldUser
        }));

        if ((result as any).type.includes('fulfilled')) {
            setIsEditable(false);
        }
    };

    const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const result = await dispatch(uploadProfilePic(file));
            const payload = (result as any).payload;
            if (payload?.newPicUrl) {
                setProfilePic(payload.newPicUrl);
            }
        }
    };


    const handleDiscard = () => {
        const user = getLocalStorageUser();
        if (user) {
            setUserProfile({
                username: user.username,
                email: user.email,
                password: user.password,
                profilePic: user.profilepic,
                user_id: user.user_id,
            });
        }
        setIsEditable(false);
    };

    if (!userProfile.username) return <div>Loading...</div>;

    return (
        <div className="profile-container">
            <IconButton
                sx={{ position: 'absolute', top: 20, left: 20, color: 'black' }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>

            <div className="profile-pic-center">
                <div className="profile-pic-wrapper">
                    {profilePic ? (
                        <>
                            <img className="profile-pic" src={profilePic} alt="Profile Pic" />
                            {isEditable && (
                                <>
                                    <label htmlFor="fileInput" className="camera-icon">
                                        <i className="fas fa-camera"></i>
                                    </label>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        name="newProfilePic"
                                        style={{ display: 'none' }}
                                        onChange={handleProfilePicChange}
                                    />
                                </>
                            )}
                        </>
                    ) : (
                        <div className="profile-default-icon">No Image</div>
                    )}
                </div>
            </div>

            <h2 className="title">Profile Details</h2>
            <div className="profile-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userProfile.username}
                        onClick={handleEdit}
                        onChange={(e) => setUserProfile({ ...userProfile, username: e.target.value })}
                        readOnly={!isEditable}
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={userProfile.email}
                        onClick={handleEdit}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        readOnly={!isEditable}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control"
                            value={userProfile.password}
                            onClick={handleEdit}
                            onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value })}
                            readOnly={!isEditable}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="button-group">
                <button className="btn discard-button" onClick={handleDiscard}>Discard</button>
                <button className="btn save-button" onClick={handleSave}>Save</button>
            </div>

            {message && (
                <div style={{ marginTop: '15px' }}>
                    <Alert severity={messageType}>{message}</Alert>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
