import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Box, Link } from "@mui/material";
import UserService from "../../services/UserService";
import { ReactSession } from 'react-client-session';
import { ThemeProvider } from "styled-components";
import MyTheme from './../../controls/MyTheme';
import Paper from '@mui/material/Paper';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import { Divider } from "@mui/material";
import Button from '@mui/material/Button';
import ChangePasswordDialog from "./ChangePasswordDialog";

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const UserProfile = () => {

    const id = ReactSession.get('id');

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [openChangePassword, setOpenChangePassword] = useState(false);

    const getUser = async () => {
        try {

            UserService.getUser(id)
                .then(
                    response => {
                        setUser(response.data);
                    }
                )

        } catch (error) {
            setUser(null);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (

        <ThemeProvider theme={MyTheme}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '50%' }}>
                    <Paper variant='outlined' sx={{ width: '100%', mb: 2, borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                            <Box sx={{ width: '60%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <AdminPanelSettingsIcon sx={{ fontSize: 50 }} color='primary' />
                                </div>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    readOnly
                                    value={user && user.email}
                                    label="Email"
                                    type="text"
                                    variant="outlined"
                                />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    readOnly
                                    value={user && user.firstName + ' ' + user.lastName}
                                    label="Name"
                                    type="text"
                                    variant="outlined"
                                />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    readOnly
                                    value={user && user.identifier}
                                    label="Name"
                                    type="text"
                                    variant="outlined"
                                />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    readOnly
                                    value={user && user.role.roleType}
                                    label="Role"
                                    type="text"
                                    variant="outlined"
                                />
                                <Divider sx={{ mt: 2, mb: 2 }} />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    readOnly
                                    value={user && new Date(user.accountStatus.createdOn).toLocaleString("en-US", options)}
                                    label="Creation date"
                                    type="text"
                                    variant="outlined"
                                />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    readOnly
                                    value={user && new Date(user.accountStatus.lastPasswordChangeDate).toLocaleString("en-US", options)}
                                    label="Last password change"
                                    type="text"
                                    variant="outlined"
                                />
                                <Button sx={{ mt: 2, mb: 2 }} fullWidth variant="contained" color="primary" onClick={() => { setOpenChangePassword(true) }}> Change password </Button>
                                <ChangePasswordDialog open={openChangePassword} onClose={() => { getUser(); setOpenChangePassword(false) }} />
                            </Box>
                        </div>
                    </Paper>
                </Box>
            </div>
        </ThemeProvider >

    );

}

export default UserProfile;