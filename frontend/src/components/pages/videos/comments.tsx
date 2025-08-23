import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Container } from '@mui/material';
import CommentService from '../../../services/CommentsServices.tsx'; // Import your API service

interface Comment {
    comment_id: number;
    comment: string;
    updated_at: Date;
}

interface CommentSectionProps {
    course_id: number;
}

// Helper function to format date
const formatDate = (date: Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return "Just now";
};


const CommentSection: React.FC<CommentSectionProps> = ({ course_id }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await CommentService.getComments(course_id);
                setComments(response.data.comments || []);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, [course_id]);

    const handleAddComment = async () => {
        if (newComment.trim()) {
            const newCommentObj: Comment = {
                comment_id: comments.length + 1,
                comment: newComment,
                updated_at: new Date() // Include timestamp
            };
            setComments([...comments, newCommentObj]);
            setNewComment('');
        }
    };

    return (
        <Container sx={{ maxWidth: 250, marginTop: '1%' }}> {/* ✅ Fixed maxWidth */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Comments
            </Typography>

            {/* No comments placeholder */}
            {comments.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#888', fontStyle: 'italic', marginBottom: 2 }}>
                    No comments added yet.
                </Typography>
            ) : (
                comments.map((comment) => (
                    <Paper
                        key={comment.comment_id}
                        sx={{
                            padding: 1.5,
                            marginBottom: 1,
                            backgroundColor: '#fdecea',
                            borderRadius: 2,
                            maxWidth: 250, // ✅ Ensure comment width is limited
                        }}
                    >
                        <Typography variant="body2">{comment.comment}</Typography>
                        <Box sx={{ paddingTop: "5px", textAlign: "right" }}>
                            <Typography variant="caption" sx={{ color: "#777", fontSize: "12px", display: "block" }}>
                                from {formatDate(comment.updated_at)}
                            </Typography>

                        </Box>
                    </Paper>
                ))
            )}

            {/* Add Comment Input */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 2 }}>
                <TextField
                    variant="outlined"
                    placeholder="Add a comment"
                    size="small"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        boxShadow: 'none',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#333' },
                    }}
                    onClick={handleAddComment}
                >
                    Submit
                </Button>
            </Box>
        </Container>
    );
};

export default CommentSection;
