import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Dialog, DialogActions, Button, DialogContentText, TextField } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import Backdrop from '@mui/material/Backdrop';
import { ReactSession } from 'react-client-session';
import ReactCodeInput from "react-code-input";
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './../../controls/MyTheme';
import { useNavigate } from "react-router-dom";
import VerificationCodeService from "../../services/VerificationCodeService";

const VerifyRefugeeDialog = () => {

    const navigate = useNavigate();

    const id = ReactSession.get("id");

    const [counter, setCounter] = React.useState(0);
    const [startTimer, setStartTimer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleAction = () => {

        if (id === undefined || id === null || id <= 0) {
            setMessage('Please reload the page and try again.');
            return;
        }

        setError('');
        setLoading(true);

        let verificationCode = {
            code: code,
            user: {
                id: id
            }
        }

        VerificationCodeService.verifyVerificationCode(verificationCode)
            .then(response => {
                navigate('/refugee');
            })
            .catch(error => {
                setMessage(error.response.data);
                setLoading(false);
            });
    }

    const handleSendNewCode = (event) => {

        if (id === undefined || id === null || id <= 0) {
            setMessage('Please reload the page and try again.');
            return;
        }

        setLoading(true);
        setCounter(60);
        setStartTimer(true);

        let user = {
            id: id,
        }

        try {

            VerificationCodeService.sendVerificationCode(user)
                .then(response => {
                    setMessage('Code succesfully sent!');
                    setLoading(false)
                })
                .catch(error => {
                    setMessage(error.response.data);
                    setLoading(false)
                    setCounter(0);
                    setStartTimer(false);
                });
        }
        catch (error) {
            setMessage(error.response.data);
            setLoading(false)
            setCounter(0);
            setStartTimer(false);
        }
    }

    useEffect(() => {

        if (!startTimer) {
            setCounter(0);
            return;
        }

        const timer =
            counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return (
        <ThemeProvider theme={MyTheme}>
            <Dialog open={true} >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <DialogTitle> Refuge Verification </DialogTitle>
                    <Backdrop open={loading}>
                        <CircularProgress
                            size={60}
                            sx={{
                                color: lightGreen[800],
                                mt: 1,
                            }}
                        />
                    </Backdrop>
                </div>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ color: lightGreen[800] }}> {message} </p>
                    </div>
                    <DialogContentText id="alert-dialog-description">
                        Welcome to Safe Shelter! We need to verify your identity to make sure no one but you is allowed to access your account.
                        Please enter the code sent to your phone number.
                    </DialogContentText>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 19, marginBottom: 3 }}>
                        <ReactCodeInput
                            sx={{ mt: 2, mb: 2 }}
                            name="resetPassword"
                            inputMode="numeric"
                            fields={8}
                            type="text"
                            onChange={(e) => setCode(e)}

                        />

                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            disabled={counter > 0}
                            onClick={(event) => handleSendNewCode(event)}
                        >
                            {counter <= 0 ? 'Send verification code' : ('Resend in') + ' ' + counter + ' seconds'}
                        </Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button disabled={loading} variant="contained" onClick={handleAction}> Verify your account </Button>
                </DialogActions>

            </Dialog >
        </ThemeProvider>
    );

}

export default VerifyRefugeeDialog;