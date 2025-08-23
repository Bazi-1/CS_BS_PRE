import SectionService from "../../../../../services/Sections.tsx";
import { Course } from "../../interfaces/course";
import {React} from '../../../../imports/imports.tsx'
export const fetchSections = async (
  selectedCourse: Course | null,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>
) => {
  if (selectedCourse) {
    try {
      const res = await SectionService.getSections(selectedCourse.course_id);
      setSelectedCourse((prevCourse) =>
        prevCourse
          ? {
              ...prevCourse,
              sections: res.data.sections
                ? res.data.sections.map((section) => ({
                    ...section,
                    name: section.title,
                    sessions: section.sessions
                      ? section.sessions.map((session) => ({
                          ...session,
                          name: session.title,
                        }))
                      : [],
                  }))
                : [],
            }
          : null
      );
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  }
};
