import React, { useRef } from 'react';
import UserService from '../../services/UserService';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Reaptcha from 'reaptcha';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import validator from 'validator';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightGreen } from '@mui/material/colors';
import MyTheme from '../../controls/MyTheme';


export default class ForgotPasswordComponent extends React.Component {

    state = {
        user: {
            email: '',
        },
        successMessage: null,
        errorMessage: null,
        reCaptchaMessage: null,
        isVerified: false,
    }

    onVerify = recaptchaResponse => {
        this.setState({
            isVerified: true
        });
    };

    handleChange = (event) => {
        const { user } = this.state;
        user[event.target.name] = event.target.value;
        this.setState({ user });
    }

    handleValidation = (email) => {
        if (validator.isEmail(email) == false) {
            return false;
        }
    }

    handleSubmit = async (event) => {

        event.preventDefault();
        this.setState({ successMessage: null, errorMessage: null, reCaptchaMessage: null });
        const email = this.state.user.email;

        if (this.handleValidation(email) == false)
            return;

        if (this.state.isVerified == false) {
            this.setState({ reCaptchaMessage: "Please verify reCaptcha" })
            return;
        }

        let user = {
            email: email,
        }

        UserService.sendNewPassword(user)
            .then(response => this.handleResponse(response))

        this.setState({ isVerified: false });
        window.grecaptcha.reset();
    }

    handleResponse = (response) => {

        if (response.status == 200) {
            this.setState({ successMessage: "Check your email for new password." });

        }
        else if (response.status == 204) {
            this.setState({ errorMessage: "User with this email doesn't exist." });

        }
        else {
            this.setState({ errorMessage: "There was a problem sending you email. Try again later." });
        }

    }

    render() {
        const { user, errorMessage, successMessage, reCaptchaMessage } = this.state;
        return (
            <ThemeProvider theme={MyTheme}>
                <ValidatorForm
                    noValidate={true}
                    onSubmit={this.handleSubmit}

                >
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 22,
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                            <Avatar sx={{ bgcolor: lightGreen[800] }}>
                                <LockOutlinedIcon />
                            </Avatar>
                        </div>
                        <Typography component="h1" variant="h5">
                            Forgot password
                        </Typography>
                        <Box sx={{ mt: 3, mb: 3 }}>
                            {errorMessage && <p style={{ color: "red" }} >{errorMessage}</p>}
                            {successMessage && <p style={{ color: lightGreen[800] }}>{successMessage}</p>}
                            <TextValidator
                                sx={{ width: 300, mt: 3, mb: 3 }}
                                label="Email"
                                onChange={this.handleChange}
                                name="email"
                                value={user.email}
                                required
                                validators={['required', 'isEmail']}
                                errorMessages={['Enter email', 'Wrong email format']}
                            />
                            <div style={{ display: 'flex', justifyContent: 'center' }} >
                                <Reaptcha
                                    sitekey="6LcvR68fAAAAAJOX3feeHRMvDMe3J2bxVIyY0k9O"
                                    onVerify={this.onVerify}
                                    reset />
                            </div>
                            {reCaptchaMessage && <p style={{ textAlign: 'center', color: "red" }} >{reCaptchaMessage}</p>}
                            <Button
                                type="submit"

                                variant="contained"
                                sx={{ width: 300, mt: 5, mb: 3 }}
                            >
                                Send new password
                            </Button>
                        </Box>
                    </Box>
                </ValidatorForm >
            </ThemeProvider>
        );
    }
}