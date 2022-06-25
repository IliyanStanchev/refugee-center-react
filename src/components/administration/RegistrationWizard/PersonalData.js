
import React, { useState, useEffect } from "react";
import { Country, State, City } from 'country-state-city';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import MyTheme from '../../../controls/MyTheme';
import CssBaseline from '@mui/material/CssBaseline';
import MuiPhoneNumber from 'material-ui-phone-number';
import FacilityService from "../../../services/FacilityService";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FacilityInfo from "../FacilityInfo";

const MIN_AGE = 1
const MAX_AGE = 99

const PersonalData = (props) => {

    const parentUser = props.user;

    const [user, setUser] = useState(parentUser);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [facilities, setFacilities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(user.country);
    const [selectedState, setSelectedState] = useState(user.state);
    const [selectedCity, setSelectedCity] = useState(user.city);

    const [countryChanged, setCountryChanged] = useState(false);
    const [stateChanged, setStateChanged] = useState(false);
    const [cityChanged, setCityChanged] = useState(false);
    const [facilityChanged, setFacilityChanged] = useState(false);
    const [phoneNumberChanged, setPhoneNumberChanged] = useState(false);
    const [addressChanged, setAddressChanged] = useState(false);

    const [dialogFacility, setDialogFacility] = useState(null);
    const [open, toggleOpen] = useState(false);

    const [hasError, setHasError] = useState(false);

    const handleChange = (event) => {

        const updatedUser = {}
        updatedUser[event.target.name] = event.target.value;
        setUser({ ...user, ...updatedUser });
    }

    const setPhoneNumber = (value) => {

        const updatedUser = {}
        updatedUser['phoneNumber'] = value;
        setUser({ ...user, ...updatedUser });
    }

    const setState = (value) => {

        const updatedUser = {}
        updatedUser['state'] = value;
        setUser({ ...user, ...updatedUser });
    }

    const setCity = (value) => {

        const updatedUser = {}
        updatedUser['city'] = value;
        setUser({ ...user, ...updatedUser });
    }

    const setFacility = (value) => {

        const updatedUser = {}
        updatedUser['shelter'] = value;
        setUser({ ...user, ...updatedUser });
    }

    const setCountry = (value) => {

        setUser({
            ...user, country: {
                isoCode: value.isoCode,
                name: value.name
            }
        });
    }

    const setAge = (value) => {

        const updatedUser = {}
        updatedUser["age"] = value;
        setUser({ ...user, ...updatedUser });
    }

    const resetStateAndCity = () => {

        setState(null);
        setCity(null);
    }

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
                const result = State.getStatesOfCountry(selectedCountry.isoCode);
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
    }, [selectedCountry]);

    useEffect(() => {
        const getCities = async () => {
            try {
                const result = await City.getCitiesOfState(
                    selectedCountry.isoCode,
                    selectedState.isoCode
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
    }, [selectedState]);

    useEffect(() => {
        const getFacilities = async () => {
            try {

                FacilityService.getAllShelters()
                    .then(
                        response => {
                            setFacilities(response.data);
                        }
                    )

            } catch (error) {
                setFacilities([]);
            }
        };

        getFacilities();
    }, []);

    useEffect(() => {

        parentUser.hasError = hasError;

        parentUser.country = selectedCountry;
        parentUser.state = selectedState;
        parentUser.city = selectedCity;
        parentUser.address = user.address;
        parentUser.phoneNumber = user.phoneNumber;
        parentUser.age = user.age;
        parentUser.shelter = user.shelter;

        setHasError(false);

        if (parentUser.country === null) {
            setHasError(true);
            return;
        }

        if (parentUser.state === null) {
            setHasError(true);
            return;
        }

        if (parentUser.city === null) {
            setHasError(true);
            return;
        }

        if (parentUser.address === '') {
            setHasError(true);
            return;
        }

        if (parentUser.phoneNumber.length < 10) {
            setHasError(true);
            return;
        }

        if (parentUser.shelter === null) {
            setHasError(true);
            return;
        }
    });

    return (
        <ThemeProvider theme={MyTheme}>
            <CssBaseline />
            <Box container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                }}
            >
                <Autocomplete
                    sx={{ mb: 2 }}
                    id="countries"
                    name="country"
                    value={selectedCountry}
                    options={countries}
                    isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode}
                    onChange={(event, newValue) => {
                        setSelectedCountry(newValue);
                        resetStateAndCity();
                        setCountryChanged(true);

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
                            {...params}
                            error={countryChanged && selectedCountry === null}
                            helperText={countryChanged && selectedCountry === null ? 'Please select a country' : ''}
                            label="Choose a country"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    )}
                />
                <Autocomplete
                    sx={{ mb: 2 }}
                    id="states"
                    name="state"
                    value={selectedState}
                    options={states}
                    isOptionEqualToValue={(option, value) => option.isoCode === value.isoCode && option.name === value.name}
                    onChange={(event, newValue) => {
                        setSelectedState(newValue);
                        setStateChanged(true);
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
                            error={stateChanged && selectedState === null}
                            helperText={stateChanged && selectedState === null ? 'Please select a state' : ''}
                            label="Choose a state"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password',
                            }}
                        />
                    )}
                />
                <Autocomplete
                    sx={{ mb: 2 }}
                    id="cities"
                    value={selectedCity}
                    name="city"
                    options={cities}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    onChange={(event, newValue) => {
                        setSelectedCity(newValue);
                        setCityChanged(true);
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
                            error={cityChanged && selectedCity === null}
                            helperText={cityChanged && selectedCity === null ? 'Please select a city' : ''}
                            label="Choose a city"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    )}
                />
                <TextField
                    sx={{ mb: 2 }}
                    value={user.address}
                    id="outlined"
                    label="Address"
                    name="address"
                    error={addressChanged && user.address == ''}
                    helperText={addressChanged && user.address == '' ? 'Please fill address' : ''}
                    multiline
                    onChange={(event) => {
                        handleChange(event);
                        setAddressChanged(true);
                    }}
                />
                <MuiPhoneNumber
                    sx={{ mb: 2 }}
                    variant='outlined'
                    label='Phone number'
                    name="phoneNumber"
                    value={user.phoneNumber}
                    defaultCountry={'bg'}
                    error={phoneNumberChanged && user.phoneNumber.length < 10}
                    helperText={phoneNumberChanged && user.phoneNumber.length < 10 ? 'Phone number should be at least 10 symbols' : ''}
                    onChange={(event) => {
                        setPhoneNumber(event);
                        setPhoneNumberChanged(true);
                    }} />
                <TextField
                    sx={{ mb: 2 }}
                    value={user.age}
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
                <Autocomplete
                    sx={{ mb: 2 }}
                    id="facilities"
                    value={user.shelter}
                    options={facilities}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(event, newValue) => {
                        setFacility(newValue);
                        setFacilityChanged(true);
                    }}
                    autoHighlight
                    getOptionLabel={(option) => option.facilityType + ' ' + option.address.countryIsoCode + ' ' + option.address.cityName + ' ' + option.address.address}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.facilityType + ' ' + option.address.countryIsoCode + ' ' + option.address.cityName + ' ' + option.address.address}
                            <Button onClick={() => {
                                toggleOpen(true);
                                setDialogFacility(
                                    option
                                );


                            }}> <OpenInNewIcon /> </Button>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            error={facilityChanged && user.shelter === null}
                            helperText={facilityChanged && user.shelter === null ? 'Please select a shelter' : ''}
                            label="Choose a shelter"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    )}
                />
                <Dialog open={open} onClose={() => toggleOpen(false)}>
                    <FacilityInfo facility={dialogFacility} />
                    <DialogActions>
                        <Button variant="contained" onClick={() => toggleOpen(false)}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Box >
        </ThemeProvider >
    );
}

export default PersonalData;