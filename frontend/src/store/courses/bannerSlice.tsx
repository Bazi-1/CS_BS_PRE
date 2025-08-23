import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CoursesService from '../../services/CoursesServices.tsx';
import { getLocalStorageUser } from '../../components/imports/utility.tsx';
import {Course} from '../../components/pages/myCourses/interfaces/course.tsx'

const user_id = getLocalStorageUser()?.user_id;

export const fetchCourses = createAsyncThunk('courses/fetchAll', async () => {
    const res = await CoursesService.getCourses(user_id);
    return res.data.data.getCourses;
});

export const searchCourses = createAsyncThunk('courses/search', async (term: string) => {
    const res = await CoursesService.searchCourses(term,user_id);
    return res.data.courses;
});

interface CoursesState {
    searchTerm: string;
    courses: Course[];
    error: string;
    loading: boolean;
}

const initialState: CoursesState = {
    searchTerm: '',
    courses: [],
    error: '',
    loading: false,
};

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load courses';
            })
            .addCase(searchCourses.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(searchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(searchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Search failed';
            });
    },
});

export const { setSearchTerm } = coursesSlice.actions;
export default coursesSlice.reducer;
