import http from "./http-common.tsx";

const getEnrollmentCourses = (user_id)=>{
    return http.get("/enrollments/enrollment",{params:{user_id}});
}

const enrollStudent = (course_id,user_id)=>{
    return http.post("/enrollments/enroll",{course_id,user_id})
}

const EnrollmentCoursesService = {
    getEnrollmentCourses,
    enrollStudent
}

export default EnrollmentCoursesService;