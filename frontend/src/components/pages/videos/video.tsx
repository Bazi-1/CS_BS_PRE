import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import VideoService from '../../../services/VideoServices.tsx';
import { IconButton, Box, Container, Typography, Card, Modal, TextField } from "@mui/material";
import SessionService from '../../../services/SessionsServices.tsx';
import NoteService from '../../../services/NotesServices.tsx';
import { getLocalStorageUser } from '../../../utils/localStorageUtils.tsx';
import AddIcon from '@mui/icons-material/Add';
import { addUserNote } from '../../../store/notes/notesSlice.tsx';
import { RootState, AppDispatch } from "../../../store/types.tsx";
import { useDispatch } from 'react-redux';

interface VideoProps {
    course_id: number;
    sessionId: number | null;
    onVideoEnd: () => void;
}

export interface VideoRef {
    playVideo: () => void;
}

const Video = forwardRef<VideoRef, VideoProps>(({ course_id, sessionId, onVideoEnd }, ref) => {
    const [videoPath, setVideoPath] = React.useState<string | null>(null);
    const [courseName, setCourseName] = React.useState<string | null>(null);
    const [description, setDescription] = React.useState<string | null>(null);
        const dispatch = useDispatch<AppDispatch>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showNotes, setShowNotes] = useState(false);
    const [noteText, setNoteText] = useState("");
    const [noteTitle, setNoteTitle] = useState("");
    const user_id = getLocalStorageUser()?.user_id;

    useImperativeHandle(ref, () => ({
        playVideo: () => {
            videoRef.current?.play();
        },
    }));

    useEffect(() => {
        const fetchVideo = async () => {
            if (sessionId === null) return;
            try {
                const res = await VideoService.getVideoPathByCourseId(course_id);
                const session = res.data.sessions.find((s: any) => s.session_id === sessionId);
                if (session) {
                    setVideoPath(`http://localhost:3001/uploads/${session.video_url[0]?.video_url}`);
                    setCourseName(res.data.name);
                    setDescription(res.data.description);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchVideo();
    }, [sessionId, course_id]);

    const handleAddNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        const formData = { noteTitle, noteText, user_id: user_id as number, sessionId: sessionId as number };
        await dispatch(addUserNote(formData)).unwrap(); // unwrap() throws on error
        setShowNotes(false);
        setNoteText("");
        setNoteTitle("");
    } catch (error) {
        console.error('Failed to add note', error);
    }
};


    const handleVideoEnd = async () => {
        if (sessionId === null) return;
        try {
            const response = await SessionService.completeSession(sessionId);
            onVideoEnd();
        } catch (error) {
            console.error('Error completing session:', error);
        }
    };

    return (
        <Container >
            <Typography variant="h4">{courseName}</Typography>
            {videoPath && (
                <Box mt={2} sx={{ position: 'relative' }}>
                    <video
                        ref={videoRef}
                        src={videoPath}
                        controls
                        onEnded={handleVideoEnd}
                        style={{ width: '100%', borderRadius: 8 }}
                    />

                    {/* Add Note Button */}
                    <IconButton
                        onClick={() => setShowNotes(true)}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'white',
                            color: '#7B1FA2', // purple color
                            border: '2px solid #7B1FA2',
                            transition: '0.3s',
                            '&:hover': {
                                backgroundColor: '#E1BEE7', // light purple on hover
                                color: 'white',
                            },
                            boxShadow: 3,
                        }}
                    >
                        <AddIcon />
                    </IconButton>

                    <Box mt={2}>
                        <Typography variant="h5" style={{ textAlign: 'center' }}>Description</Typography>
                        <Typography style={{ fontSize: '18px' }}>{description}</Typography>
                    </Box>
                    {/* Note Modal */}
                    <Modal open={showNotes} onClose={() => setShowNotes(false)}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100vh',
                                backgroundColor: 'rgba(0,0,0,0.3)', // soft dark background
                            }}
                        >
                            <Card
                                sx={{
                                    width: 500,
                                    p: 4,
                                    borderRadius: 4,
                                    boxShadow: 6,
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5F5 100%)', // light purple gradient
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    position: 'relative',
                                    animation: 'fadeIn 0.5s ease-in-out', // smooth animation
                                }}
                            >
                                <TextField
                                    fullWidth
                                    placeholder="Title"
                                    variant="outlined"
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    placeholder="Take a note..."
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                />
                                <form onSubmit={handleAddNote}>
                                    <IconButton
                                        type="submit"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 16,
                                            right: 16,
                                            backgroundColor: '#7B1FA2',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#9C27B0',
                                            },
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </form>
                            </Card>
                        </Box>
                    </Modal>


                </Box>
            )}
        </Container>
    );
});

export default Video;

