import { Course } from "../../interfaces/course";

export const handleSectionChange = (
  index: number,
  event: React.ChangeEvent<HTMLInputElement>,
  selectedCourse: Course | null,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>
) => {
  if (selectedCourse) {
    const updatedSections = [...selectedCourse.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [event.target.name]: event.target.value,
    };
    setSelectedCourse({ ...selectedCourse, sections: updatedSections });
  }
};
