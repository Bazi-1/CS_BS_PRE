import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import MeService from "../../services/MeServices.tsx";
import EnrollmentCoursesService from "../../services/EnrollmentServices.tsx";
import { getLocalStorageUser } from "../../components/imports/utility.tsx";

interface Enrollment {
    course_id: string;
    name: string;
    description: string;
    image: string;
}

interface EnrollmentsState {
    enrollments: Enrollment[];
    alert: { message: string; type: "success" | "danger" | null };
}

const initialState: EnrollmentsState = {
    enrollments: [],
    alert: { message: "", type: null },
};

export const fetchEnrollments = createAsyncThunk(
    "enrollments/fetch",
    async () => {
        const user_id = getLocalStorageUser()?.user_id;
        const response = await EnrollmentCoursesService.getEnrollmentCourses(user_id);
        return response.data.enrollments;
    }
);

export const withdrawCourse = createAsyncThunk(
    "enrollments/withdraw",
    async (course_id: string, { rejectWithValue }) => {
        const user_id = getLocalStorageUser()?.user_id;
        try {
            const response = await MeService.withdrawCourse(course_id, user_id);
            if (response.status === 200) {
                return course_id;
            } else {
                return rejectWithValue("Unable to withdraw from the course.");
            }
        } catch {
            return rejectWithValue("An error occurred.");
        }
    }
);

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState,
    reducers: {
        clearAlert: (state) => {
            state.alert = { message: "", type: null };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnrollments.fulfilled, (state, action) => {
                state.enrollments = action.payload;
            })
            .addCase(withdrawCourse.fulfilled, (state, action) => {
                state.enrollments = state.enrollments.filter(
                    (e) => e.course_id !== action.payload
                );
            })
            .addCase(withdrawCourse.rejected, (state, action) => {
                state.alert = {
                    message: action.payload as string,
                    type: "danger",
                };
            });
    },
});

export const { clearAlert } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
