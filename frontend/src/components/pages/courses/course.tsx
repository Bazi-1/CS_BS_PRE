// Courses_Page.tsx
import "../../../styles/course.css";
import {
    React,
    useEffect,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControlLabel,
    ExpandMoreIcon,
    useNavigate
} from "../../imports/imports.tsx";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store.tsx';
import {
    fetchCourses,
    enrollCourse,
    setSelectedLanguages,
    selectCourse,
    clearMessage
} from '../../../store/courses/coursesSlice.tsx';
import { BannerWithSearch } from "../../imports/services.tsx";

const languageOptions = [
    { label: "English", count: 134 },
    { label: "Português", count: 86 },
    { label: "Español", count: 85 },
    { label: "Türkçe", count: 30 },
    { label: "العربية", count: 26 },
    { label: "Français", count: 25 },
    { label: "日本語", count: 24 },
    { label: "Русский", count: 18 },
    { label: "Deutsch", count: 10 },
    { label: "Italiano", count: 9 },
    { label: "हिंदी", count: 4 },
    { label: "中文", count: 4 },
    { label: "Bangla", count: 2 }
];

const Courses_Page: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {
        filteredCourses,
        selectedLanguages,
        selectedCourse,
        message,
        snackbarSeverity,
        isEnrolling,
        loading
    } = useSelector((state: RootState) => state.courses);

    const { courses, error } = useSelector((state: RootState) => state.banner);


    useEffect(() => {
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleLanguageChange = (language: string) => {
        let updatedLanguages = [...selectedLanguages];
        if (updatedLanguages.includes(language)) {
            updatedLanguages = updatedLanguages.filter(l => l !== language);
        } else {
            updatedLanguages.push(language);
        }
        dispatch(setSelectedLanguages(updatedLanguages));
    };

    const handleEnroll = async (course_id: string) => {
        await dispatch(enrollCourse(course_id));
        setTimeout(() => dispatch(clearMessage()), 3000);
    };

    const handleClickOpen = (course: any) => {
        dispatch(selectCourse(course));
    };

    const handleClose = () => {
        dispatch(selectCourse(null));
    };

    return (
        <div className="courses-page">
            <BannerWithSearch />

            <div className="container mt-4">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-md-3 mb-4">
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Language</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {languageOptions.map((lang) => (
                                    <FormControlLabel
                                        key={lang.label}
                                        control={
                                            <Checkbox
                                                checked={selectedLanguages.includes(lang.label)}
                                                onChange={() => handleLanguageChange(lang.label)}
                                            />
                                        }
                                        label={`${lang.label} (${lang.count})`}
                                    />
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    </div>

                    {/* Courses */}
                    <div className="col-md-9">
                        {loading ? (
                            <h4 className="text-center mt-4">Loading courses...</h4>
                        ) : filteredCourses.length > 0 ? (
                            courses.map((course) => (
                                <div key={course.course_id} className="mb-4">
                                    <div
                                        className="udemy-style-card"
                                        onClick={() => handleClickOpen(course)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div
                                            className="udemy-style-image"
                                            style={{ backgroundImage: `url(http://localhost:3001/uploads/${course.image})` }}
                                        ></div>

                                        <div className="udemy-style-details">
                                            <h3>{course.name?.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}</h3>
                                            <p className="desc">{course.description}</p>
                                            <p className="instructor">👨‍🏫 {course.instructor}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h4 className="text-center mt-4">No courses available right now! Please try again later.</h4>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedCourse && (
                <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
                    <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold' }}>
                            {selectedCourse.name?.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="course-modal-content" style={{ display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', textAlign: 'center' }}>
                                <img
                                    src={`http://localhost:3001/uploads/${selectedCourse.image}`}
                                    alt={selectedCourse.name}
                                    style={{ width: "100%", maxWidth: "300px", borderRadius: "10px" }}
                                />
                            </div>
                            <div style={{ flex: '2' }}>
                                <p style={{ fontSize: "16px", color: "#555" }}>{selectedCourse.description}</p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                    <p><strong>👨‍🏫 Instructor:</strong> {selectedCourse.instructor}</p>
                                    <p style={{ marginRight: '10%' }}><strong>⭐ Rating:</strong> {selectedCourse.rating || 4.5} / 5</p>
                                </div>
                                <p><strong>🌐 Language:</strong> {selectedCourse.language || "English"}</p>
                                <p><strong>🏫 Num Lect:</strong> 9</p>
                                <p><strong>⏱ Duration:</strong> {selectedCourse.duration || "1hr 30min"}</p>
                                <p><strong>👥 Students:</strong> {selectedCourse.students || "N/A"}</p>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
                            <div style={{ display: "flex", gap: "12px", marginBottom: "10px", marginLeft: "80%" }}>
                                <Button
                                    onClick={handleClose}
                                    variant="outlined"
                                    style={{ fontWeight: "500", fontSize: "15px", padding: "6px 14px", borderRadius: "6px" }}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => handleEnroll(selectedCourse.course_id)}
                                    disabled={isEnrolling}
                                    style={{ backgroundColor: isEnrolling ? '#ddd' : '#f48024', color: 'black', fontWeight: '600', fontSize: '15px', padding: '6px 14px', borderRadius: '6px', cursor: isEnrolling ? 'not-allowed' : 'pointer' }}
                                >
                                    {isEnrolling ? 'Enrolling...' : 'Enroll'}
                                </Button>
                            </div>
                            <p className={`text-sm font-normal transition-all duration-300 ${snackbarSeverity === 'error' ? 'text-red-600' : 'text-green-600'}`} style={{ marginTop: "5px", textAlign: "center", marginLeft: "80%" }}>
                                {message}
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Courses_Page;
