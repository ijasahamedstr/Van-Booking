import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import StarIcon from '@mui/icons-material/Star';

/* --- Data Structure with Sentence Case --- */
const navLinks = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Van details', path: '/van-details', icon: <LocalShippingIcon /> },
  { label: 'Van booking', path: '/van-booking', icon: <BookOnlineIcon /> },
  { label: 'Special request', path: '/special-request', icon: <StarIcon /> },
];

/* --- Styled Components --- */
const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'isScrolled',
})<{ isScrolled?: boolean }>(({ theme, isScrolled }) => ({
  backgroundColor: isScrolled ? 'rgba(17, 17, 17, 0.98)' : 'rgba(17, 17, 17, 0.4)',
  borderRadius: '60px',
  marginTop: isScrolled ? '10px' : '25px',
  padding: '10px 15px 10px 25px !important',
  color: 'white',
  boxShadow: isScrolled ? '0px 20px 50px rgba(0,0,0,0.5)' : 'none',
  backdropFilter: 'blur(18px)',
  border: '1px solid rgba(255,255,255,0.15)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('lg')]: { borderRadius: '40px', marginTop: '10px' },
  [theme.breakpoints.down('sm')]: { borderRadius: '25px', marginTop: '8px' }
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  color: active ? '#4caf50' : '#ffffff',
  textTransform: 'none', // Preserves "Van details" casing
  fontSize: '0.9rem',
  fontWeight: 600,
  margin: '0 5px',
  fontFamily: '"Montserrat", sans-serif',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  '& .MuiSvgIcon-root': { fontSize: '1.2rem' },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 5,
    left: '50%',
    width: active ? '60%' : 0,
    height: '2px',
    backgroundColor: '#4caf50',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },
  '&:hover': { color: '#4caf50', backgroundColor: 'transparent' },
  '&:hover::after': { width: '60%' }
}));

const ActionButton = styled(Button)(() => ({
  borderRadius: '50px',
  textTransform: 'none', // Preserves "Complaint" casing
  fontSize: '0.85rem',
  fontWeight: 700,
  fontFamily: '"Montserrat", sans-serif',
  display: 'flex',
  alignItems: 'center',
  padding: '8px 20px',
  height: '46px',
}));

const ComplaintButton = styled(ActionButton)(() => ({
  backgroundColor: '#f44336',
  color: '#fff',
  marginRight: '12px',
  boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
  '&:hover': { backgroundColor: '#d32f2f' },
  '& .icon-wrap': { marginLeft: '8px', display: 'flex', alignItems: 'center' }
}));

const LoginButton = styled(ActionButton)(() => ({
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: '#4caf50' },
  '& .login-icon': { marginRight: '8px', color: '#4caf50', fontSize: '1.3rem' }
}));

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width:1200px)');

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none', zIndex: 1500 }}>
        <Container maxWidth="xl">
          <StyledToolbar isScrolled={isScrolled}>
            {/* LOGO */}
            <Box onClick={() => handleNavigate('/')} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Box component="img" src="https://i.ibb.co/XZvpGxxs/Gemini-Generated-Image-ighevnighevnighe-1.png" alt="Logo"
                sx={{ height: { xs: '38px', md: '55px' }, transition: '0.3s ease' }}
              />
            </Box>

            {isDesktop ? (
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                {navLinks.map((link) => (
                  <NavButton 
                    key={link.label} 
                    onClick={() => handleNavigate(link.path)}
                    active={location.pathname === link.path}
                  >
                    {link.icon}
                    {link.label}
                  </NavButton>
                ))}

                <Box sx={{ display: 'flex', ml: 3 }}>
                  <ComplaintButton onClick={() => handleNavigate('/complaint')}>
                    Complaint <div className="icon-wrap"><MapsUgcIcon sx={{ fontSize: '1.1rem' }} /></div>
                  </ComplaintButton>
                  
                  <LoginButton onClick={() => handleNavigate('/login')}>
                    <PersonOutlineIcon className="login-icon" /> Login
                  </LoginButton>
                </Box>
              </Box>
            ) : (
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={() => handleNavigate('/login')} sx={{ color: 'white' }}><PersonOutlineIcon /></IconButton>
                <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}><MenuIcon /></IconButton>
              </Box>
            )}
          </StyledToolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} 
        PaperProps={{ sx: { width: { xs: '85%', sm: '350px' }, bgcolor: '#0a0a0a', color: '#fff' } }}>
        
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Montserrat', fontWeight: 700 }}>Menu</Typography>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <List>
            {navLinks.map((link) => (
              <ListItemButton 
                key={link.label} 
                onClick={() => handleNavigate(link.path)} 
                sx={{ py: 1.5, borderRadius: '12px', mb: 1, backgroundColor: location.pathname === link.path ? 'rgba(76, 175, 80, 0.1)' : 'transparent' }}
              >
                <ListItemIcon sx={{ color: location.pathname === link.path ? '#4caf50' : 'white', minWidth: '40px' }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={link.label} 
                  primaryTypographyProps={{ 
                    fontWeight: 600, 
                    fontFamily: 'Montserrat',
                    color: location.pathname === link.path ? '#4caf50' : 'white'
                  }} 
                />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: 4 }}>
            <Button fullWidth variant="contained" onClick={() => handleNavigate('/complaint')}
              startIcon={<FeedbackIcon />}
              sx={{ bgcolor: '#f44336', py: 1.5, borderRadius: '12px', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#d32f2f' } }}>
              File a complaint
            </Button>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}