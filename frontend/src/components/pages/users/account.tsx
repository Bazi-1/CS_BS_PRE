import '../../../styles/account.css';
import { IconButton, React, useEffect, useState } from '../../imports/imports.tsx'
import { getLocalStorageUser } from '../../imports/utility.tsx';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store.tsx';
import { setUserFromLocalStorage } from '../../../store/auth/userSlice.tsx';

const Account: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { username,profilePic: profilePicName } = useSelector(
        (state: RootState) => state.user
    );

    const [profilePic, setProfilePic] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setUserFromLocalStorage());
    }, [dispatch]);

    useEffect(() => {
        if (profilePicName) {
            const fetchProfilePic = async () => {
                try {
                    const imageModule = await import(
                        `../../../../../backend/public/Profiles_Pic/${profilePicName}`
                    );
                    setProfilePic(imageModule.default);
                } catch (error) {
                    console.error('Error fetching profile picture:', error);
                }
            };
            fetchProfilePic();
        }
    }, [profilePicName]);

    const handleCardClick = () => {
        navigate('/MyCourses');
    };

    const handleNotesClick = () => {
        navigate('/YourNotes');
    };

    return (
        <div className='prof-body'>
            <IconButton
                sx={{ marginTop: '4%', position: 'absolute', top: 20, left: 20, color: 'black' }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>
            <div className="account-container">
                <h1 className="account-title">My account</h1>
                <div className="account-grid">
                    <Card
                        title="Your Courses"
                        description="Follow, view or pay your orders"
                        icon="🛍️"
                        onClick={handleCardClick}
                    />
                    <Card
                        title="Your Notes"
                        description="Edit, Delete your notes"
                        icon="📄"
                        onClick={handleNotesClick}
                    />
                </div>
                <div className="account-profile">
                    <div >
                        {profilePic ? <img className="profile-icon" src={profilePic} alt="Profile Pic" /> : <div className="profile-default-icon"></div>}
                    </div>
                    <div className="profile-name">{username}</div>
                    <a href="/profile" className="edit-link">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
                            alt="Edit"
                            className="edit-icon"
                        />
                        Edit information
                    </a>
                </div>
            </div>
        </div>
    );
};

interface CardProps {
    title: string;
    description: string;
    icon: string;
    onClick?: () => void; // Optional click handler
}

const Card: React.FC<CardProps> = ({ title, description, icon, onClick }) => {

    return (
        <div className="card" onClick={onClick} style={{ cursor: "pointer" }}>
            <div className="card-icon">{icon}</div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};


export default Account;
