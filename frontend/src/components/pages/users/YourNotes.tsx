import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/types.tsx";
import {
    fetchUserNotes,
    deleteUserNote,
    updateUserNote
} from "../../../store/notes/notesSlice.tsx";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



interface Note {
    note_id: number;
    title: string;
    session_id: number;
    content: string;
    course_title: string;
    section_title: string;
    session_title: string;
    created_at: string;
    updated_at: string;
}


const YourNotes = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user);
    const { notes, status } = useSelector((state: RootState) => state.notes);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [openPopup, setOpenPopup] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.user_id) dispatch(fetchUserNotes(user.user_id));
    }, [user.user_id]);

    const handleOpenPopup = (note) => {
        setSelectedNote(note);
        setOpenPopup(true);
    };

    const handleSaveNote = () => {
        if (selectedNote)
            dispatch(updateUserNote({ note_id: selectedNote.note_id, updatedNote: selectedNote }))
                .then(() => setOpenPopup(false));
    };

    const handleDeleteNote = () => {
        if (selectedNote)
            dispatch(deleteUserNote({
                note_id: selectedNote.note_id,
                session_id: selectedNote.session_id,
                user_id: user.user_id
            })).then(() => setOpenPopup(false));
    };

    const formatDate = (dateInput: string | number): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };

        const date = typeof dateInput === 'string' && !isNaN(Number(dateInput))
            ? new Date(Number(dateInput))
            : new Date(dateInput);

        return date.toLocaleDateString(undefined, options);
    };

    if (!user.user_id) {
        return <Typography variant="h6" style={{ textAlign: "center" }}>You must be logged in to view your notes.</Typography>;
    }

    return (
        <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
            <IconButton
                sx={{ marginTop: '4%', position: 'absolute', top: 20, left: 20, color: 'black' }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" style={{ marginTop: "7%", marginBottom: "60px", textAlign: "center" }}>
                My Notes
            </Typography>

            { Array.isArray(notes) && notes.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        background: "linear-gradient(145deg, #f3eaff, #ece9ff)",
                        border: "1px solid #d1c4e9",
                        padding: "30px",
                        borderRadius: "12px",
                        marginBottom: "40px",
                        boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography variant="h5" style={{ fontWeight: "bold", color: "#5e35b1", marginBottom: "10px" }}>
                        📝 No Notes Yet!
                    </Typography>
                    <Typography variant="body1" style={{ color: "#6a1b9a" }}>
                        You haven’t added any notes yet. Start creating your learning journey by selecting a course and writing down what matters.
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: "10px", fontStyle: "italic", color: "#7e57c2" }}>
                        Your notes will appear here once you add them.
                    </Typography>
                </div>
            ) :  (
                <Grid container spacing={3}>
                    { notes.map((note) => (
                        <Grid item xs={12} sm={6} md={4} key={note.note_id}>
                            <Card
                                style={{
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    height: "100%",
                                    paddingBottom: "10px",
                                }}
                                onClick={() => handleOpenPopup(note)}
                            >
                                <CardContent style={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                                        {note.course_title}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        {note.section_title} - {note.session_title}
                                    </Typography>
                                    <Typography variant="body2" style={{ marginTop: "10px", fontWeight: "bold" }}>
                                        {note.title}
                                    </Typography>
                                    <Typography variant="body2" style={{ marginTop: "10px" }}>
                                        {note.content}...
                                    </Typography>
                                </CardContent>
                                <div style={{ padding: "10px", textAlign: "right" }}>
                                    <Typography variant="caption" style={{ color: "#555", fontSize: "12px", display: "block" }}>
                                        🕒 Created: {formatDate(note.created_at)}
                                    </Typography>
                                    <Typography variant="caption" style={{ color: "#777", fontSize: "12px", display: "block", marginTop: "2px" }}>
                                        ✏️ Updated: {formatDate(note.updated_at)}
                                    </Typography>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openPopup} onClose={() => setOpenPopup(false)} fullScreen={fullScreen}>
                <DialogTitle>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                        Edit Note
                    </Typography>
                    <IconButton onClick={() => setFullScreen(!fullScreen)} style={{ float: "right" }}>
                        <OpenInFullIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {selectedNote && (
                        <>
                            <TextField
                                fullWidth
                                variant="standard"
                                label="Title"
                                value={selectedNote.title}
                                onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                                style={{ marginBottom: "15px" }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                variant="standard"
                                label="Content"
                                value={selectedNote.content}
                                onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveNote} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleDeleteNote} color="error">
                        Delete
                    </Button>
                    <Button onClick={() => setOpenPopup(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default YourNotes;
