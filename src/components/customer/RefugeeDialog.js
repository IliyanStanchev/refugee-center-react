import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Box, Link } from "@mui/material";
import RefugeeService from "../../services/RefugeeService";
import { ReactSession } from 'react-client-session';
import { ThemeProvider } from "styled-components";
import MyTheme from './../../controls/MyTheme';
import Paper from '@mui/material/Paper';
import { Divider } from "@mui/material";
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MuiPhoneNumber from 'material-ui-phone-number';
import { red } from '@mui/material/colors';

const MIN_AGE = 1;
const MAX_AGE = 99;

const RefugeeDialog = () => {

    const id = ReactSession.get('id');

    const [refugee, setRefugee] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [age, setAge] = useState(MIN_AGE);
    const [diseases, setDiseases] = useState('');
    const [allergens, setAllergens] = useState('');
    const [specialDiet, setSpecialDiet] = useState('');

    const getRefugee = async () => {
        try {

            RefugeeService.getRefugeeByUserId(id)
                .then(
                    response => {
                        setRefugee(response.data);
                        setAge(response.data.age);
                        setDiseases(response.data.diseases);
                        setAllergens(response.data.allergens);
                        setSpecialDiet(response.data.specialDiet);
                        setPhoneNumber(response.data.phoneNumber);
                    }
                )

        } catch (error) {
            setRefugee(null);
        }
    };

    useEffect(() => {
        getRefugee();
    }, []);

    const handleSubmit = () => {

        setPhoneNumberError(false);

        if (!editMode) {
            setEditMode(true);
            return;
        }

        if (phoneNumber.length < 10) {
            setPhoneNumberError(true);
            return;
        }


        let updatedRefugee = refugee;
        updatedRefugee.age = age;
        updatedRefugee.diseases = diseases;
        updatedRefugee.allergens = allergens;
        updatedRefugee.specialDiet = specialDiet;
        updatedRefugee.phoneNumber = phoneNumber;

        RefugeeService.updateRefugee(updatedRefugee)
            .then(response => {
                setEditMode(false);
                setRefugee(response.data);
            }).catch(error => { setErrorMessage(error.response.data) });
    }

    return (

        <ThemeProvider theme={MyTheme}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '70%' }}>
                    <Paper variant='outlined' sx={{ width: '100%', mb: 2, borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                            <Box sx={{ width: '60%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <AccountCircleIcon sx={{ fontSize: 50 }} color='primary' />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <p style={{ color: red }}> {errorMessage} </p>
                                </div>
                                <MuiPhoneNumber
                                    sx={{ mb: 2, mt: 2 }}
                                    variant='outlined'
                                    label='Phone number'
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    fullWidth
                                    defaultCountry={'bg'}
                                    inputProps={
                                        { readOnly: !editMode, }
                                    }
                                    onChange={(event) => {
                                        setPhoneNumber(event);
                                    }} error={phoneNumberError}
                                    helperText={phoneNumberError ? 'Phone number must be 10 digits' : ''} />

                                <TextField
                                    sx={{ mb: 2 }}
                                    fullWidth
                                    value={age}
                                    id="outlined-number"
                                    label="Age"
                                    name="age"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{ readOnly: !editMode, inputProps: { min: MIN_AGE, max: MAX_AGE } }}
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
                                />
                                <Divider sx={{ mt: 2, mb: 2 }} />
                                <TextField
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2, mb: 2 }}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    inputProps={
                                        { readOnly: !editMode, }
                                    }
                                    onChange={(event) => { setDiseases(event.target.value) }}
                                    value={diseases}
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
                                    id="name"
                                    inputProps={
                                        { readOnly: !editMode, }
                                    }
                                    onChange={(event) => { setAllergens(event.target.value) }}
                                    value={allergens}
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
                                    id="name"
                                    inputProps={
                                        { readOnly: !editMode, }
                                    }
                                    onChange={(event) => { setSpecialDiet(event.target.value) }}
                                    value={specialDiet}
                                    label="Special Diet"
                                    type="text"
                                    variant="outlined"
                                />
                                <Button sx={{ mt: 2, mb: 2 }} fullWidth variant="contained" color="primary" onClick={handleSubmit}> {editMode ? 'Save changes' : 'Edit data'} </Button>
                            </Box>
                        </div>
                    </Paper>
                </Box>
            </div>
        </ThemeProvider >

    );

}

export default RefugeeDialog;