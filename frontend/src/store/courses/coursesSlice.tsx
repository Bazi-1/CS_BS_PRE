// store/slices/coursesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoursesService, EnrollmentCoursesService } from '../../components/imports/services.tsx';
import { getLocalStorageUser } from '../../components/imports/utility.tsx';

interface Course {
  course_id: string;
  name: string;
  description: string;
  instructor: string;
  image: string;
  num_lectures: number;
  total_duration_seconds: number;
  students: number;
}


interface CoursesState {
    allCourses: Course[];
    filteredCourses: Course[];
    selectedLanguages: string[];
    selectedCourse: Course | null;
    message: string;
    snackbarSeverity: 'success' | 'error';
    isEnrolling: boolean;
    loading: boolean;
}

const initialState: CoursesState = {
    allCourses: [],
    filteredCourses: [],
    selectedLanguages: [],
    selectedCourse: null,
    message: '',
    snackbarSeverity: 'success',
    isEnrolling: false,
    loading: true,
};

const user = getLocalStorageUser();
const user_id = user?.user_id;

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
    const response = await CoursesService.getCourses(user_id);
    return response.data.data.getCourses;
});

export const enrollCourse = createAsyncThunk(
    'courses/enrollCourse',
    async (course_id: string, { rejectWithValue }) => {
        try {
            const response = await EnrollmentCoursesService.enrollStudent(course_id, user_id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Enrollment failed');
        }
    }
);

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setSelectedLanguages(state, action: PayloadAction<string[]>) {
            state.selectedLanguages = action.payload;
            if (action.payload.length === 0) {
                state.filteredCourses = state.allCourses;
            } else {
                state.filteredCourses = state.allCourses.filter(course =>
                    action.payload.includes('English')
                );
            }
        },
        selectCourse(state, action: PayloadAction<Course | null>) {
            state.selectedCourse = action.payload;
        },
        clearMessage(state) {
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.allCourses = action.payload;
                state.filteredCourses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state) => {
                state.loading = false;
            })
            .addCase(enrollCourse.pending, (state) => {
                state.isEnrolling = true;
            })
            .addCase(enrollCourse.fulfilled, (state, action) => {
                state.isEnrolling = false;
                state.message = action.payload.message;
                state.snackbarSeverity = action.payload.success ? 'success' : 'error';
            })
            .addCase(enrollCourse.rejected, (state, action) => {
                state.isEnrolling = false;
                state.message = action.payload as string;
                state.snackbarSeverity = 'error';
            });
    }
});

export const {
    setSelectedLanguages,
    selectCourse,
    clearMessage
} = coursesSlice.actions;

export default coursesSlice.reducer;
