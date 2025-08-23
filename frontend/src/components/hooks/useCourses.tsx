import { useEffect, useState } from "react";
import MeService from "../../services/MeServices.tsx";
import { Course } from "../types";

export const useCourses = (user_id?: number) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        if (!user_id) return;

        const fetchCourses = async () => {
            try {
                const res = await MeService.getMyCourses(user_id);
                setCourses(res.data.mycourses);
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };

        fetchCourses();
    }, [user_id]);

    return {
        courses,
        selectedCourse,
        setSelectedCourse,
        setCourses,
    };
};
