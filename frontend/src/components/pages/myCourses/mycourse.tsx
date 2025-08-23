import React, { useState, useEffect } from "react";
import "../../../styles/course.css";
import { Course } from "./interfaces/course.tsx";
import { fetchCourses } from "./actions/Course/fetchCourses.tsx";
import { fetchSections } from "./actions/Section/fetchSections.tsx";
import { handleSettingsClick } from "./actions/Others/handleSettingsClick.tsx";
import { handleCloseModal } from "./actions/Others/handleCloseModal.tsx";
import { handleCourseChange } from "./actions/Course/handleCourseChange.tsx";
import { handleVideoUpload } from "./actions/Video/handleVideoUpload.tsx";
import { handleSectionChange } from "./actions/Section/handleSectionChange.tsx";
import { handleSessionChange } from "./actions/Session/handleSessionChange.tsx";
import { addSection } from "./actions/Section/addSection.tsx";
import { addSession } from "./actions/Session/addSession.tsx";
import { deleteSection } from "./actions/Section/deleteSection.tsx";
import { deleteSession } from "./actions/Session/deleteSession.tsx";
import { deleteCourse } from "./actions/Course/deleteCourse.tsx";
import { handleImageUpload } from "./actions/Image/handleImageUpload.tsx";
import { handleSubmit } from "./actions/Others/handleSubmit.tsx";
import { getLocalStorageUser } from "../../../utils/localStorageUtils.tsx";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const CoursePage: React.FC = () => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState<string>("");
  const [newSessionTitle, setNewSessionTitle] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const user_id = getLocalStorageUser()?.user_id;
  const navigate = useNavigate();

  useEffect(() => {
    if (user_id) {
      fetchCourses(user_id, setMyCourses);
    }
  }, [user_id]);

  return (
    <div className="container" style={{ margin: "7%" }}>
      <IconButton
        sx={{
          marginTop: "4%",
          position: "absolute",
          top: 20,
          left: 20,
          color: "black",
        }}
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </IconButton>
      <h1 className="heading" style={{ textAlign: "center" }}>
        My Courses
      </h1>
      {myCourses.length === 0 && (
        <Box
          sx={{
            backgroundColor: "#f3f4f6",
            border: "2px dashed #9c27b0",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            color: "#6a1b9a",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#ede7f6",
              transform: "scale(1.02)",
            },
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            You haven't added any courses yet!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Kickstart your journey by adding your first course 🎓✨
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => (window.location.href = "/add course")}
          >
            Add Course at the Top ☝️
          </Button>
        </Box>
      )}

      <ul className="course-list">
        {myCourses.map((course) => (
          <li key={course.course_id} className="udemy-style-card">
            <div
              className="udemy-style-image"
              style={{
                backgroundImage: `url(http://localhost:3001/uploads/${course.image})`,
              }}
            ></div>
            <div className="udemy-style-details">
              <button
                onClick={() => navigate(`/edit-course/${course.course_id}`)}
                className="settings-button"
                style={{
                  alignSelf: "flex-end",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ⚙️
              </button>
              <h3>{course.name}</h3>
              <p className="desc">{course.description}</p>
            </div>
          </li>
        ))}
      </ul>
      {/* 🏆 Improved Modal Design */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 550,
            bgcolor: "#fff",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {selectedCourse && user_id && (
            <form onSubmit={(e) => handleSubmit(e, selectedCourse, user_id)}>
              {/* Title */}
              <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
              >
                ✏️ Update Course
                <IconButton
                  onClick={() =>
                    deleteCourse(
                      Number(user_id),
                      Number(selectedCourse?.course_id)
                    )
                  }
                  sx={{ ml: "95%", "&:hover": { bgcolor: "#fdecea" } }}
                >
                  <Delete />
                </IconButton>
              </Typography>
              {/* Course Name & Description */}
              <TextField
                fullWidth
                label="Course Name"
                name="name"
                value={selectedCourse.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCourseChange(e, selectedCourse, setSelectedCourse)
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                label="Description"
                name="description"
                value={selectedCourse.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleCourseChange(e, selectedCourse, setSelectedCourse)
                }
                rows={3}
                sx={{ mb: 2 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setSelectedFile)}
              />
              {selectedCourse?.image && (
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
              {selectedCourse?.sections &&
              selectedCourse.sections.length > 0 ? (
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
                        onClick={() =>
                          deleteSection(Number(section.section_id))
                        }
                        sx={{ ml: 1, "&:hover": { bgcolor: "#fdecea" } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    {/* Add Session Button */}
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() =>
                        addSession(sectionIndex, setSelectedCourse)
                      }
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
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) =>
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
                                style={{
                                  borderRadius: "8px",
                                  marginTop: "5px",
                                }}
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
                onClick={(e) =>
                  addSection(
                    selectedCourse,
                    newSectionTitle,
                    user_id,
                    setSelectedCourse,
                    setNewSectionTitle
                  )
                }
              >
                Add Section
              </Button>

              <Divider sx={{ my: 2 }} />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: "#43a047", "&:hover": { bgcolor: "#357a38" } }}
              >
                Save Changes
              </Button>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default CoursePage;
