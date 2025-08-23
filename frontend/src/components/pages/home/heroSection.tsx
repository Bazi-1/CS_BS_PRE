import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


const MotionBox = motion(Box);

const HeroWrapper = styled(MotionBox)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:"5.5%",
    padding: '100px 40px 60px 40px',
    background: 'linear-gradient(135deg, #ede7f6, #f3e5f5)',
    borderRadius: '0 0 60px 60px',
    overflow: 'hidden',
    '@media (max-width: 900px)': {
        flexDirection: 'column',
        textAlign: 'center',
        padding: '80px 20px',
    },
});

const TextContent = styled(Box)({
    maxWidth: '550px',
    zIndex: 2,
});

const Headline = styled(Typography)({
    fontSize: '3.5rem',
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: '20px',
    background: 'linear-gradient(90deg, #7b2cbf,rgb(181, 149, 214))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
});

const SubText = styled(Typography)({
    fontSize: '1.2rem',
    color: '#4e4e4e',
    marginBottom: '30px',
});

const CTAButton = styled(Button)({
    backgroundColor: '#7b2cbf',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: '50px',
    fontWeight: 600,
    fontSize: '1rem',
    boxShadow: '0 4px 14px rgba(123, 44, 191, 0.4)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#5a189a',
        transform: 'translateY(-2px)',
    },
});

const Illustration = styled('img')({
    width: '500px',
    height: 'auto',
    '@media (max-width: 900px)': {
        marginTop: '40px',
        width: '100%',
    },
});

const HeroSection = () => {
    return (
        <HeroWrapper initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <TextContent>
                <Headline>
                    Unleash your <br />
                    <span style={{ color: '#5a189a' }}>learning potential</span>
                </Headline>
                <SubText>
                    Welcome to the future of learning. Join thousands of learners and start your knowledge journey with exciting, interactive content.
                </SubText>
                <CTAButton href="/courses" startIcon={<RocketLaunchIcon />}>
                    Start Learning
                </CTAButton>
            </TextContent>

            <Illustration src="http://localhost:3001/images/learn.png" alt="Learning Illustration" />
        </HeroWrapper>
    );
};

export default HeroSection;
