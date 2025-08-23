import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const PageContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '100vh',
    padding: '100px 70px 0 20px',
    background: '#ffffff',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        textAlign: 'center',
    },
}));

export const TextSection = styled(Box)(({ theme }) => ({
    maxWidth: '500px',
    [theme.breakpoints.down('md')]: {
        marginBottom: '20px',
    },
}));

export const HighlightText = styled(Box)(({ theme }) => ({
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: '1.2',
    marginBottom: '20px',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
        fontSize: '2rem',
    },
}));

export const ScratchedText = styled('span')({
    position: 'relative',
    display: 'inline-block',
    zIndex: 1,
    '&::before': {
        content: '""',
        position: 'absolute',
        bottom: '-10px',
        left: '0',
        width: '100%',
        height: '20px',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0 10 C10 15, 20 5, 30 10 S70 15, 100 10" stroke="%23007aff" stroke-width="2" fill="none" /><path d="M5 15 C15 20, 25 10, 35 15 S75 20, 95 15" stroke="%23007aff" stroke-width="1.5" fill="none" /><path d="M0 20 C8 25, 18 15, 28 20 S68 25, 98 20" stroke="%23007aff" stroke-width="1" fill="none" /><path d="M2 5 C12 10, 22 0, 32 5 S72 10, 102 5" stroke="%23007aff" stroke-width="1" fill="none" /><path d="M10 25 C20 28, 30 18, 40 25 S80 28, 100 25" stroke="%23007aff" stroke-width="1.5" fill="none" /></svg>')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: -1,
    },
});

export const Subtitle = styled(Typography)({
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '30px',
});

export const CallToActionButton = styled(Button)({
    background: '#007aff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '50px',
    fontSize: '1rem',
    textTransform: 'none',
    '&:hover': {
        background: '#0056cc',
    },
});

export const Title = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: '20px',
    [theme.breakpoints.down('md')]: {
        fontSize: '2rem',
    },
}));

export const ActionButton = styled(Button)({
    padding: '10px 20px',
    borderRadius: '50px',
    fontSize: '1rem',
    textTransform: 'none',
    '&:first-of-type': {
        backgroundColor: 'rgb(238, 220, 236)',
        color: 'black',
        '&:hover': {
            backgroundColor: 'rgb(243, 144, 238)',
        },
    },
    '&:last-of-type': {
        backgroundColor: '#f5e6e6',
        color: '#b56c6c',
        '&:hover': {
            backgroundColor: '#dfc7c7',
        },
    },
});

export const ButtonContainer = styled(Box)({
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
});

export const Illustration = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    height: 'auto',
    [theme.breakpoints.down('md')]: {
        marginTop: '20px',
    },
}));

export const SectionContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8fbfc',
});

export const AdvantageSection = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px 20px',
    background: '#f8fbfc',
    fontFamily: "'Roboto', sans-serif",
});

export const AdvantageTitle = styled(Typography)(({ theme }) => ({
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: '20px',
    fontFamily: "'Roboto', sans-serif",
    color: '#333333',
    [theme.breakpoints.down('md')]: {
        fontSize: '2rem',
    },
}));

export const HighlightTextSpan = styled('span')({
    position: 'relative',
    display: 'inline-block',
    zIndex: 1,
    color: '#007aff',
    fontFamily: "'Roboto', sans-serif",
    '&::before': {
        content: '""',
        position: 'absolute',
        bottom: '-5px',
        left: 0,
        width: '100%',
        height: '10px',
        backgroundColor: '#caf0f8',
        zIndex: -1,
    },
});

export const AdvantagesContainer = styled(Box)({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: '40px',
});

export const AdvantageItem = styled(Box)({
    width: '300px',
    textAlign: 'center',
    margin: '20px',
    fontFamily: "'Roboto', sans-serif",
});

export const AdvantageNumber = styled(Typography)({
    fontSize: '3rem',
    fontWeight: 700,
    color: 'rgb(229, 165, 222)',
    marginBottom: '10px',
});

export const AdvantageHeading = styled(Typography)({
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '10px',
    color: '#333333',
});

export const AdvantageDescription = styled(Typography)({
    fontSize: '1rem',
    color: '#6c757d',
});

export const NewSection = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    borderRadius: '30px',
    background: 'linear-gradient(90deg, #D9B3B3 50%, #0099CC 50%)',
    textAlign: 'center',
    margin: '40px 20px',
    color: '#1c1c1c',
});

export const SectionTitle = styled(Typography)({
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '10px',
});

export const SectionSubtitle = styled(Typography)({
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '20px',
});

export const ExploreButton = styled(Button)({
    padding: '10px 20px',
    borderRadius: '50px',
    fontSize: '1rem',
    textTransform: 'none',
    background: '#ffffff',
    color: '#000',
    border: '1px solid #ddd',
    '&:hover': {
        background: '#f5f5f5',
    },
});
