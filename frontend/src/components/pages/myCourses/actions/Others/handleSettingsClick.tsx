import { Course } from "../../interfaces/course.tsx";
import { fetchSections } from "../Section/fetchSections.tsx";

export const handleSettingsClick = async (
    course: Course,
    setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setSelectedCourse({
        ...course,
        sections: course.sections ?? [],
    });

    // Then fetch actual sections
    await fetchSections(course, setSelectedCourse);

    // Then open the modal (after data is ready)
    setIsModalOpen(true);
};
