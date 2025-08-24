import http from "./http-common.tsx";

const getCourses = (user_id) => {
  return http.post('/graphql', {
    query: `
      query GetCourses($user_id: Int!) {
        getCourses(user_id: $user_id) {
          course_id
          name
          description
          image
          user_id
          num_lectures
          total_duration_seconds
        }
      }
    `,
    variables: { user_id },
  });
};


const searchCourses = (name, user_id) => {
    return http.get(`/courses/search?name=${encodeURIComponent(name)}&user_id=${user_id}`);
};

const addCourse = async (formData, user_id) => {
    formData.append("user_id", user_id);
    const sectionsData = formData.get("sections");
    return http.post("/courses/addCourse", formData);
};

const deleteCourse = (course_id: string) => {
    return http.delete('/courses/delete', { params: { course_id } });
};

const getCourse = (course_id: number) => {
    return http.get(`/courses/getCourse`, { params: { course_id } })
}

const updateCourse = (course_id, formData) => {
    return http.put(`/courses/update/${course_id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const CoursesService = {
    getCourses,
    getCourse,
    addCourse,
    deleteCourse,
    updateCourse,
    searchCourses
}


export default CoursesService;
