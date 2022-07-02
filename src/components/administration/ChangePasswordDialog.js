import React, { useState } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Box, Button, Dialog, DialogActions, IconButton } from "@mui/material";
import { ReactSession } from 'react-client-session';
import PasswordStrengthBar from "react-password-strength-bar";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import UserService from "../../services/UserService";
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";

const ChangePasswordDialog = (props) => {

    const id = ReactSession.get('id');
    const navigate = useNavigate();

    const { open, resetPasswordMode, onClose } = props;

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [passwordChanged, setPasswordChanged] = useState(false);

    const onChangePassword = () => {

        if (passwordChanged) {
            navigate("/");
            return;
        }

        setError('');
        setMessage('');

        if (oldPassword === newPassword) {
            setError('Old password and new password must be different');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        if (newPassword != confirmPassword) {
            setError('New password and confirm password must be the same');
            return;
        }

        let accountData = {
            id: id,
            resetPasswordMode: resetPasswordMode,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        UserService.changePassword(accountData)
            .then(response => handleSuccess())
            .catch(error => setError(error.response.data));
    }

    const handleSuccess = () => {

        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage("Password changed successfully");

        if (resetPasswordMode) {
            setPasswordChanged(true);
        }
    }

    return (
        <Dialog fullWidth
            maxWidth="xs" open={open} onClose={() => onClose()}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                m: 'auto',
                width: 'fit-content',
                textAlign: 'center',
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                    <LockIcon color='primary' sx={{ fontSize: 50 }} />
                </div>
                <DialogTitle> {resetPasswordMode ? 'Set your password' : 'Change password'} </DialogTitle>
                <p style={{ color: 'red' }}> {error} </p>
                <p style={{ color: 'green' }}> {message} </p>
                <DialogContent>
                    {!resetPasswordMode && <FormControl variant="outlined" fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel htmlFor="outlined-adornment-oldPassword">Old password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-oldPassword"
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        edge="end"
                                    >
                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Old password"
                        />
                    </FormControl>}
                    {!passwordChanged && <FormControl variant="outlined" fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel htmlFor="outlined-adornment-newPassword">New password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="New password"
                        />
                    </FormControl>}
                    {!passwordChanged &&
                        < PasswordStrengthBar
                            minLength={8}
                            password={newPassword}
                            barColors={[
                                "#B83E26",
                                "#FFB829",
                                "#009200",
                                "#009200",
                                "#009200",
                                "#009200"
                            ]}
                        />}
                    {!passwordChanged && <FormControl variant="outlined" fullWidth sx={{ mt: 2, mb: 2 }}>
                        <InputLabel htmlFor="outlined-adornment-password">Confirm password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm password"
                        />
                    </FormControl>}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={onChangePassword}> {passwordChanged ? 'Go to Home page' : 'Change password'}</Button>
                    {!resetPasswordMode && <Button variant="contained" onClick={() => onClose()}>Cancel</Button>}
                </DialogActions>
            </Box>
        </Dialog>
    );

}

export default ChangePasswordDialog;