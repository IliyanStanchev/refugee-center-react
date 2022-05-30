import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { Box, Link } from "@mui/material";
import Grid from '@mui/material/Grid';

const FacilityInfo = (props) => {

    const facility = props.facility;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
            textAlign: 'center',
        }}>
            <DialogTitle> Shelter Data</DialogTitle>
            <DialogContent>
                <TextField

                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={facility && facility.facilityType}

                    label="Facility type"
                    type="text"
                    variant="outlined"
                />
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            autoFocus
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
                <TextField

                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={facility && facility.responsibleUser.firstName + ' ' + facility.responsibleUser.lastName}

                    label="Responsible person"
                    type="text"
                    variant="outlined"
                />
                <TextField

                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={facility && facility.responsibleUser.email}

                    label="Contact"
                    type="text"
                    variant="outlined"
                />
            </DialogContent>
        </Box>
    );

}

export default FacilityInfo;