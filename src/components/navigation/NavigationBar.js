import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from 'react-router-dom';
import logoImage from "../../images/safe_shelter_logo.png"
import {lightGreen} from '@mui/material/colors';
import LoginIcon from '@mui/icons-material/Login';

const AdminNavigationBar = (props) => {

    const {handleLoginClick} = props;

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [pageTitle, setPageTitle] = React.useState('');

    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleRegisterUser = () => {
        navigate('/');
        setPageTitle('Home');
    };

    const handleConfirmRegistrations = () => {
        navigate('/about');
        setPageTitle('About');
    };
    const handleGroups = () => {
        navigate('/news');
        setPageTitle('News');
    };

    const handleMessages = () => {
        navigate('/volunteer');
        setPageTitle('Volunteer');
    };

    const handleFacilities = () => {
        navigate('/contact');
        setPageTitle('Contact');
    };

    const handleDonations = () => {
        navigate('/donate');
        setPageTitle('Donate');
    };

    const handleLogin = () => {
        setAnchorElUser(null);
        handleLoginClick();
    };

    return (
        <div>
            <AppBar position="static" sx={{backgroundColor: lightGreen[800]}}>
                <Container maxWidth="x1">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"

                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <img src={logoImage} style={{
                                width: 120,
                                height: 60,
                            }}/>
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: {xs: 'block', md: 'none'},
                                }}
                            >
                                <MenuItem onClick={handleRegisterUser}> Home </MenuItem>
                                <MenuItem onClick={handleConfirmRegistrations}> About </MenuItem>
                                <MenuItem onClick={handleGroups}> News </MenuItem>
                                <MenuItem onClick={handleMessages}> Volunteer </MenuItem>
                                <MenuItem onClick={handleFacilities}> Contact </MenuItem>
                                <MenuItem onClick={handleDonations}> Donate </MenuItem>
                            </Menu>
                        </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: {xs: 'flex', md: 'none'},
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <img src={logoImage} style={{
                                width: 120,
                                height: 60,
                            }}/>
                        </Typography>
                        <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                            <Button
                                onClick={handleRegisterUser}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Home
                            </Button>
                            <Button
                                onClick={handleConfirmRegistrations}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                About
                            </Button>
                            <Button
                                onClick={handleGroups}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                News
                            </Button>
                            <Button
                                onClick={handleMessages}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Volunteer
                            </Button>
                            <Button
                                onClick={handleFacilities}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Contact
                            </Button>
                            <Button
                                onClick={handleDonations}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Donate
                            </Button>
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleLoginClick} sx={{p: 0}}>
                                    <LoginIcon/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <AppBar position="static" sx={{height: 50, backgroundColor: lightGreen[300]}}>
                <Container maxWidth="x1">
                    <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                        <Typography
                            variant="h6"
                            noWrap

                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {pageTitle}
                        </Typography></div>
                </Container>
            </AppBar>
        </div>
    );
};
export default AdminNavigationBar;