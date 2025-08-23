import { Course } from "../../interfaces/course";

export const handleSessionChange = (
  sectionIndex: number,
  sessionIndex: number,
  event: React.ChangeEvent<HTMLInputElement>,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>
) => {
  const { name, value } = event.target;

  setSelectedCourse((prevCourse) => {
    if (!prevCourse) return null;

    const updatedSections = [...prevCourse.sections];
    updatedSections[sectionIndex].sessions[sessionIndex] = {
      ...updatedSections[sectionIndex].sessions[sessionIndex],
      [name]: value,
    };

    return { ...prevCourse, sections: updatedSections };
  });
};
