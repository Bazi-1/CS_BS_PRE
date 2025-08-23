import React, { useState, useRef, useEffect } from 'react';
import Video, { VideoRef } from '../videos/video.tsx';
import Sections from '../videos/sections.tsx';
import CommentSection from '../videos/comments.tsx';
import { Container, Grid, Paper, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import SectionService from '../../../services/Sections.tsx';
import SessionService from '../../../services/SessionsServices.tsx';
import CoursesService from '../../../services/CoursesServices.tsx';

const CourseVideo = ({ course_id }: { course_id: number }) => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [completedSessions, setCompletedSessions] = useState<{ [sessionId: number]: boolean }>({});
    const videoComponentRef = useRef<VideoRef>(null);
    const [showStartScreen, setShowStartScreen] = useState(true);
    const [firstSessionId, setFirstSessionId] = useState<number | null>(null);
    const [course, setCourse] = useState<{ image: string } | null>(null);
    const [hasSessions, setHasSessions] = useState<boolean>(false);


    const handleSessionChange = (id: number) => {
        setSessionId(id);
        setTimeout(() => {
            videoComponentRef.current?.playVideo();
        }, 100);
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await CoursesService.getCourse(course_id);
                setCourse(res.data.course[0]);

            } catch (error) {
                console.error('Failed to load course data', error);
            }
        };
        fetchCourse();
    }, [course_id]);

    const handleVideoEnd = async () => {
        if (sessionId && !completedSessions[sessionId]) {
            setCompletedSessions((prev) => ({
                ...prev,
                [sessionId]: true,
            }));
        }
    };

    const backgroundImageUrl = course?.image
        ? `http://localhost:3001/uploads/${course.image}`
        : 'http://localhost:3001/images/learn.png';

    return (
        <Container>
            <IconButton onClick={() => navigate(-1)} sx={{ position: 'absolute', marginTop: '10px', left: 20 }}>
                <ArrowBackIcon />
            </IconButton>

            <Grid container spacing={3} sx={{ marginTop: 8 }}>
                <Grid item xs={12} md={8}>
                    {showStartScreen ? (
                        <Box
                            sx={{
                                position: 'relative',
                                width: '95%',
                                height: '380px',
                                backgroundImage: `url(${backgroundImageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 2,
                            }}
                        >
                            {hasSessions && (
                                <IconButton
                                    onClick={() => {
                                        if (firstSessionId) {
                                            setSessionId(firstSessionId);
                                            setShowStartScreen(false);
                                        }
                                    }}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                        borderRadius: '50%',
                                    }}
                                >
                                    <img
                                        src="http://localhost:3001/images/playIcon.png"
                                        alt="Play"
                                        style={{ width: 40, height: 40 }}
                                    />
                                </IconButton>
                            )}
                        </Box>
                    ) : (
                        <Video
                            ref={videoComponentRef}
                            course_id={course_id}
                            sessionId={sessionId}
                            onVideoEnd={handleVideoEnd}
                        />
                    )}

                </Grid>
                <Grid item xs={12} md={4}>
                    <Sections
                        course_id={course_id}
                        sessionId={sessionId}
                        setSessionId={handleSessionChange}
                        completedSessions={completedSessions}
                        setCompletedSessions={setCompletedSessions}
                        onFirstSessionLoaded={(id) => {
                            setFirstSessionId(id);
                            setHasSessions(true); // <-- sessions exist!
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ padding: 2, marginTop: 2, marginBottom: 3 }}>
                        <CommentSection course_id={course_id} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CourseVideo;
