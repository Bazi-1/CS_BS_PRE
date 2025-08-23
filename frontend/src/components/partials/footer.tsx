import React from 'react';
import { Box, Container, Typography, IconButton, Link, Grid } from '@mui/material';
import { Facebook, Twitter, Instagram, WhatsApp } from '@mui/icons-material';
import "../../styles/footer.css"

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ backgroundColor: 'black', color: 'white', py: 4 }}>
            <Typography variant="h4" gutterBottom>
            <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={8} md={6}>
                        <Typography variant="body1" align="center">
                            <Link href="#" color="inherit" underline="none">Read our Privacy Policy</Link> |{' '}
                            <Link href="/addCourse" color="inherit" underline="none">Share us your courses</Link> |{' '}
                            <Link href="/login" color="inherit" underline="none">Sign up for a Free Trial</Link> |{' '}
                            <Link href="/contact" color="inherit" underline="none">Get in touch with us</Link>
                        </Typography>
                        <Typography variant="body2" align="center" mt={2}>
                            <strong>Thank you for visiting and supporting us!</strong>
                        </Typography>
                    </Grid>
                </Grid>

                <Box mt={3} display="flex" justifyContent="center">
                    <IconButton color="inherit" href="#" aria-label="Twitter">
                        <Twitter fontSize="large" />
                    </IconButton>
                    <IconButton color="inherit" href="#" aria-label="Instagram">
                        <Instagram fontSize="large" />
                    </IconButton>
                    <IconButton color="inherit" href="#" aria-label="Facebook">
                        <Facebook fontSize="large" />
                    </IconButton>
                    <IconButton color="inherit" href="#" aria-label="WhatsApp">
                        <WhatsApp fontSize="large" />
                    </IconButton>
                </Box>

                <Box mt={3} textAlign="center">
                    <Typography variant="body2" color="white">
                        © {new Date().getFullYear()} LETSSCALE. ALL RIGHTS RESERVED.
                    </Typography>
                </Box>
            </Container>
            </Typography>
        </Box>
    );
};

export default Footer;
