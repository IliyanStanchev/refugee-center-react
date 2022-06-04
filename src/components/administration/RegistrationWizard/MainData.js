
import React, { useState, useEffect } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { Link, useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import validator from 'validator';

const MainData = (props) => {
    const navigate = useNavigate();

    const parentUser = props.user;

    const [user, setUser] = useState(parentUser);

    const checkForErrors = () => {

        user.hasError = false;

        if (user.firstName.length < 2 || user.firstName.match('^[A-Za-z ]*$') === false) {
            user.hasError = true;
        }

        if (user.lastName.length < 2 || user.lastName.match('^[A-Za-z ]*$') === false) {
            user.hasError = true;
        }

        if (validator.isEmail(user.email) === false) {
            user.hasError = true;
        }

        if (validator.isNumeric(user.identifier) === false || user.identifier.length < 8) {
            user.hasError = true;
        }

        parentUser.firstName = user.firstName;
        parentUser.lastName = user.lastName;
        parentUser.email = user.email;
        parentUser.identifier = user.identifier;
        parentUser.hasError = user.hasError;
    }

    const handleChange = (event) => {

        const updatedUser = {}
        updatedUser[event.target.name] = event.target.value;
        setUser({ ...user, ...updatedUser });
    }

    useEffect(() => {
        checkForErrors();
    });

    const handleSubmit = (event) => {
    }

    return (
        <ValidatorForm
            noValidate={true}
            onSubmit={handleSubmit}
        >
            <CssBaseline />
            <Box container
                sx={{
                    alignItems: 'center',
                    textAlign: 'center',
                    marginTop: 3,
                }}
            >
                <Box sx={{ mt: 2, mb: 2 }}>
                    <TextValidator
                        sx={{ width: 300, mt: 1, mb: 2 }}
                        label="Email"
                        onChange={handleChange}
                        name="email"
                        value={user.email}
                        required
                        validators={['required', 'isEmail']}
                        errorMessages={['Enter email', 'Wrong email format']}
                    />
                    <TextValidator
                        sx={{ width: 300, mt: 1, mb: 2 }}
                        label="First name"
                        onChange={handleChange}
                        name="firstName"
                        value={user.firstName}
                        required
                        validators={['required', 'minStringLength:2', 'matchRegexp:^[A-Za-z ]*$']}
                        errorMessages={['Enter first name', 'First name must be at least 2 characters long', 'Name must be letters only']}
                    />
                    <TextValidator
                        sx={{ width: 300, mt: 1, mb: 2 }}
                        label="Second name"
                        onChange={handleChange}
                        name="lastName"
                        value={user.lastName}
                        required
                        validators={['required', 'minStringLength:2', 'matchRegexp:^[A-Za-z ]*$']}
                        errorMessages={['Enter second name', 'Second name must be at least 2 characters long', 'Name must be letters only']}
                    />
                    <TextValidator
                        sx={{ width: 300, mt: 1, mb: 2 }}
                        label="Identifier"
                        onChange={handleChange}
                        name="identifier"
                        value={user.identifier}
                        required
                        validators={['required', 'minStringLength:8']}
                        errorMessages={['Enter identifier', 'Identifier must be at least 8 characters long']}
                    />
                </Box>
            </Box>
        </ValidatorForm >
    );
}

export default MainData;