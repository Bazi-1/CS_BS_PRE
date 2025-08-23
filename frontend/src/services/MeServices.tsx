import http from "./http-common.tsx";

const getMyCourses = (user_id)=>{
    return http.get("/myCourses/mycourse",{params:{user_id}});
}

const deleteCourse = (user_id,course_id)=>{
    return http.delete(`/myCourses/delete/${user_id}/${course_id}`)
}

const withdrawCourse = (course_id, user_id) => {
    return http.post('/courses/withdraw', { course_id },{params:{user_id}});
};

const MeService = {
    getMyCourses,
    withdrawCourse,
    deleteCourse
}

export default MeService;