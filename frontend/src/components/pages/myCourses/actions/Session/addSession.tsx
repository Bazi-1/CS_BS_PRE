import { Course } from "../../interfaces/course";

export const addSession = (
  sectionIndex: number,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>
) => {
  setSelectedCourse((prevCourse) => {
    if (!prevCourse) return null;

    const updatedSections = [...prevCourse.sections];
    updatedSections[sectionIndex].sessions = [
      ...updatedSections[sectionIndex].sessions,
      {
        session_id: Date.now().toString(), // Temporary ID
        name: "",
        video_url: "",
        videoFile: undefined,
      },
    ];

    return { ...prevCourse, sections: updatedSections };
  });
};
