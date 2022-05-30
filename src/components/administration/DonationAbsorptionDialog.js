import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { Box, Link } from "@mui/material";
import { Dialog, DialogActions, Button } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import DonationService from "../../services/DonationService";
import { green } from '@mui/material/colors';
import { CircularProgress } from "@mui/material";
import DonationAbsorptionService from "../../services/DonationAbsorptionService";
import DialogContentText from '@mui/material/DialogContentText';

const MIN_VALUE = 0;

const DonationAbsorptionDialog = (props) => {

    let { shelterId, donation, open, onClose } = props;

    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [donations, setDonations] = useState([]);

    const setSelectedDonation = (newDonation) => {

        donation.donation = newDonation;
        setReload(!reload);
    };

    const setAbsorption = (absorption) => {
        donation.absorption = absorption;
        setReload(!reload);
    };

    const handleSave = () => {

        setMessage('');

        if (donation.donation == null)
            return;

        DonationAbsorptionService.saveDonationAbsorption(donation)
            .then(response => {
                setLoading(false);
                onClose();
            })
            .catch(error => { setLoading(false); setMessage(error.data); });
    }

    const getDonations = async () => {
        try {

            DonationAbsorptionService.getNewShelterAbsorptions(shelterId)
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
                <DialogTitle> Donation Absorption </DialogTitle>
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
                    {donations.length < 0 || (donation && donation.id > 0) ? (
                        <>
                            <Autocomplete
                                sx={{ mt: 2, mb: 2 }}
                                id="name"
                                fullWidth
                                readOnly={donation && donation.id > 0}
                                clearOnBlur
                                handleHomeEndKeys
                                defaultValue={donation && donation.donation}
                                value={donation && donation.donation}
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
                                        label="Donation"
                                        inputProps={{
                                            ...params.inputProps
                                        }}
                                    />
                                )}></Autocomplete>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                value={donation && donation.donation && donation.donation.donationType}
                                id="donationType"
                                label="Donation type"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                readOnly
                            />
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                value={donation && donation.donation && donation.donation.quantity + ' ' + donation.donation.unit}
                                id="quantity"
                                label="Quantity"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                readOnly
                            />
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                value={donation && donation.absorption}
                                id="quantity"
                                label="Quantity"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{ inputProps: { min: MIN_VALUE, max: donation == null ? MIN_VALUE : donation.donation == null ? MIN_VALUE : donation.donation.quantity } }}
                                onChange={(event) => {
                                    var value = parseInt(event.target.value, 10);

                                    if (isNaN(value)) value = MIN_VALUE;
                                    if (donation && donation.donation && value > donation.donation.quantity) value = donation == null ? 0 : donation.donation.quantity;
                                    if (value < MIN_VALUE) value = MIN_VALUE;

                                    setAbsorption(value);
                                }}
                            /> </>) : (<DialogContentText> No donations to absorb </DialogContentText>)}
                </DialogContent>
                <DialogActions>
                    {donations.length < 0 || (donation && donation.id > 0) && <Button
                        variant="contained"
                        disabled={loading}
                        onClick={handleSave}
                    >
                        Save
                    </Button>}
                    <Button variant="contained" disabled={loading} onClick={() => onClose()}> {donations.length < 0 || (donation && donation.id > 0) ? 'Cancel' : 'OK'} </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );

}

export default DonationAbsorptionDialog;