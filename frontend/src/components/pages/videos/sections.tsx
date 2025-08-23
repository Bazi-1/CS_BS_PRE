import React, { useState, useEffect } from 'react';
import SectionService from '../../../services/Sections.tsx';
import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    IconButton,
    Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { InfoOutlined } from '@mui/icons-material';


interface Session {
    session_id: number;
    title: string;
    completed: boolean;
}

interface Section {
    section_id: number;
    title: string;
    sessions: Session[];
}

interface SectionsProps {
    course_id: number;
    sessionId: number | null;
    setSessionId: (id: number) => void;
    completedSessions: { [sessionId: number]: boolean };
    onFirstSessionLoaded: (id: number) => void;
    setCompletedSessions: (sessions: { [sessionId: number]: boolean }) => void;
}
const Sections: React.FC<SectionsProps> = ({ course_id, sessionId, setSessionId, completedSessions, setCompletedSessions, onFirstSessionLoaded }) => {
    const completedMap: { [id: number]: boolean } = {};

    const [sections, setSections] = useState<Section[]>([]);
    const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({});


    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await SectionService.getSections(course_id);
                const fetchedSections = response.data.sections || [];

                const completedIds: number[] = [];

                const cleanedSections = fetchedSections.map((section: Section) => {
                    const cleanedSessions = section.sessions.map((session) => {
                        completedMap[session.session_id] = session.completed;
                        return session;
                    });

                    return {
                        ...section,
                        sessions: cleanedSessions,
                    };
                });


                setSections(cleanedSections);
                setCompletedSessions(completedMap);
                onFirstSessionLoaded(cleanedSections[0].sessions[0].session_id);

                const initialExpandedState = cleanedSections.reduce((acc: any, section: Section) => {
                    acc[section.section_id] = false;
                    return acc;
                }, {});
                setExpandedSections(initialExpandedState);
            } catch (error) {
                console.error('Failed to fetch sections:', error);
            }
        };
        fetchSections();
    }, [course_id]);

    const toggleSection = (section_id: number) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section_id]: !prev[section_id],
        }));
    };


    return (

        <Container sx={{ maxWidth: '300px', marginTop: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                Course Content
            </Typography>

            {sections.length === 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        padding: 3,
                        border: '1px dashed #ccc',
                        borderRadius: 2,
                        backgroundColor: '#f9f9f9',
                        textAlign: 'center',
                        marginTop: 3,
                    }}
                >
                    <Typography variant="body1" color="textSecondary">
                        There are no sections or sessions available for this course yet.
                    </Typography>
                </Paper>
            )}

            {sections.map((section) => (

                <Paper
                    key={section.section_id}
                    sx={{
                        padding: 2,
                        marginBottom: 2,
                        borderRadius: 2,
                        boxShadow: 'none',
                        border: '1px solid #e0e0e0',
                        backgroundColor: 'white',
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        onClick={() => toggleSection(section.section_id)}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {section.title} (
                            {
                                section.sessions.filter(s => completedSessions[s.session_id]).length
                            }/{section.sessions.length})
                        </Typography>

                        <IconButton size="small">
                            {expandedSections[section.section_id] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </Box>

                    <Collapse in={expandedSections[section.section_id]} timeout="auto" unmountOnExit>
                        {section.sessions.map((session, idx) => {
                            const sessionIsCompleted = completedSessions[session.session_id];
                            const canBePlayed =
                                idx === 0 || completedSessions[section.sessions[idx - 1]?.session_id];
                            return (
                                <Box
                                    key={session.session_id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 1,
                                        paddingLeft: 2,
                                    }}
                                >
                                    <Typography variant="body2" color="textSecondary">
                                        {session.title}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: sessionIsCompleted ? '#e1bee7' : '#f3e5f5', // light purple if completed, even lighter if not
                                            color: sessionIsCompleted || canBePlayed ? '#5e35b1' : '#9e9e9e', // stronger purple or gray text
                                            boxShadow: 'none',
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: sessionIsCompleted ? '#d1c4e9' : '#e1bee7', // deeper light purple on hover
                                            },
                                        }}
                                        onClick={() => {
                                            if (canBePlayed || sessionIsCompleted) {
                                                setSessionId(session.session_id);
                                            }
                                        }}
                                        disabled={!canBePlayed && !sessionIsCompleted}
                                    >
                                        {
                                            sessionIsCompleted
                                                ? 'Rewatch'
                                                : canBePlayed
                                                    ? 'Play'
                                                    : 'Locked'}
                                    </Button>
                                </Box>
                            );
                        })}

                    </Collapse>
                </Paper>
            ))}

        </Container>
    );
};

export default Sections;
