import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { Box, Grid, Link } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FacilityInfo from "./FacilityInfo";
import AddressResolver from "../../utils/AddressResolver";

const PendingRegistrationInfo = (props) => {

    const refugee = props.refugee;

    const [open, setOpen] = useState(false);

    function getCountryData(countryCode) {

        return AddressResolver.getCountryData(countryCode);
    }

    function getFacilityData(facility) {

        return AddressResolver.getFacilityData(facility);
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
            textAlign: 'center',
        }}>
            <DialogTitle > Refugee Data</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={refugee && refugee.user.firstName + ' ' + refugee.user.lastName}
                    label="Name"
                    type="text"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    id="email"
                    value={refugee && refugee.user.email}
                    label="Email"
                    type="text"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    id="email"
                    value={refugee && refugee.user.identifier}
                    label="Identifier"
                    type="text"
                    variant="outlined"
                />
                <Divider sx={{ mt: 2, mb: 2 }} />
                <TextField
                    sx={{ mr: 13 }}
                    autoFocus
                    margin="dense"
                    id="name"
                    value={refugee && getCountryData(refugee.address.countryIsoCode)}
                    label="Country"
                    type="text"
                    variant="outlined"
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    value={refugee && refugee.address.cityName}
                    label="City"
                    type="text"
                    variant="outlined"
                />
                <TextField

                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={refugee && refugee.address.address}
                    label="Address"
                    type="text"
                    variant="outlined"
                />
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Grid container >
                    <Grid item sm={11}>
                        <TextField
                            fullWidth
                            autoFocus
                            margin="dense"
                            id="name"
                            value={refugee && getFacilityData(refugee.facility)}
                            label="Shelter"
                            type="text"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item sm={1}>
                        <Link onClick={() => { setOpen(true) }} ><OpenInNewIcon /></Link>
                    </Grid>
                </Grid>
                <TextField

                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={refugee && refugee.diseases}

                    label="Diseases"
                    type="text"
                    variant="outlined"
                />
                <TextField

                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={refugee && refugee.allergens}

                    label="Allergens"
                    type="text"
                    variant="outlined"
                />
                <TextField

                    fullWidth
                    autoFocus
                    margin="dense"
                    id="name"
                    value={refugee && refugee.specialDiet}

                    label="Special diet"
                    type="text"
                    variant="outlined"
                />
            </DialogContent>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <FacilityInfo facility={refugee.facility} />
                <DialogActions>
                    <Button variant="contained" onClick={() => setOpen(false)}>Ok</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );

}

export default PendingRegistrationInfo