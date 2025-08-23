import MeService from "../../../../../services/MeServices.tsx";
import { Course } from "../../interfaces/course.tsx";

export const fetchCourses = async (user_id: number, setMyCourses: (courses: Course[]) => void) => {
    try {
        const response = await MeService.getMyCourses(user_id);
        setMyCourses(response.data.mycourses);
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
};

