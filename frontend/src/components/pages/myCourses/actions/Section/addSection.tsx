import SectionService from "../../../../../services/Sections.tsx";
import { Course } from "../../interfaces/course";
import React from "react";

export const addSection = async (
    selectedCourse: Course | null,
    newSectionTitle: string,
    user_id: number,
    setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>,
    setNewSectionTitle: React.Dispatch<React.SetStateAction<string>>
) => {
    try {
        const course_id = selectedCourse?.course_id;

        const result = await SectionService.addSection(newSectionTitle, course_id, user_id);
        if (course_id && result.status === 201 && result.data?.section_id) {
            const newSection = {
                section_id: result.data.section_id,
                name: newSectionTitle,
                number_of_sessions: 0,
                sessions: [],
            };

            setSelectedCourse(prevCourse =>
                prevCourse ? {
                    ...prevCourse,
                    sections: [...prevCourse.sections, newSection]
                } : null
            );

            setNewSectionTitle("");
        }

    } catch (error) {
        console.error("Error adding section:", error);
        alert("Failed to add section.");
    }
};
