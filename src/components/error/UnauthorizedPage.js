import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Dialog, DialogActions, Button, DialogContentText, TextField } from "@mui/material";
import NoEncryptionGmailerrorredIcon from '@mui/icons-material/NoEncryptionGmailerrorred';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './../../controls/MyTheme';
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {

    const navigate = useNavigate();

    return (
        <ThemeProvider theme={MyTheme}>
            <Dialog open={true} >
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
                    <NoEncryptionGmailerrorredIcon color='primary' style={{ fontSize: '100px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>

                    <DialogTitle> Unauthorized access </DialogTitle>
                </div>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We are sorry, but you are not authorized to access this page.
                        <br></br> We suggest logging in again.
                    </DialogContentText>
                </DialogContent>
                <Button variant="contained" onClick={() => { navigate("/") }}> Go back </Button>
            </Dialog >
        </ThemeProvider>
    );

}

export default UnauthorizedPage;