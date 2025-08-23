import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/pages/users/login.tsx";
import Header from "./components/partials/header.tsx";
import Footer from "./components/partials/footer.tsx";
import Register from "./components/pages/users/register.tsx";
import Home from "./components/pages/home/home.tsx";
import Contact from "./components/pages/help/contact.tsx";
import AddCourse from "./components/pages/courses/addCourseForm.tsx";
import EnrolledCourses from "./components/pages/courses/enrollment.tsx";
import Courses from "./components/pages/courses/course.tsx";
import CourseVideo from "./components/pages/videos/video.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import CoursesPage from "./components/pages/myCourses/mycourse.tsx";
import Profile from "./components/pages/users/profile.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Account from "./components/pages/users/account.tsx";
import Translate from "./components/pages/tools/Translate.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import YourNotes from "./components/pages/users/YourNotes.tsx";
import { getLocalStorageUser } from "./utils/localStorageUtils.tsx";
import theme from "./components/pages/tools/theme.tsx";
import ChatButton from "./components/pages/tools/ChatButton.tsx";
import { Provider } from "react-redux";
import store from "./store/store.tsx";
import EditCoursePage from "./components/pages/myCourses/editCoursePage.tsx";

const App: React.FC = () => {
  const user_id = getLocalStorageUser()?.user_id;
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Routes>
              <Route path="/" element={<Navigate to="/Home" />} />
              <Route path="/Login" element={<LoginForm />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Add Course" element={<AddCourse />} />
              <Route path="/Enrollments" element={<EnrolledCourses />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Account" element={<Account />} />
              <Route
                path="/edit-course/:courseId"
                element={<EditCoursePage />}
              />
              <Route path="/Courses" element={<Courses />} />
              <Route path="/MyCourses" element={<CoursesPage />} />
              <Route path="/Translate" element={<Translate />} />
              <Route path="/YourNotes" element={<YourNotes />} />
              <Route path="/AI" element={<ChatButton />} />
            </Routes>
            <Footer />
          </ThemeProvider>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
