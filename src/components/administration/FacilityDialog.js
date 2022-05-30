import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { Box, Link } from "@mui/material";
import { Dialog, DialogActions, Button } from "@mui/material";
import Divider from '@mui/material/Divider';
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

import DonationAbsorptionsTable from './DonationAbsorptionsTable';
import Grid from '@mui/material/Grid';
import FacilityRefugeesTable from './FacilityRefugeesTable';

const FacilityDialog = (props) => {

    let { facility, open, onClose } = props;

    const [refugeesMode, setRefugeesMode] = useState(true);
    const [reload, setReload] = useState(false);

    return (
        <Dialog fullWidth
            maxWidth="md" open={open} onClose={() => onClose()}>
            <Box sx={{
                flexDirection: 'column',
                textAlign: 'center',
            }}>
                <DialogTitle> {facility && facility.facilityType} </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                sx={{ mr: 13 }}
                                fullWidth
                                margin="dense"
                                id="name"
                                value={facility && facility.address.countryIsoCode}

                                label="Country"
                                type="text"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                id="name"
                                value={facility && facility.address.cityName}

                                label="City"
                                type="text"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <TextField

                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        value={facility && facility.address.address}

                        label="Address"
                        type="text"
                        variant="outlined"
                    />
                    <Divider sx={{ mt: 2, mb: 2 }} />

                    {facility && facility.facilityType === 'Shelter' ? (
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ mr: 13 }}
                                    fullWidth
                                    margin="dense"
                                    id="name"
                                    value={facility && facility.currentCapacity}

                                    label="Current capacity"
                                    type="text"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    value={facility && facility.maxCapacity}

                                    label="Max capacity"
                                    type="text"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>) : (<TextField

                            fullWidth
                            autoFocus
                            margin="dense"
                            id="name"
                            value={facility && facility.responsibleUser.email}

                            label="Responsible person"
                            type="text"
                            variant="outlined"
                        />)}
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    {facility && facility.facilityType === 'Shelter' ?
                        <div>
                            <ToggleButtonGroup value={refugeesMode} color="primary">
                                <ToggleButton value={true} onClick={() => setRefugeesMode(true)} >   Shelter refugees </ToggleButton>
                                <ToggleButton value={false} onClick={() => setRefugeesMode(false)}>  Donation Absorptions </ToggleButton>
                            </ToggleButtonGroup>
                            {refugeesMode ? <FacilityRefugeesTable shelterId={facility == null ? 0 : facility.id} /> : <DonationAbsorptionsTable shelterId={facility == null ? 0 : facility.id} />} </div> : null}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => onClose()}> OK </Button>
                </DialogActions>
            </Box >
        </Dialog >
    );

}

export default FacilityDialog;