import React, { useState, useEffect } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { Box, Link } from "@mui/material";
import Grid from '@mui/material/Grid';
import UserService from "../../services/UserService";
import { Dialog } from "@mui/material";
import { Country, State, City } from 'country-state-city';
import { Button } from "@mui/material";
import { Autocomplete } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import UserInfo from './UserInfo';
import FacilityService from "../../services/FacilityService";
import { DialogActions } from "@mui/material";
import MuiPhoneNumber from 'material-ui-phone-number';

const MIN_VALUE = 0;
const MAX_VALUE = 100;

const AddFacilityDialog = (props) => {

    const facilityTypes = [
        'Warehouse'
        , 'Shelter'
    ];

    const { open, onClose } = props;

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [responsibleUsers, setResponsibleUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserDialog, setOpenUserDialog] = useState(false);

    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [currentCapacity, setCurrentCapacity] = useState(MIN_VALUE);
    const [maxCapacity, setMaxCapacity] = useState(MAX_VALUE);

    const [facilityType, setFacilityType] = useState('Shelter');
    const [responsibleUser, setResponsibleUser] = useState(null);

    const [countryError, setCountryError] = useState(null);
    const [stateError, setStateError] = useState(null);
    const [cityError, setCityError] = useState(null);
    const [addressError, setAddressError] = useState(null);
    const [responsibleUserError, setResponsibleUserError] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getCountries = async () => {
            try {
                const result = Country.getAllCountries();
                let allCountries = [];
                allCountries = result?.map(({ isoCode, name }) => ({
                    isoCode,
                    name,

                }));

                setCountries(allCountries);
            } catch (error) {
                setCountries([]);
            }
        };

        getCountries();
    }, []);

    useEffect(() => {
        const getStates = async () => {
            try {
                const result = State.getStatesOfCountry(country.isoCode);
                let allStates = [];
                allStates = result?.map(({ isoCode, name }) => ({
                    isoCode,
                    name
                }));
                setCities([]);
                setStates(allStates);
            } catch (error) {
                setStates([]);
                setCities([]);
                setCity(null);
            }
        };

        getStates();
    }, [country]);

    useEffect(() => {
        const getCities = async () => {
            try {
                const result = await City.getCitiesOfState(
                    country.isoCode,
                    state.isoCode
                );
                let allCities = [];
                allCities = result?.map(({ name }) => ({
                    name
                }));
                setCities(allCities);
            } catch (error) {
                setCities([]);
            }
        };

        getCities();
    }, [state]);

    useEffect(() => {
        const getResponsibleUsers = async () => {
            try {

                UserService.getResponsibleUsers()
                    .then(
                        response => {
                            setResponsibleUsers(response.data);
                        }
                    )

            } catch (error) {
                setResponsibleUsers([]);
            }
        };

        getResponsibleUsers();
    }, []);

    const resetStateAndCity = () => {
        setState(null);
        setCity(null);
    };

    const handleCityChange = (city) => {

        if (typeof city === 'string') {
            setCity({ name: city });
            return;
        }

        setCity(city);
    }

    const handleSaveFacility = () => {

        if (country == null) {
            setCountryError(true);
            return;
        }

        if (state == null) {
            setStateError(true);
            return;
        }

        if (city == null) {
            setCityError(true);
            return;
        }

        if (address.length == 0) {
            setAddressError(true);
            return;
        }

        if (responsibleUser == null) {
            setResponsibleUserError(true);
            return;
        }

        let facility = {
            id: 0
            , address: {
                id: 0,
                countryIsoCode: country.isoCode,
                stateIsoCode: state.isoCode,
                cityName: city.name,
                address: address,
            }
            , currentCapacity: currentCapacity
            , maxCapacity: maxCapacity
            , responsibleUser: responsibleUser
            , facilityType: facilityType
            , phoneNumber: phoneNumber
        };

        setErrorMessage('');

        FacilityService.saveFacility(facility)
            .then(onClose())
            .catch((error) => { setErrorMessage(error.response.data) });
    }

    return (
        <Dialog fullWidth
            maxWidth="sm" open={open} onClose={onClose}>
            <Box sx={{
                flexDirection: 'column',
                textAlign: 'center',
            }}>
                <DialogTitle> Add Facility </DialogTitle>
                <p style={{ color: 'red' }} > {errorMessage} </p>
                <DialogContent>
                    <Autocomplete
                        sx={{ mt: 2, mb: 2 }}
                        id="facilityTypes"
                        name="country"
                        value={facilityType}
                        options={facilityTypes}
                        isOptionEqualToValue={(option, value) => option === value}
                        onChange={(event, newValue) => {
                            setFacilityType(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                {...params}
                                label="Facility type"
                                inputProps={{
                                    ...params.inputProps,

                                }}
                            />
                        )}
                    />
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Autocomplete
                        sx={{ mt: 2, mb: 2 }}
                        id="countries"
                        name="country"
                        value={country}
                        options={countries}
                        isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode}
                        onChange={(event, newValue) => {
                            setCountry(newValue);
                            resetStateAndCity();
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option && option.name}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                <img
                                    loading="lazy"
                                    width="20"
                                    src={`https://flagcdn.com/w20/${option.isoCode.toLowerCase()}.png`}
                                    srcSet={`https://flagcdn.com/w40/${option.isoCode.toLowerCase()}.png 2x`}
                                    alt=""
                                />
                                {option.name} ({option.isoCode})
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                {...params}
                                error={countryError}
                                helperText={countryError ? 'Please select a country' : ''}
                                label="Country"
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                            />
                        )}
                    />
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Autocomplete
                                sx={{ mb: 2 }}
                                id="states"
                                name="state"
                                value={state}
                                options={states}
                                isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode && option.name === value.name}
                                onChange={(event, newValue) => {
                                    setState(newValue);
                                }}
                                autoHighlight
                                getOptionLabel={(option) => option && option.name}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        {...params}
                                        error={stateError}
                                        helperText={stateError ? 'Please select a state' : ''}
                                        label="State"
                                        inputProps={{
                                            ...params.inputProps,
                                        }}
                                    />
                                )}
                            /></Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                sx={{ mb: 2 }}
                                id="cities"
                                value={city}
                                name="city"
                                options={cities}
                                freeSolo
                                isOptionEqualToValue={(option, value) => option.name === value.name}
                                onChange={(event, newValue) => {
                                    handleCityChange(newValue);
                                }}
                                autoHighlight
                                getOptionLabel={(option) => option && option.name}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        error={cityError}
                                        helperText={cityError ? 'Please select a city' : ''}
                                        label="City"
                                        inputProps={{
                                            ...params.inputProps,
                                        }}
                                    />
                                )}
                            /></Grid></Grid>
                    <TextField
                        fullWidth
                        value={address}
                        id="outlined"
                        label="Address"
                        name="address"
                        error={addressError}
                        helperText={addressError ? 'Please fill address' : ''}
                        multiline
                        onChange={(event) => {
                            setAddress(event.target.value);
                        }}
                    />
                    <MuiPhoneNumber
                        sx={{ mb: 2, mt: 2 }}
                        variant='outlined'
                        label='Phone number'
                        name="phoneNumber"
                        value={phoneNumber}
                        fullWidth
                        defaultCountry={'bg'}
                        onChange={(event) => {
                            setPhoneNumber(event);
                        }}
                    />
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                sx={{ mr: 13 }}
                                fullWidth
                                margin="dense"
                                id="name"
                                value={currentCapacity}
                                label="Current capacity"
                                type="text"
                                variant="outlined"
                                InputProps={{ inputProps: { min: MIN_VALUE, max: maxCapacity } }}
                                onChange={(event) => {
                                    var value = parseInt(event.target.value, 10);

                                    if (isNaN(value)) value = MIN_VALUE;
                                    if (value > maxCapacity) value = maxCapacity;
                                    if (value < MIN_VALUE) value = MIN_VALUE;

                                    setCurrentCapacity(value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                autoFocus
                                margin="dense"
                                id="name"
                                type="number"
                                value={maxCapacity}
                                label="Max capacity"
                                variant="outlined"
                                onChange={(event) => {
                                    var value = parseInt(event.target.value, 10);

                                    if (isNaN(value)) value = MIN_VALUE;
                                    if (value < MIN_VALUE) value = MIN_VALUE;
                                    if (value < currentCapacity) value = currentCapacity;

                                    setMaxCapacity(value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Autocomplete
                        sx={{ mb: 2 }}
                        id="users"
                        value={responsibleUser}
                        options={responsibleUsers}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, newValue) => {
                            setResponsibleUser(newValue);
                        }}
                        autoHighlight
                        getOptionLabel={(option) => option.email}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                {option.email}
                                <Button onClick={() => {
                                    setOpenUserDialog(true);
                                    setSelectedUser(option);
                                }}> <OpenInNewIcon /> </Button>
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={responsibleUserError}
                                helperText={responsibleUserError ? 'Please select a responsible user' : ''}
                                label="Choose a responsible user"
                                inputProps={{
                                    ...params.inputProps,
                                }}
                            />
                        )}></Autocomplete>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => handleSaveFacility()}>Save</Button>
                    <Button variant="contained" onClick={onClose}> Cancel </Button>
                </DialogActions>
            </Box >
            <UserInfo user={selectedUser} open={openUserDialog} onClose={() => { setOpenUserDialog(false); }} />
        </Dialog>
    );

}

export default AddFacilityDialog;