import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    Divider,
    Grid,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { lightGreen } from '@mui/material/colors';
import RefugeeService from "../../services/RefugeeService";
import MuiPhoneNumber from 'material-ui-phone-number-2';
import validator from 'validator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FacilityInfo from './FacilityInfo';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const options = { year: 'numeric', month: 'long', day: 'numeric' };

const USER_DATA = 0
const PERSONAL_DATA = 1
const ADDITIONAL_DATA = 2

const MIN_AGE = 1;
const MAX_AGE = 99;

const RefugeeCheckDialog = (props) => {

    const { open, id, onAction } = props;

    const [refugee, setRefugee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openFacility, setOpenFacility] = useState(false);

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [page, setPage] = useState(USER_DATA);

    const [email, setEmail] = useState('');
    const [identifier, setIdentifier] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [identifierError, setIdentifierError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);

    const getUser = async () => {

        if (id == 'undefined' || id == null)
            return;

        try {

            RefugeeService.getRefugeeByUserId(id)
                .then(
                    response => {
                        setRefugee(response.data);
                        setEmail(response.data.user.email);
                        setIdentifier(response.data.user.identifier);
                    }
                )

        } catch (error) {
            setRefugee(null);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleChange = (e) => {
        setRefugee({ ...refugee, [e.target.name]: e.target.value });
    }

    const setPhoneNumber = (number) => {
        setRefugee({ ...refugee, phoneNumber: number });
    }

    const setAge = (age) => {
        setRefugee({ ...refugee, age: age });
    }

    const validateData = () => {

        setEmailError(false);
        setIdentifierError(false);
        setPhoneNumberError(false);

        if (validator.isEmail(email) === false) {
            setEmailError(true);
            setPage(USER_DATA);
            return false;
        }

        if (validator.isNumeric(identifier) === false || identifier.length < 8) {
            setIdentifierError(true);
            setPage(USER_DATA);
            return false;
        }

        if (refugee.phoneNumber.length < 10) {
            setPhoneNumberError(true);
            setPage(PERSONAL_DATA);
            return false;
        }

        return true;
    }

    const handleSave = () => {

        if (!validateData())
            return;

        setLoading(true);
        setErrorMessage('');
        setMessage('');

        refugee.user.email = email;
        refugee.user.identifier = identifier;

        RefugeeService.updateRefugee(refugee)
            .then(response => {
                handleResponse(response);
            })
            .catch(error => {
                handleResponse(error.response);
            });
    };

    const handleChangeState = () => {

        setLoading(true);
        setErrorMessage('');
        setMessage('');

        RefugeeService.changeStatus(id)
            .then(response => {
                handleResponse(response);
            })
            .catch(error => {
                handleResponse(error.response);
            });

    };

    const handleResponse = (response) => {

        setLoading(false);

        if (response.status === 200) {
            setMessage("Successfully updated refugee");
            setRefugee(response.data);
            setEmail(response.data.user.email);
            setIdentifier(response.data.user.identifier);
        } else {
            let message = response.data;

            if (message.search("email") > -1)
                setPage(USER_DATA);

            else if (message.search("identifier") > -1)
                setPage(USER_DATA);

            else if (message.search("phoneNumber") > -1)
                setPage(PERSONAL_DATA);

            setErrorMessage(message);
        }
    };

    return (
        <Dialog fullWidth
            maxWidth="sm" open={open} onClose={onAction}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {page === USER_DATA ?
                    < AccountCircleIcon sx={{ fontSize: 50, mt: 2 }} color='primary' /> : page === PERSONAL_DATA ?
                        <FaceIcon sx={{ fontSize: 50, mt: 2 }} color='primary' /> :
                        <TextSnippetIcon sx={{ fontSize: 50, mt: 2 }} color='primary' />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DialogTitle> Refugee </DialogTitle>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p style={{ fontSize: 20, color: 'green' }}> {message} </p>
                <p style={{ fontSize: 20, color: 'red' }}> {errorMessage} </p>
            </div>
            <Backdrop open={loading}>
                <CircularProgress
                    size={60}
                    sx={{
                        color: lightGreen[800],
                        mt: 1,
                    }}
                />
            </Backdrop>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup value={page} color="primary">
                    <ToggleButton value={USER_DATA} onClick={() => setPage(USER_DATA)}> User data </ToggleButton>
                    <ToggleButton value={PERSONAL_DATA} onClick={() => setPage(PERSONAL_DATA)}> Personal
                        data </ToggleButton>
                    <ToggleButton value={ADDITIONAL_DATA} onClick={() => setPage(ADDITIONAL_DATA)}> Additional
                        data </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <DialogContent>
                {page === USER_DATA ? <> <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    autoFocus
                    margin="dense"
                    name="email"
                    id="email"
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    value={email}
                    label="Email"
                    type="text"
                    variant="outlined"
                    error={emailError}
                    helperText={emailError ? 'Wrong email format' : ''} />

                    <TextField
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        readOnly
                        value={refugee && refugee.name}
                        label="Name"
                        type="text"
                        variant="outlined"
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        name="identifier"
                        onChange={(e) => {
                            setIdentifier(e.target.value)
                        }}
                        value={identifier}
                        label="Identifier"
                        type="text"
                        variant="outlined"
                        error={identifierError}
                        helperText={identifierError ? 'Identifier number must be atleast 8 digits' : ''} />
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        readOnly
                        value={refugee && refugee.user.role.roleType}
                        label="Role"
                        type="text"
                        variant="outlined"
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="name"
                        readOnly
                        value={refugee && new Date(refugee.user.accountStatus.createdOn).toLocaleString("en-US", options)}
                        label="Creation date"
                        type="text"
                        variant="outlined"
                    /> </> : page === PERSONAL_DATA ? <> <MuiPhoneNumber
                        sx={{ mb: 2, mt: 2 }}
                        variant='outlined'
                        label='Phone number'
                        name="phoneNumber"
                        value={refugee && refugee.phoneNumber}
                        fullWidth
                        defaultCountry={'bg'}
                        onChange={(event) => {
                            setPhoneNumber(event);
                        }} error={phoneNumberError}
                        helperText={phoneNumberError ? 'Phone number must be 10 digits' : ''} />

                        <TextField
                            sx={{ mb: 2 }}
                            fullWidth
                            value={refugee && refugee.age}
                            id="outlined-number"
                            label="Age"
                            name="age"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{ inputProps: { min: MIN_AGE, max: MAX_AGE } }}
                            onChange={(event) => {
                                var value = parseInt(event.target.value, 10);

                                if (isNaN(value)) value = MIN_AGE;
                                if (value > MAX_AGE) value = MAX_AGE;
                                if (value < MIN_AGE) value = MIN_AGE;

                                setAge(value);
                            }}
                        />
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            sx={{ mt: 2, mb: 2 }}
                            fullWidth
                            autoFocus
                            margin="dense"
                            id="name"
                            inputProps={
                                { readOnly: true, }
                            }
                            value={refugee && refugee.addressDetails}
                            label="Address"
                            type="text"
                            variant="outlined"
                        />
                        <Grid container>
                            <Grid item xs={11}>
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    inputProps={
                                        { readOnly: true, }
                                    }
                                    value={refugee && refugee.shelterDetails}
                                    label="Shelter"
                                    type="text"
                                    variant="outlined"
                                /> </Grid>
                            <Grid item xs={1}>
                                <Button onClick={() => {
                                    setOpenFacility(true);
                                }}> <OpenInNewIcon sx={{ fontSize: 40, mt: 2 }} color='primary' /> </Button>
                            </Grid> </Grid> </> : <>                                 <TextField
                                InputLabelProps={{ shrink: true }}
                                sx={{ mt: 2, mb: 2 }}
                                fullWidth
                                autoFocus
                                margin="dense"
                                id="diseases"
                                name="diseases"
                                onChange={(event) => {
                                    handleChange(event)
                                }}
                                value={refugee && refugee.diseases}
                                label="Diseases"
                                type="text"
                                variant="outlined"
                            />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2, mb: 2 }}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="allergens"
                        name="allergens"
                        onChange={(event) => {
                            handleChange(event)
                        }}
                        value={refugee && refugee.allergens}
                        label="Allergens"
                        type="text"
                        variant="outlined"
                    />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2, mb: 2 }}
                        fullWidth
                        autoFocus
                        margin="dense"
                        id="specialDiet"
                        name="specialDiet"
                        onChange={(event) => {
                            handleChange(event)
                        }}
                        value={refugee && refugee.specialDiet}
                        label="Special Diet"
                        type="text" />
                </>}

            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" disabled={loading}
                    onClick={handleChangeState}> {refugee && refugee.user.accountStatus.accountStatusType == 'Blocked' ? 'Unblock refugee' : 'Block refugee'} </Button>
                <Button variant="contained" color="primary" disabled={loading} onClick={handleSave}> Save data </Button>
            </DialogActions>
            <Dialog open={openFacility} onClose={() => setOpenFacility(false)}>
                <FacilityInfo facility={refugee && refugee.facility} />
                <DialogActions>
                    <Button variant="contained" onClick={() => setOpenFacility(false)}>Ok</Button>
                </DialogActions>
            </Dialog>
        </Dialog>

    );

}

export default RefugeeCheckDialog;