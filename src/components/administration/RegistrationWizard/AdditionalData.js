import * as React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import MyTheme from '../../../controls/MyTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';

const AdditionalData = (props) => {

    const parentUser = props.user;

    const [user, setUser] = React.useState(parentUser)

    const handleChange = (event) => {

        const updatedUser = {}
        updatedUser[event.target.name] = event.target.value;
        setUser({ ...user, ...updatedUser });
    }

    useEffect(() => {

        parentUser.diseases = user.diseases;
        parentUser.alergens = user.alergens;
        parentUser.specialDiet = user.specialDiet;

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
                <TextField
                    sx={{ mb: 2 }}
                    value={user.diseases}
                    id="outlined"
                    label="Diseases"
                    name="diseases"
                    multiline
                    onChange={(event) => {
                        handleChange(event);
                    }}
                /> <TextField
                    sx={{ mb: 2 }}
                    value={user.alergens}
                    id="outlined"
                    label="Alergens"
                    name="alergens"
                    multiline
                    onChange={(event) => {
                        handleChange(event);
                    }}
                /> <TextField
                    sx={{ mb: 2 }}
                    value={user.specialDiet}
                    id="outlined"
                    label="Special diet"
                    name="specialDiet"
                    multiline
                    onChange={(event) => {
                        handleChange(event);
                    }}
                />
            </Box>
        </ThemeProvider >
    );
}

export default AdditionalData;