import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice.tsx';
import userReducer from './auth/userSlice.tsx';
import notesReducer from "./notes/notesSlice.tsx";
import bannerReducer from '../store/courses/bannerSlice.tsx';
import coursesReducer from '../store/courses/coursesSlice.tsx';
import courseFormReducer from '../store/courses/courseFormSlice.tsx'
import enrollmentsReducer from '../store/courses/enrollmentsSlice.tsx'
// import videoReducer from '../store/videos/videoSlice.tsx'
// import commentReducer from '../store/videos/commentSlice.tsx'
import translateReducer from '../store/tools/translateSlice.tsx'
import chatReducer from '../store/tools/chatSlice.tsx'
import contactReducer from '../store/help/contactSlice.tsx'
import faqReducer from '../store/help/FAQSlice.tsx'
import rootReducer from '../redux-elements/reducers/rootReducer.js';


const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        notes: notesReducer,
        banner: bannerReducer,
        courses: coursesReducer,
        courseForm:courseFormReducer,
        enrollments:enrollmentsReducer,
        // video:videoReducer,
        // comments:commentReducer,
        translate:translateReducer,
        chat:chatReducer,
        contact:contactReducer,
        faq:faqReducer,
        rootreducer:rootReducer,
        // myCourses:myCoursesReducer,
        // sections:sectionsReducer,

    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
