import { React, useState, useEffect, IconButton, ArrowBackIcon, useNavigate } from '.././../imports/imports.tsx'
import { MeService, EnrollmentCoursesService } from '../../imports/services.tsx'
import CourseVideo from "../videos/courseVideo.tsx";
import { getLocalStorageUser } from "../../../utils/localStorageUtils.tsx";
import "../../../styles/course.css";


interface Enrollment {
    course_id: string;
    name: string;
    description: string;
    image: string;
}

const EnrolledCourses: React.FC = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const user_id = getLocalStorageUser()?.user_id;
    const navigate = useNavigate();
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [alertMessage, setAlertMessage] = useState<{
        message: string;
        type: "success" | "danger" | null;
    }>({ message: "", type: null });

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await EnrollmentCoursesService.getEnrollmentCourses(user_id);
                setEnrollments(response.data.enrollments);
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        };

        fetchEnrollments();
    }, [user_id]);

    const handleWithdraw = async (course_id: string) => {
        try {
            setSelectedCourseId(null);
            const response = await MeService.withdrawCourse(course_id, user_id);
            if (response.status === 200) {
                setEnrollments(enrollments.filter((e) => e.course_id !== course_id));

                setTimeout(() => {
                    navigate('/Enrollments');
                }, 6000);
            }
        } catch (error) {

        } finally {
            setTimeout(() => setAlertMessage({ message: "", type: null }), 3000);
        }
    };

    if (selectedCourseId) {
        return <CourseVideo course_id={Number(selectedCourseId)} />;
    }

    return (
        <div className="container mt-4">
            <IconButton
                sx={{ marginTop: '4%', position: 'absolute', top: 20, left: 20, color: 'black' }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>

            {/* ✅ Alert Message */}
            {alertMessage.message && (
                <div
                    className={`alert alert-${alertMessage.type}`}
                    role="alert"
                    style={{
                        position: "fixed",
                        top: "80px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1050,
                        width: "auto",
                        maxWidth: "90%",
                        textAlign: "center",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {alertMessage.message}
                </div>
            )}


            {enrollments.length > 0 ? (
                <>
                    <h1 className="heading mb-4 text-center">Enrolled Courses</h1>
                    <div className="row">
                        {enrollments.map((enrollment, index) => (
                            <div key={index} className="col-lg-4 col-md-6 mb-4">
                                <div
                                    className="udemy-style-card"
                                    onClick={() => setSelectedCourseId(enrollment.course_id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="course-card">
                                        <div
                                            className="udemy-style-image"
                                            style={{
                                                backgroundImage: `url(http://localhost:3001/uploads/${enrollment.image})`,
                                            }}
                                        ></div>
                                        <div className="withdraw-container">
                                            <button
                                                type="button"
                                                className="withdraw-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleWithdraw(enrollment.course_id);
                                                }}
                                            >
                                                Withdraw
                                            </button>
                                        </div>
                                    </div>


                                    <div className="udemy-style-details">
                                        <h3>{enrollment.name}</h3>
                                        <p className="desc">{enrollment.description}</p>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="no-courses-container text-center">
                    <h2 className="no-courses-message">
                        🚀 Ready to unlock your potential?
                    </h2>
                    <p className="add-course-suggestion">
                        Dive into exciting courses and start learning new skills today. Whether it's tech, design, or personal growth — your journey begins now!
                    </p>
                    <button
                        className="btn btn-primary mt-3"
                        style={{ fontSize: "1.1rem", padding: "10px 25px", background: "#ba68c8" }}
                        onClick={() => window.location.href = "/courses"}
                    >
                        🌟 Explore Courses Now
                    </button>
                </div>
            )
            }
        </div >
    );


}
export default EnrolledCourses
