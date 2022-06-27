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
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const RefugeeNavigationBar = () => {
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

    const handleRequestStocks = () => {
        navigate('/refugee/request-stocks');
        setPageTitle('Request stocks');
    };

    const handleRequestLocationChange = () => {
        navigate('/refugee/request-location-change');
        setPageTitle('Request location change');
    };
    const handleRequestMedicalHelp = () => {
        navigate('/refugee/request-medical-help');
        setPageTitle('Request medical help');
    };

    const handleMessages = () => {
        navigate('/refugee/messages');
        setPageTitle('Messages');
    };

    const handleRequests = () => {
        navigate('/refugee/requests');
        setPageTitle('Requests');
    };

    const handleProfile = () => {
        setAnchorElUser(null);
        navigate('/refugee/profile');
        setPageTitle('Profile');
    };

    const handleLogout = () => {
        setAnchorElUser(null);
        navigate('/');
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
                                <MenuItem onClick={handleRequestStocks}> Request stocks </MenuItem>
                                <MenuItem onClick={handleRequestLocationChange}> Request location change </MenuItem>
                                <MenuItem onClick={handleRequestMedicalHelp}> Request medical help </MenuItem>
                                <MenuItem onClick={handleMessages}> Messages </MenuItem>
                                <MenuItem onClick={handleRequests}> My requests </MenuItem>
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
                                onClick={handleRequestStocks}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Request stocks
                            </Button>
                            <Button
                                onClick={handleRequestLocationChange}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Request location change
                            </Button>
                            <Button
                                onClick={handleRequestMedicalHelp}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Request medical help
                            </Button>
                            <Button
                                onClick={handleMessages}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Messages
                            </Button>
                            <Button
                                onClick={handleRequests}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                My Requests
                            </Button>
                        </Box>

                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <AccountBoxIcon sx={{fontSize: 50, color: "#fff"}}/>
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
                                <MenuItem onClick={handleProfile}> Profile </MenuItem>
                                <MenuItem onClick={handleLogout}> Logout </MenuItem>
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
export default RefugeeNavigationBar;