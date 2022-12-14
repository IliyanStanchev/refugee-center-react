import React, { useState } from 'react';
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
import validator from 'validator';
import Tooltip from '@mui/material/Tooltip';
import { ReactSession } from 'react-client-session';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import MyTheme from '../../controls/MyTheme';
import lightGreen from '@mui/material/colors/lightGreen';
import { TextField } from '@mui/material';

const ADMINISTRATOR = process.env.REACT_APP_ADMINISTRATOR;
const MODERATOR = process.env.REACT_APP_MODERATOR;
const CUSTOMER = process.env.REACT_APP_CUSTOMER;

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
            .then(response => handleResponse(response))
            .catch(error => handleError(error.response));


        setIsVerified(false);
        window.grecaptcha.reset();
    }

    const handleResponse = (response) => {

        if (response.status == process.env.REACT_APP_HTTP_STATUS_OK) {

            loginUser(response.data);
        } else {
            handleError(response);
        }
    }

    const handleError = (response) => {

        if (response.status == process.env.REACT_APP_HTTP_STATUS_INTERNAL_SERVER_ERROR) {
            setLoginMessage("Something went wrong. Please try again later");
        } else if (response.status == process.env.REACT_APP_HTTP_STATUS_CUSTOM_SERVER_ERROR) {
            setLoginMessage(response.data);
        } else {
            setLoginMessage("Something went wrong. Please try again later");
        }
    }

    const loginUser = (userSession) => {

        let id = userSession.user.id;
        let role = userSession.user.role;

        if (id == null)
            return;

        ReactSession.set('id', id);
        ReactSession.set('authorization', userSession.authorizationToken);

        if (role.roleType == ADMINISTRATOR)
            navigate('/admin');

        if (role.roleType == MODERATOR)
            navigate('/moderator');

        if (role.roleType == CUSTOMER)
            navigate('/refugee');

        setLoginMessage('Wrong username or password.');
    }


    return (
        <ThemeProvider theme={MyTheme}>
            <CssBaseline />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box container
                    sx={{
                        alignItems: 'center',
                        textAlign: 'center',
                        marginTop: 8,
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar sx={{ bgcolor: lightGreen[800] }}>
                            <LockOutlinedIcon />
                        </Avatar>
                    </div>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box sx={{ mt: 2, mb: 2 }}>
                        {loginMessage && <p style={{ color: "red" }}>{loginMessage}</p>}
                        <TextField
                            sx={{ width: 300, mt: 1, mb: 2 }}
                            label="Email"
                            onChange={handleEmailChange}
                            name="email"
                            value={email}
                            required

                        />
                        <TextField
                            sx={{ width: 300, mt: 1, mb: 2 }}
                            label="Password"
                            onChange={handlePasswordChange}
                            name="password"
                            type="password"
                            value={password}
                            required

                        />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Reaptcha
                                sitekey="6LcvR68fAAAAAJOX3feeHRMvDMe3J2bxVIyY0k9O"
                                onVerify={handleOnVerify}
                            />
                        </div>
                        {reCaptchaMessage && <p style={{ color: "red" }}>{reCaptchaMessage}</p>}
                        <Button
                            sx={{ mt: 2, mb: 2 }}
                            onClick={handleSubmit}
                            variant="contained"
                        >
                            Login
                        </Button>
                        <Grid container sx={{ mt: 1, mb: 2 }}>
                            <Grid item xs>
                                <Link to="/forgot-password" variant="body2">
                                    Forgot password
                                </Link>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ mt: 2, mb: 2 }}>
                            <Grid item xs>
                                <Tooltip
                                    title="In order to register as a refugee you need to visit our office. For more information click the Contact tab">
                                    <Link to="/" variant="body2">
                                        I am a refugee
                                    </Link>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </div>
        </ThemeProvider>
    );
}