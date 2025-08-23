import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper, TextField, Button, Typography, FormControl, InputLabel,
    Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

import { getLocalStorageUser } from "../../../utils/localStorageUtils.tsx";
import { CoursesService } from "../../imports/services.tsx";
import { useDispatch, useSelector } from 'react-redux';
import {
    updateFormData, setImage, setSections, setCurrentSection,
    setSectionName, setNumLectures, updateSessionName,
    setSessionVideo, saveSection, setMessage
} from '../../../store/courses/courseFormSlice.tsx';
import { AppDispatch, RootState } from '../../../store/store.tsx';

// Styled Components
const SessionContainer = styled("div")(() => ({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginTop: "40px",
    background: "#f3e5f5",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(179, 157, 219, 0.2)",
}));

const SectionContainer = styled("div")({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "25px",
    width: "100%",
});


const SessionCard = styled(Paper)(() => ({
    padding: "25px",
    textAlign: "center",
    background: "#ffffff",
    color: "#333",
    borderRadius: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 20px rgba(179, 157, 219, 0.15)",

    '&:hover': {
        background: "#ede7f6",
        boxShadow: "0 8px 25px rgba(103, 58, 183, 0.25)",
        transform: "translateY(-5px)",
    },
}));

const SectionCard = styled(Paper)(() => ({
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    background: "linear-gradient(135deg, #ce93d8, #b39ddb)",
    color: "white",
    borderRadius: "16px",
    transition: "0.3s ease",

    "&:hover": {
        background: "linear-gradient(135deg, #ba68c8, #9575cd)",
    },
}));

const SectionButton = styled(Button)(() => ({
    background: 'linear-gradient(135deg, #ab47bc, #7e57c2)',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '10px',
    margin: '20px auto',
    display: 'block',

    '&:hover': {
        background: 'linear-gradient(135deg, #8e24aa, #5e35b1)',
    },
}));

const StyledTextField = styled(TextField)(() => ({
    backgroundColor: '#fff',
    borderRadius: '10px',
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#b39ddb',
        },
        '&:hover fieldset': {
            borderColor: '#9575cd',
        },
    },
}));

const StyledImage = styled('img')({
    width: '40%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '10px',
});

const ImageWrapper = styled('div')({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
});

const StyledNumberInput = styled(Select)({
    width: "100px",
    textAlign: "center",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "white",
});

const AddCourseContainer = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '40px 20px',
    backgroundColor: '#f3e5f5',
    color: '#333',
}));

const AddCourseButton = styled(Button)(() => ({
    background: 'linear-gradient(135deg, #7e57c2, #ce93d8)',
    color: 'white',
    padding: '14px 28px',
    marginTop: '30px',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '16px',
    '&:hover': {
        background: 'linear-gradient(135deg, #5e35b1, #ba68c8)',
    },
}));



const AddCourse = () => {
    const [numSections, setNumSections] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [openSessionModal, setOpenSessionModal] = useState(false);

    const user = getLocalStorageUser();
    const user_id = user?.user_id;
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
        formData, sections, currentSection, sectionName,
        numLectures, sessions, message
    } = useSelector((state: RootState) => state.courseForm);

    useEffect(() => {
        const stored = localStorage.getItem('sections');
        if (stored) dispatch(setSections(JSON.parse(stored)));
    }, [dispatch]);

    useEffect(() => {
        if (sections.length > 0) {
            localStorage.setItem('sections', JSON.stringify(sections));
        }
    }, [sections]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(updateFormData({ name, value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            dispatch(setImage(e.target.files[0]));
        }
    };

    const handleAddSection = () => {
        const newSec = `Section ${sections.length + 1}`;
        dispatch(setSections([...sections, newSec]));
        dispatch(setCurrentSection(newSec));
        dispatch(setSectionName(newSec));
        setOpenModal(true);
    };

    const handleSaveSection = () => {
        if (!currentSection || sectionName.trim() === '') {
            dispatch(setMessage({ message: "Section title is missing!", color: "red" }));
            return;
        }
        dispatch(saveSection());
        setOpenModal(false);
    };

    const handleSessionNameChange = (section: string, index: number, name: string) => {
        dispatch(updateSessionName({ section, index, name }));
    };

    const handleVideoUpload = (section: string, index: number, file: File) => {
        dispatch(setSessionVideo({ section, index, video_url: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append("name", formData.name);
        form.append("description", formData.description);
        if (formData.image) form.append("image", formData.image);

        const structured = sections.map(sec => ({
            title: sec,
            sessions: sessions[sec]?.map(s => ({
                name: s.name,
                video_url: s.video_url.name,
            })) || [],
        }));

        form.append("sections", JSON.stringify(structured));

        Object.entries(sessions).forEach(([section, list]) => {
            list.forEach((s, idx) => {
                if (s.video_url instanceof File) {
                    form.append(`video_url`, s.video_url);
                }
            });
        });

        try {
            const res = await CoursesService.addCourse(form, user_id);
            if (res.status === 201) navigate("/Courses");
            else {
                dispatch(setMessage({ message: res.data.message, color: "red" }));
            }
        } catch (err: any) {
            dispatch(setMessage({ message: err.response?.data?.message || 'Error occurred', color: "red" }));
        }
    };

    const handleSectionChange = (e: any) => {
        setNumSections(e.target.value);
    };

    const handleAddSections = () => {
        const newSections = Array.from({ length: numSections }, (_, i) => `Section ${i + 1}`);
        dispatch(setSections(newSections));
    };

    const handleSectionClick = (section: string) => {
        dispatch(setCurrentSection(section));
        dispatch(setSectionName(section));
        setOpenModal(true);
        setOpenSessionModal(true);
    };

    const handleClose = () => setOpenModal(false);

    return (
        <AddCourseContainer>
            <IconButton sx={{ position: 'absolute', top: 20, left: 20 }} onClick={() => navigate(-1)}>
                <ArrowBackIcon />
            </IconButton>

            <ImageWrapper>
                <StyledImage src="http://localhost:3001/images/learn.png" alt="Course Thumbnail" />
            </ImageWrapper>

            <Typography variant="h4" gutterBottom>Add a New Course</Typography>

            <form onSubmit={handleSubmit}>
                <StyledTextField
                    fullWidth
                    label="Course Name"
                    name="name"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Course Description"
                    name="description"
                    variant="outlined"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                <Typography variant="body2" color={formData.description.length > 75 ? 'error' : 'textSecondary'}>
                    {formData.description.length}/150 characters
                </Typography>
                <input type="file" accept="image/*" name="image" onChange={handleFileChange} />

                <FormControl>
                    <InputLabel>Sections</InputLabel>
                    <StyledNumberInput value={numSections} onChange={handleSectionChange}>
                        {Array.from({ length: 200 }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                        ))}
                    </StyledNumberInput>
                </FormControl>

                <SectionButton onClick={handleAddSections}>Add Sections</SectionButton>

                <SectionContainer>
                    {sections.map((section, index) => (
                        <SectionCard key={index} onClick={() => handleSectionClick(section)}>
                            {section}
                        </SectionCard>
                    ))}
                </SectionContainer>

                <Dialog open={openModal} onClose={handleClose}>
                    <DialogTitle>Edit {currentSection}</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Section Name"
                            value={sectionName}
                            onChange={(e) => dispatch(setSectionName(e.target.value))}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Number of Lectures</InputLabel>
                            <StyledNumberInput value={numLectures} onChange={(e) => dispatch(setNumLectures(Number(e.target.value)))}>
                                {Array.from({ length: 50 }, (_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                                ))}
                            </StyledNumberInput>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">Cancel</Button>
                        <Button onClick={handleSaveSection} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>

                {Object.entries(sessions).map(([section, sessionList]) => (
                    <div key={section}>
                        <Typography variant="h6">{section}</Typography>
                        <SessionContainer>
                            {sessionList.map((session, index) => (
                                <SessionCard key={index}>
                                    <TextField
                                        fullWidth
                                        label="Session Name"
                                        value={session.name}
                                        onChange={(e) => handleSessionNameChange(section, index, e.target.value)}
                                    />
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => e.target.files?.[0] && handleVideoUpload(section, index, e.target.files[0])}
                                    />
                                </SessionCard>
                            ))}
                        </SessionContainer>
                    </div>
                ))}

                <AddCourseButton type="submit">Submit Course</AddCourseButton>
            </form>
        </AddCourseContainer>
    );
};

export default AddCourse;
