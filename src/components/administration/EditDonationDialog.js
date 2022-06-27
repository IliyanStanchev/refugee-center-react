import React, {useEffect, useState} from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import {Box, Button, CircularProgress, Dialog, DialogActions} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import DonationService from "../../services/DonationService";
import {green} from '@mui/material/colors';

const MIN_VALUE = 1;
const MAX_VALUE = 100000;

const EditDonationDialog = (props) => {

    const donationTypes = [
        'Money'
        , 'Food'
        , 'Clothes'
        , 'Medicines'
        , 'Stocks'
        , 'Other'
    ]

    const units = [
        'KG'
        , 'Count'
        , 'USD'
    ]

    let {donation, open, onClose, readOnly} = props;

    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [donations, setDonations] = useState([]);

    const [donationError, setDonationError] = useState(false);
    const [donorError, setDonorError] = useState(false);

    const [donatorName, setDonatorName] = useState('');
    const [donatorEmail, setDonatorEmail] = useState('');

    const setSelectedDonation = (newDonation) => {

        if (newDonation == null) {
            return;
        }

        if (typeof newDonation === 'string') {

            let addDonation = {
                id: 0,
                donationType: 'OTHER',
                name: newDonation,
                quantity: 1,
                unit: 'COUNT',
            }

            donation.id = addDonation.id;
            donation.donationType = addDonation.donationType;
            donation.name = addDonation.name;
            donation.quantity = addDonation.quantity;
            donation.unit = addDonation.unit;

            return;
        }

        donation.id = newDonation.id;
        donation.name = newDonation.name;
        donation.unit = newDonation.unit;
        donation.donationType = newDonation.donationType;
        getDonations();
    };

    const setDonationType = (newType) => {

        donation.donationType = newType;
        setReload(!reload);
    };

    const setQuantity = (newQuantity) => {
        donation.quantity = newQuantity;
        setReload(!reload);
    };

    const setUnit = (newUnit) => {

        donation.unit = newUnit;
        setReload(!reload);
    };

    const handleSave = () => {

        setMessage('');
        setDonationError(false);
        setDonorError(false);

        if (donation.name.length == 0) {
            setDonationError(true);
            return;
        }

        if ((donatorEmail.length == 0 && donatorName.length != 0)
            || (donatorEmail.length != 0 && donatorName.length == 0)) {
            setDonorError(true);
            return;
        }

        setLoading(true);

        DonationService.updateDonation(donation)
            .then(response => {
                setLoading(false);
                onClose();
            })
            .catch(error => {
                setLoading(false);
                setMessage(error.data);
            });
    }

    const getDonations = async () => {

        try {

            DonationService.getDonations()
                .then(
                    response => {
                        setDonations(response.data);
                    }
                )

        } catch (error) {
            setDonations([]);
        }
    };

    useEffect(() => {
        getDonations();
    }, []);

    const onLastInputChange = e => {
        const target = e.target;
        const keyboardEvent = new KeyboardEvent("keypress", {
            bubbles: true,
            cancelable: true,
            key: "Tab",
            shiftKey: false,
            keyCode: 13
        });
        target.dispatchEvent(keyboardEvent);
    }

    return (
        <Dialog fullWidth
                maxWidth="xs" open={open} onClose={() => onClose()}>
            <Box sx={{
                flexDirection: 'column',
                textAlign: 'center',
            }}>
                <DialogTitle> Donation </DialogTitle>
                {loading && (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress
                            size={40}
                            sx={{
                                color: green[500],
                                mt: 1,
                            }}
                        />

                    </div>
                )}
                <p style={{color: green[500]}}> {message} </p>
                <DialogContent>
                    <Autocomplete
                        sx={{mt: 2, mb: 2}}
                        id="name"
                        fullWidth
                        freeSolo
                        readOnly
                        clearOnBlur
                        handleHomeEndKeys
                        defaultValue={donation}
                        value={donation}
                        options={donations}
                        onChange={(event, newValue) => {
                            setSelectedDonation(newValue);
                            onLastInputChange(event);

                        }}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                                {option.name}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={donationError}
                                helperText={donationError ? 'Select donation' : ''}
                                label="Donation"
                                inputProps={{
                                    ...params.inputProps

                                }}
                            />
                        )}></Autocomplete>
                    <Autocomplete
                        sx={{mt: 2, mb: 2}}
                        fullWidth
                        id="donationType"
                        value={donation && donation.donationType}
                        options={donationTypes}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(event, newValue) => {
                            setDonationType(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                                {option}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                {...params}
                                label="Donation type"
                                inputProps={{
                                    ...params.inputProps
                                }}
                            />
                        )}></Autocomplete>
                    <TextField
                        fullWidth
                        sx={{mb: 2}}
                        value={donation && donation.quantity}
                        id="quantity"
                        label="Quantity"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{inputProps: {min: MIN_VALUE, max: MAX_VALUE}}}
                        onChange={(event) => {
                            var value = parseInt(event.target.value, 10);

                            if (isNaN(value)) value = MIN_VALUE;
                            if (value > MAX_VALUE) value = MAX_VALUE;
                            if (value < MIN_VALUE) value = MIN_VALUE;

                            setQuantity(value);
                        }}
                    />
                    <Autocomplete
                        sx={{mt: 2, mb: 2}}
                        id="donationType"
                        value={donation && donation.unit}
                        options={units}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(event, newValue) => {
                            setUnit(newValue);
                        }}

                        autoHighlight
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
                                {option}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Unit"
                                inputProps={{
                                    ...params.inputProps
                                }}
                            />
                        )}></Autocomplete>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button variant="contained" disabled={loading} onClick={() => onClose()}> Cancel </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );

}

export default EditDonationDialog;