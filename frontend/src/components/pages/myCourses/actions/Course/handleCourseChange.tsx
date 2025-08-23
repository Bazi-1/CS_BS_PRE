import {React} from '../../../../imports/imports.tsx'
import { Course } from "../../interfaces/course";
export const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement>,  selectedCourse: Course | null,
    setSelectedCourse: (course: Course) => void) => {
        if (selectedCourse) {
            setSelectedCourse({ ...selectedCourse, [event.target.name]: event.target.value });
        }
    };