// EditCoursePage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Course } from "./interfaces/course.tsx";
import { handleCourseChange } from "./actions/Course/handleCourseChange.tsx";

import { handleImageUpload } from "./actions/Image/handleImageUpload.tsx";

import { handleSubmit } from "./actions/Others/handleSubmit.tsx";

import { handleSectionChange } from "./actions/Section/handleSectionChange.tsx";

import { addSection } from "./actions/Section/addSection.tsx";
import { deleteSection } from "./actions/Section/deleteSection.tsx";
import { handleSessionChange } from "./actions/Session/handleSessionChange.tsx";
import { deleteCourse } from "./actions/Course/deleteCourse.tsx";
import { addSession } from "./actions/Session/addSession.tsx";
import { deleteSession } from "./actions/Session/deleteSession.tsx";
import { handleVideoUpload } from "./actions/Video/handleVideoUpload.tsx";
import {
  Button,
  Box,
  TextField,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getLocalStorageUser } from "../../../utils/localStorageUtils.tsx";
import { fetchCourses } from "./actions/Course/fetchCourses.tsx";
import { fetchSections } from "./actions/Section/fetchSections.tsx";

const EditCoursePage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const user_id = getLocalStorageUser()?.user_id;

  useEffect(() => {
    if (user_id && courseId) {
      fetchCourses(user_id, (courses: Course[]) => {
        console.log("All courses:", courses);
        console.log("Route courseId:", courseId, "typeof:", typeof courseId);

        const course = courses.find(
          (c) => String(c.course_id) === String(courseId)
        );

        console.log("Matched course:", course);
        if (course)
          setSelectedCourse({
            ...course,
            sections: course.sections || [], // ensure sections is always an array
          });
      });
    }
  }, [user_id, courseId]);

  useEffect(() => {
    console.log("Selected course updated:", selectedCourse);
  }, [selectedCourse]);

  useEffect(() => {
  if (user_id && courseId) {
    fetchCourses(user_id, (courses: Course[]) => {
      const course = courses.find(
        (c) => String(c.course_id) === String(courseId)
      );
      if (course) {
        setSelectedCourse(course);
        fetchSections(course, setSelectedCourse); // <-- fetch sections here
      }
    });
  }
}, [user_id, courseId]);

  if (!selectedCourse) {
    return <Typography>Loading course...</Typography>; // placeholder
  }

  return (
    <Box sx={{ m: 4 }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>

      <form onSubmit={(e) => handleSubmit(e, selectedCourse, Number(user_id))}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
          ✏️ Update Course
          <IconButton
            onClick={() => deleteCourse(Number(user_id), Number(courseId))}
            sx={{ ml: 2 }}
          >
            <Delete />
          </IconButton>
        </Typography>

        <TextField
          fullWidth
          label="Course Name"
          value={selectedCourse.name}
          onChange={(e) =>
            handleCourseChange(e, selectedCourse, setSelectedCourse)
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={selectedCourse.description}
          onChange={(e) =>
            handleCourseChange(e, selectedCourse, setSelectedCourse)
          }
          sx={{ mb: 2 }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, setSelectedFile)}
        />
        {selectedCourse.image && (
          <img
            src={`http://localhost:3001/uploads/${selectedCourse.image}`}
            alt="Preview"
            width="100px"
          />
        )}

        <Divider sx={{ my: 3 }} />

        {/* Sections Header */}
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
        >
          📌 Sections
        </Typography>

        {/* Sections List */}
        {selectedCourse?.sections && selectedCourse.sections.length > 0 ? (
          selectedCourse.sections.map((section, sectionIndex) => (
            <Box
              key={section.section_id}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              {/* Section Name */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <TextField
                  fullWidth
                  label="Section Name"
                  name="name"
                  value={section.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleSectionChange(
                      sectionIndex,
                      e,
                      selectedCourse,
                      setSelectedCourse
                    )
                  }
                  sx={{ mb: 1 }}
                />
                <IconButton
                  color="error"
                  onClick={() => deleteSection(Number(section.section_id))}
                  sx={{ ml: 1, "&:hover": { bgcolor: "#fdecea" } }}
                >
                  <Delete />
                </IconButton>
              </Box>

              {/* Add Session Button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => addSession(sectionIndex, setSelectedCourse)}
                startIcon={<Add />}
                sx={{ mb: 1 }}
              >
                Add Session
              </Button>

              {/* Sessions */}
              {section.sessions && section.sessions.length > 0 ? (
                section.sessions.map((session, sessionIndex) => (
                  <Box
                    key={session.session_id}
                    sx={{
                      mt: 2,
                      pl: 2,
                      borderLeft: "3px solid #ccc",
                      p: 1,
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <TextField
                        fullWidth
                        label="Session Name"
                        name="name"
                        value={session.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSessionChange(
                            sectionIndex,
                            sessionIndex,
                            e,
                            setSelectedCourse
                          )
                        }
                        sx={{ mb: 1 }}
                      />
                      <IconButton
                        color="error"
                        onClick={() => deleteSession(session.session_id)}
                        sx={{ ml: 1, "&:hover": { bgcolor: "#fdecea" } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    <Box mt={1}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Upload Video:
                      </Typography>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleVideoUpload(
                            sectionIndex,
                            sessionIndex,
                            e,
                            setSelectedCourse
                          )
                        }
                      />
                    </Box>
                    {session.video_url && (
                      <Box mt={1}>
                        <Typography variant="body2" color="textSecondary">
                          Current Video:
                        </Typography>
                        <video
                          src={`http://localhost:3001/uploads/${session.video_url}`}
                          width="200px"
                          height="120px"
                          controls
                          style={{ borderRadius: "8px", marginTop: "5px" }}
                        />
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ textAlign: "center", mt: 1 }}
                >
                  No sessions yet.
                </Typography>
              )}
            </Box>
          ))
        ) : (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "center", mt: 2 }}
          >
            No sections available.
          </Typography>
        )}

        {/* Add Section Button */}
        <TextField
          fullWidth
          label="New Section Name"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            if (user_id !== undefined) {
              addSection(
                selectedCourse,
                newSectionTitle,
                user_id,
                setSelectedCourse,
                setNewSectionTitle
              );
            } else {
              alert("User ID is missing!");
            }
          }}
        >
          Add Section
        </Button>


        <Divider sx={{ my: 2 }} />

        <Button type="submit" variant="contained" fullWidth>
          Save Changes
        </Button>
      </form>
    </Box>
  );
};

export default EditCoursePage;
