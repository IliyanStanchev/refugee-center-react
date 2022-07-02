import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Button, CircularProgress, Dialog, DialogActions, DialogContentText } from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import Backdrop from '@mui/material/Backdrop';
import { ReactSession } from 'react-client-session';
import ReactCodeInput from "react-code-input";
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './../../controls/MyTheme';
import VerificationCodeService from "../../services/VerificationCodeService";
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import ChangePasswordDialog from "./ChangePasswordDialog";


const ResetPassword = () => {

    const navigate = useNavigate();
    let { token, id } = useParams();

    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {

        if (token === undefined || id === undefined) {
            navigate("/");
        }

        if (token === null || id === null) {
            navigate("/");
        }

        let verificationCode = {
            code: token,
            user: {
                id: id
            }
        }

        VerificationCodeService.resetPasswordVerificationCode(verificationCode)
            .then(response => {
                ReactSession.set("id", id);
                setOpen(true);
            })
            .catch(error => {
                setError(true);
                setErrorMessage(error.response.data);
            });
    }, []);

    return (
        <ThemeProvider theme={MyTheme}>
            <Dialog open={error}>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
                    <NoEncryptionGmailerrorredIcon color='primary' style={{ fontSize: '100px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>

                    <DialogTitle> Token authentication </DialogTitle>
                </div>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {errorMessage}
                    </DialogContentText>
                </DialogContent>
                <Button variant="contained" onClick={() => {
                    navigate("/")
                }}> Go back </Button>
            </Dialog>
            <ChangePasswordDialog open={open} resetPasswordMode={true} onClose={() => { setOpen(true); }} />
        </ThemeProvider>
    );
};
export default ResetPassword;