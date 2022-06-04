import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { red } from "@mui/material/colors";
import Paper from '@mui/material/Paper';
import { ThemeProvider } from "styled-components";
import MyTheme from './../../controls/MyTheme';
import { TextField } from "@mui/material";
import { Divider, Button } from "@mui/material";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import RequestService from "../../services/RequestService";
import { ReactSession } from 'react-client-session';
import lightGreen from '@material-ui/core/colors/lightGreen';
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from "@mui/material";

const RequestMedicalHelp = () => {

    const id = ReactSession.get('id');

    const [reason, setReason] = useState('');

    const [errorReason, setErrorReason] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {

        setErrorMessage('');
        setMessage('');

        setErrorReason(false);

        if (reason === '') {
            setErrorReason(true);
            return;
        }

        let medicalHelpRequest = {
            refugee: {
                id: id
            },
            description: reason,
        }

        setLoading(true);

        RequestService.requestMedicalHelp(medicalHelpRequest)
            .then(response => {
                setMessage("Request sent successfully");
                setReason('');
                setLoading(false);
            }).catch(error => {
                setErrorMessage(error.response.data);
                setLoading(false);
            });
    }

    return (
        <ThemeProvider theme={MyTheme}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <Backdrop open={loading}>
                    <CircularProgress
                        size={60}
                        sx={{
                            color: lightGreen[800],
                            mt: 1,
                        }}
                    />
                </Backdrop>
                <Box sx={{ width: '30%' }}>
                    <Paper variant='outlined' sx={{ width: '100%', mb: 2, borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                            <Box sx={{ width: '70%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <MedicalServicesIcon sx={{ fontSize: 50 }} color='primary' />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ color: red }}>{errorMessage}</p>
                                    <p style={{ color: lightGreen[900] }}>{message}</p>
                                </div>

                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="stock"
                                    value={reason}
                                    onChange={(event) => { setReason(event.target.value); setErrorReason(false); }}
                                    multiline
                                    label="Reason for your request"
                                    type="text"
                                    variant="outlined"
                                    error={errorReason}
                                    helperText={errorReason ? 'Please enter a reason' : ''}
                                />
                                <Button disabled={loading} sx={{ mt: 2, mb: 5 }} fullWidth variant="contained" color="primary" onClick={handleSubmit}> Request medical help </Button>
                            </Box>
                        </div>
                    </Paper>
                </Box>
            </div>
        </ThemeProvider >
    );
}

export default RequestMedicalHelp;