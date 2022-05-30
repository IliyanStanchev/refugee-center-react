import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { Box, Link } from "@mui/material";
import { Dialog, DialogActions, Button } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import DonationService from "../../services/DonationService";
import Divider from '@mui/material/Divider';
import { green } from '@mui/material/colors';
import { CircularProgress } from "@mui/material";

const MIN_VALUE = 1;
const MAX_VALUE = 100000;

const AddDonationDialog = (props) => {

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

    let { open, onClose } = props;

    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');


    const [donations, setDonations] = useState([]);

    const [donationError, setDonationError] = useState(false);
    const [donorError, setDonorError] = useState(false);

    const [donation, setDonation] = useState(null);
    const [donationType, setDonationType] = useState('Other');
    const [donationUnit, setDonationUnit] = useState('Count');
    const [donationQuantity, setDonationQuantity] = useState(1);

    const [donatorName, setDonatorName] = useState('');
    const [donatorEmail, setDonatorEmail] = useState('');

    const setSelectedDonation = (newDonation) => {

        if (typeof newDonation === 'string') {

            let addDonation = {
                id: 0,
                donationType: 'Other',
                name: newDonation,
                quantity: 1,
                unit: 'Count',
            }

            setDonation(addDonation);
            setDonationType(addDonation.donationType);
            setDonationUnit(addDonation.unit);
            setDonationQuantity(addDonation.quantity);
            return;
        }

        setDonation(newDonation);
        setDonationType(newDonation.donationType);
        setDonationUnit(newDonation.unit);
    };

    const handleSave = () => {

        setMessage('');
        setDonationError(false);
        setDonorError(false);

        if (donation.name.length == 0) {
            setDonationError(true);
            return;
        };

        if ((donatorEmail.length == 0 && donatorName.length != 0)
            || (donatorEmail.length != 0 && donatorName.length == 0)) {
            setDonorError(true);
            return;
        }

        setLoading(true);

        let donationData = {
            donation: {
                id: donation.id,
                donationType: donationType,
                name: donation.name,
                quantity: donationQuantity,
                unit: donationUnit,
            },
            donor: {
                email: donatorEmail,
                name: donatorName,
            }
        };

        DonationService.saveDonation(donationData)
            .then(response => {
                setLoading(false);
                setMessage("Donation saved successfully. Don't forget to thank the donor!");
            })
            .catch(error => { setLoading(false); setMessage(error.data); });
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

    return (
        <Dialog fullWidth
            maxWidth="xs" open={open} onClose={() => onClose()}>
            <Box sx={{
                flexDirection: 'column',
                textAlign: 'center',
            }}>
                <DialogTitle> Donation </DialogTitle>
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress
                            size={40}
                            sx={{
                                color: green[500],
                                mt: 1,
                            }}
                        />

                    </div>
                )}
                <p style={{ color: green[500] }}> {message} </p>
                <DialogContent>
                    <Autocomplete
                        sx={{ mt: 2, mb: 2 }}
                        id="name"
                        fullWidth
                        freeSolo
                        clearOnBlur
                        handleHomeEndKeys
                        defaultValue={donation}
                        value={donation}
                        options={donations}
                        onChange={(event, newValue) => {
                            setSelectedDonation(newValue);
                        }}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
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
                        sx={{ mt: 2, mb: 2 }}
                        fullWidth
                        readOnly={donation && donation.id > 0}
                        id="donationType"
                        value={donationType}
                        options={donationTypes}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(event, newValue) => {
                            setDonationType(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
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
                        sx={{ mb: 2 }}
                        value={donationQuantity}
                        id="quantity"
                        label="Quantity"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{ inputProps: { min: MIN_VALUE, max: MAX_VALUE } }}
                        onChange={(event) => {
                            var value = parseInt(event.target.value, 10);

                            if (isNaN(value)) value = MIN_VALUE;
                            if (value > MAX_VALUE) value = MAX_VALUE;
                            if (value < MIN_VALUE) value = MIN_VALUE;

                            setDonationQuantity(value);
                        }}
                    />
                    <Autocomplete
                        sx={{ mt: 2, mb: 2 }}
                        id="donationType"
                        readOnly={donation && donation.id > 0}
                        value={donationUnit}
                        options={units}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(event, newValue) => {
                            setDonationUnit(newValue);
                        }}

                        autoHighlight
                        getOptionLabel={(option) => option}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
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

                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="donatorEmail"
                        label="Donator Email ( Optional )"
                        value={donatorEmail}
                        type="text"
                        variant="outlined"
                        onChange={(event) => {
                            setDonatorEmail(event.target.value);
                        }}
                        error={donorError}
                        helperText={donorError ? 'Enter email' : ''}
                    />
                    <TextField
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="donatorName"
                        label="Donator Name ( Optional )"
                        value={donatorName}
                        type="text"
                        variant="outlined"
                        onChange={(event) => {
                            setDonatorName(event.target.value);
                        }}
                        error={donorError}
                        helperText={donorError ? 'Enter name' : ''}
                    />
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

export default AddDonationDialog;