import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import { red } from "@mui/material/colors";
import Paper from '@mui/material/Paper';
import { ThemeProvider } from "styled-components";
import MyTheme from './../../controls/MyTheme';
import { TextField } from "@mui/material";
import { Divider, Button } from "@mui/material";
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import RequestService from "../../services/RequestService";
import { ReactSession } from 'react-client-session';
import lightGreen from '@material-ui/core/colors/lightGreen';
import { Autocomplete } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FacilityInfo from './../administration/FacilityInfo';
import { Dialog, DialogActions } from "@mui/material";
import FacilityService from "../../services/FacilityService";

const RequestLocationChange = () => {

    const id = ReactSession.get('id');

    const [facility, setFacility] = useState(null);
    const [reason, setReason] = useState('');

    const [errorFacility, setErrorFacility] = useState(false);
    const [errorReason, setErrorReason] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');

    const [facilities, setFacilities] = useState([]);
    const [open, setOpen] = useState(false);
    const [dialogFacility, setDialogFacility] = useState(null);

    useEffect(() => {
        getFacilities();
    }, []);

    const getFacilities = async () => {
        try {

            FacilityService.getSheltersForTransfer(id)
                .then(
                    response => {
                        setFacilities(response.data);
                    }
                )

        } catch (error) {
            setFacilities([]);
        }
    };

    const handleSubmit = (event) => {

        setErrorMessage('');
        setMessage('');

        setErrorReason(false);
        setErrorFacility(false);

        if (facility === null) {
            setErrorFacility(true);
            return;
        }

        if (reason === '') {
            setErrorReason(true);
            return;
        }

        let locationChangeRequest = {
            refugee: {
                id: id
            },
            shelter: facility,
            reason: reason
        }

        RequestService.requestLocationChange(locationChangeRequest)
            .then(response => {
                setMessage("Request sent successfully");
                setFacility('');
                setReason('');
                getFacilities();
            }).catch(error => { setErrorMessage(error.response.data); });
    };

    return (
        <ThemeProvider theme={MyTheme}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <Box sx={{ width: '30%' }}>
                    <Paper variant='outlined' sx={{ width: '100%', mb: 2, borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                            <Box sx={{ width: '70%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <EditLocationAltIcon sx={{ fontSize: 50 }} color='primary' />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ color: red }}>{errorMessage}</p>
                                    <p style={{ color: lightGreen[900] }}>{message}</p>
                                </div>
                                <Autocomplete
                                    sx={{ mt: 2, mb: 2 }}
                                    id="facilities"
                                    value={facility}
                                    options={facilities}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(event, newValue) => {
                                        setFacility(newValue);
                                    }}
                                    autoHighlight
                                    getOptionLabel={(option) => option && option.address.countryIsoCode + ' ' + option.address.cityName + ' ' + option.address.address}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option && option.address.countryIsoCode + ' ' + option.address.cityName + ' ' + option.address.address}
                                            <Button onClick={() => {
                                                setOpen(true);
                                                setDialogFacility(
                                                    option
                                                );
                                            }}> <OpenInNewIcon /> </Button>
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            error={errorFacility}
                                            helperText={errorFacility ? 'Please select a shelter' : ''}
                                            label="New shelter"
                                            inputProps={{
                                                ...params.inputProps,

                                            }}
                                        />
                                    )}
                                />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="facility"
                                    value={reason}
                                    onChange={(event) => { setReason(event.target.value); setErrorReason(false); }}
                                    multiline
                                    label="Reason"
                                    type="text"
                                    variant="outlined"
                                    error={errorReason}
                                    helperText={errorReason ? 'Please enter a reason' : ''}
                                />
                                <p> Your request will be checked by your center responsible user.
                                    We will try our best to make it happen! </p>
                                <Button sx={{ mt: 2, mb: 5 }} fullWidth variant="contained" color="primary" onClick={handleSubmit}> Request location change </Button>
                                <Dialog open={open} onClose={() => setOpen(false)}>
                                    <FacilityInfo facility={dialogFacility} />
                                    <DialogActions>
                                        <Button variant="contained" onClick={() => setOpen(false)}>Ok</Button>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </div>
                    </Paper>
                </Box>
            </div>
        </ThemeProvider >
    );
}

export default RequestLocationChange;