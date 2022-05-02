import React, { useRef, useState } from 'react';
import UserService from '../../services/UserService';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { Link, useNavigate } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Reaptcha from 'reaptcha';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import validator from 'validator';
import Tooltip from '@mui/material/Tooltip';
import env from "react-dotenv";

const ADMINISTRATOR = env.ADMINISTRATOR;
const MODERATOR = env.MODERATOR;
const CUSTOMER = env.CUSTOMER;

export default function LoginComponent() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState(null);
    const [reCaptchaMessage, setReCaptchaMessage] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();

    const handleOnVerify = (recaptchaResponse) => {
        setIsVerified(true);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleValidation = (email, password) => {
        if (validator.isEmail(email) === false) {
            return false;
        }

        if (password.length < 3) {
            return false;
        }
    }

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoginMessage(null);
        setReCaptchaMessage(null);

        if (handleValidation(email, password) == false)
            return;

        if (isVerified == false) {
            setReCaptchaMessage("Please verify reCaptcha")
            return;
        }

        let user = {
            email: email,
            password: password
        }

        UserService.authenticateUser(user)
            .then(response => loginUser(
                response.data.id,
                response.data.role,
            ))
            .catch(setLoginMessage('Wrong username or password.'));

        setIsVerified(false);
        window.grecaptcha.reset();
    }

    const loginUser = (id, role) => {

        if (id == null)
            return;

        if (role.roleType == ADMINISTRATOR)
            navigate('/admin', { state: { id: id } });

        if (role.roleType == MODERATOR)
            navigate('/admin', { state: { id: id } });

        if (role.roleType == CUSTOMER)
            navigate('/admin');

        setLoginMessage('Wrong username or password.');
    }


    return (
        <ValidatorForm
            noValidate={true}
            onSubmit={handleSubmit}

        >
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                    {loginMessage && <p style={{ color: "red" }} >{loginMessage}</p>}
                    <TextValidator
                        sx={{ width: 300, mt: 2, mb: 2 }}
                        label="Email"
                        onChange={handleEmailChange}
                        name="email"
                        value={email}
                        required
                        validators={['required', 'isEmail']}
                        errorMessages={['Enter email', 'Wrong email format']}
                    />
                    <TextValidator
                        sx={{ width: 300, mt: 2, mb: 2 }}
                        label="Password"
                        onChange={handlePasswordChange}
                        name="password"
                        type="password"
                        value={password}
                        required
                        validators={['required', 'minStringLength:3']}
                        errorMessages={['Enter password', 'Password must be at least 3 characters long']}
                    />
                    <Reaptcha
                        sitekey="6LcvR68fAAAAAJOX3feeHRMvDMe3J2bxVIyY0k9O"
                        onVerify={handleOnVerify} />
                    {reCaptchaMessage && <p style={{ color: "red" }} >{reCaptchaMessage}</p>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}

                    >
                        Login
                    </Button>
                    <Grid container sx={{ mt: 1, mb: 2 }} >
                        <Grid item xs>
                            <Link to="/forgot-password" variant="body2">
                                Forgot password
                            </Link>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Tooltip title="In order to register as a refugee you need to visit our office. For more information click the Contact tab">
                                <p variant="body2">
                                    {"I am a refugee"}
                                </p>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ValidatorForm >
    );
}