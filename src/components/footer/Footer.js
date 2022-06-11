import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import Paper from '@mui/material/Paper';
import { lightGreen } from '@mui/material/colors';
import Grid from '@mui/material/Grid';

export default function Footer() {
    const [value, setValue] = React.useState(0);
    const ref = React.useRef(null);

    return (
        <Box sx={{ pb: 7, height: '180px' }} ref={ref}>
            <CssBaseline />
            <Paper sx={{ position: 'fixed', height: '180px', bottom: 0, left: 0, right: 0 }} elevation={22}>
                <BottomNavigation
                    sx={{ bgcolor: lightGreen[800], height: '180px' }}
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={4} justifyContent='flex' textAlign='center'>
                            <p style={{ fontSize: '30px', color: 'white' }}>Contact us</p>
                            <p style={{ fontSize: '15px', color: 'white' }}>Email:  safe_shelter@sshelter.com </p>
                            <p style={{ fontSize: '15px', color: 'white' }}>Phone:  +35908982231</p>
                        </Grid>
                        <Grid item xs={4} justifyContent='flex' textAlign='center'>
                            <p style={{ fontSize: '30px', color: 'white' }}>Address</p>
                            <p style={{ fontSize: '15px', color: 'white' }}>Varna 9000</p>
                            <p style={{ fontSize: '15px', color: 'white' }}>Gotse Delchev 9</p>
                            <p style={{ fontSize: '15px', color: 'white' }}>Office open 9am - 5pm Monday - Friday</p>
                        </Grid>
                        <Grid item xs={4} justifyContent='flex' textAlign='center'>
                            <br></br>
                            <p style={{ fontSize: '15px', color: 'white' }}>&copy;{new Date().getFullYear()} Safe Shelter</p>
                            <p style={{ fontSize: '15px', color: 'white' }}>All rights reserved</p>
                        </Grid>
                    </Grid>
                </BottomNavigation>
            </Paper>
        </Box >
    );
}

