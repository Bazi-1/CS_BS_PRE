import { Alert } from '@mui/material';
import {React,Typography, TextField, Button, Snackbar, IconButton,useNavigate,ArrowBackIcon} from '../../imports/imports.tsx'
import "../../../styles/contact.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useDispatch, useSelector } from "react-redux";
import { sendContactMessage, clearAlert } from "../../../store/help/contactSlice.tsx";
import { RootState, AppDispatch } from "../../../store/store.tsx";
import { getLocalStorageUser } from '../../imports/utility.tsx';

const Contact: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const username = getLocalStorageUser()?.username;
    const email = getLocalStorageUser()?.email;
    const { alertMessage, alertSeverity } = useSelector((state: RootState) => state.contact);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const data = {
            username: username || '',
            email: email || '',
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        };
        dispatch(sendContactMessage(data));
    };

    return (
        <div>
            {/* Background section */}
            <div className="bg-gradient-to-b from-purple-200 to-purple-400 h-80" style={{ backgroundColor: 'gray' }}></div>
            <IconButton
                sx={{ marginTop: '4%', position: 'absolute', top: 20, left: 20, color: 'black' }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>
            {/* Main form section */}
            <div className="max-w-3xl mx-auto px-4 sm:px-4 lg:px-6 mb-8">
                <div className="bg-white w-full shadow rounded p-6 sm:p-8 -mt-60">
                    <Typography variant="h6" component="p" className="text-2xl font-bold leading-6 text-center">
                        Get in Touch With Us
                    </Typography>

                    <form id="add-message-form" onSubmit={handleSubmit}>
                        <div className="md:flex items-center mt-6">
                            <div className="w-full flex flex-col">
                                <label className="font-semibold leading-none">Subject</label>
                                <TextField
                                    name="subject"
                                    placeholder="Subject"
                                    variant="outlined"
                                    required
                                    size="small" // Smaller size
                                    className="leading-none text-gray-900 mt-3 bg-gray-100 border rounded border-gray-200"
                                />
                            </div>
                        </div>

                        <div className="w-full flex flex-col mt-6">
                            <label className="font-semibold leading-none">Message</label>
                            <TextField
                                name="message"
                                placeholder="Your Message"
                                multiline
                                rows={3}
                                required
                                variant="outlined"
                                size="small" // Smaller size
                                className="text-base leading-none text-gray-900 mt-3 bg-gray-100 border rounded border-gray-200"
                            />
                        </div>

                        <div className="flex items-center justify-center w-full">
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                style={{ padding: '10px', backgroundColor: '#0d431c', color: 'rgb(16, 227, 55)', marginTop: '10px', }}
                            >
                                Send Message
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Snackbar for alert messages */}
            <Snackbar
                open={Boolean(alertMessage)}
                autoHideDuration={6000}
                onClose={() => dispatch(clearAlert())}
            >
                <Alert onClose={() => dispatch(clearAlert())} severity={alertSeverity}>
                    {alertMessage}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default Contact;
