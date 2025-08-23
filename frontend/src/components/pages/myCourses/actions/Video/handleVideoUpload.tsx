import { Course } from "../../interfaces/course";

export const handleVideoUpload = (
  sectionIndex: number,
  sessionIndex: number,
  event: React.ChangeEvent<HTMLInputElement>,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const videoUrl = URL.createObjectURL(file);

  setSelectedCourse((prevCourse) => {
    if (!prevCourse) return null;

    const updatedSections = [...prevCourse.sections];
    updatedSections[sectionIndex].sessions[sessionIndex] = {
      ...updatedSections[sectionIndex].sessions[sessionIndex],
      video_url: videoUrl,
      videoFile: file,
    };

    return { ...prevCourse, sections: updatedSections };
  });
};
