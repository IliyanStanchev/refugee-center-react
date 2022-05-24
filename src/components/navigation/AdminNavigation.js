import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import logoImage from "../../images/safe_shelter_logo.png"
import { lightGreen } from '@mui/material/colors';

const AdminNavigationBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

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
        navigate('/admin/registration');
    };

    const handleConfirmRegistrations = () => {
        navigate('/admin/confirm-registrations');
    };
    const handleGroups = () => {
        navigate('/admin/groups');
    };

    const handleMessages = () => {
        navigate('/admin/messages');
    };

    const handleFacilities = () => {
        navigate('/admin/facilities');
    };

    const handleDonations = () => {
        navigate('/admin/donations');
    };

    const handleProfile = () => {
        setAnchorElUser(null);
        navigate('/admin/profile');
    };

    const handleLogout = () => {
        setAnchorElUser(null);
        navigate('/');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: lightGreen[800] }}>
            <Container maxWidth="x1">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"

                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
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
                        }} />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
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
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={handleRegisterUser}> Register User </MenuItem>
                            <MenuItem onClick={handleConfirmRegistrations}> Confirm Registrations </MenuItem>
                            <MenuItem onClick={handleGroups}> Groups </MenuItem>
                            <MenuItem onClick={handleMessages}> Messages </MenuItem>
                            <MenuItem onClick={handleFacilities}> Facilities </MenuItem>
                            <MenuItem onClick={handleDonations}> Donations </MenuItem>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
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
                        }} />
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            onClick={handleRegisterUser}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Register user
                        </Button>
                        <Button
                            onClick={handleConfirmRegistrations}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Confirm registrations
                        </Button>
                        <Button
                            onClick={handleGroups}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Groups
                        </Button>
                        <Button
                            onClick={handleMessages}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Messages
                        </Button>
                        <Button
                            onClick={handleFacilities}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Facilities
                        </Button>
                        <Button
                            onClick={handleDonations}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Donations
                        </Button>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
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
        </AppBar >
    );
};
export default AdminNavigationBar;