import React, {useState} from "react";
import Box from '@mui/material/Box';
import {red} from "@mui/material/colors";
import Paper from '@mui/material/Paper';
import {ThemeProvider} from "styled-components";
import MyTheme from './../../controls/MyTheme';
import {Button, TextField} from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import RequestService from "../../services/RequestService";
import {ReactSession} from 'react-client-session';
import lightGreen from '@material-ui/core/colors/lightGreen';

const RequestStocks = () => {

    const id = ReactSession.get('id');

    const [stock, setStock] = useState('');
    const [reason, setReason] = useState('');

    const [errorStock, setErrorStock] = useState(false);
    const [errorReason, setErrorReason] = useState(false);

    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {

        setErrorMessage('');
        setMessage('');

        setErrorReason(false);
        setErrorStock(false);

        if (stock === '') {
            setErrorStock(true);
            return;
        }

        if (reason === '') {
            setErrorReason(true);
            return;
        }

        let stockRequest = {
            refugee: {
                id: id
            },
            description: stock,
            reason: reason
        }

        RequestService.requestStocks(stockRequest)
            .then(response => {
                setMessage("Request sent successfully");
                setStock('');
                setReason('');
            }).catch(error => {
            setErrorMessage(error.response.data);
        });
    }

    return (
        <ThemeProvider theme={MyTheme}>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
                <Box sx={{width: '30%'}}>
                    <Paper variant='outlined' sx={{width: '100%', mb: 2, borderRadius: '16px'}}>
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
                            <Box sx={{width: '70%'}}>
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <InventoryIcon sx={{fontSize: 50}} color='primary'/>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                    <p style={{color: red}}>{errorMessage}</p>
                                    <p style={{color: lightGreen[900]}}>{message}</p>
                                </div>
                                <TextField
                                    InputLabelProps={{shrink: true}}
                                    sx={{mt: 2, mb: 2}}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="stock"
                                    multiline
                                    value={stock}
                                    onChange={(event) => {
                                        setStock(event.target.value);
                                        setErrorStock(false);
                                    }}
                                    label="Describe the stock you need"
                                    type="text"
                                    variant="outlined"
                                    error={errorStock}
                                    helperText={errorStock ? 'Please describe the stock' : ''}
                                />
                                <TextField
                                    InputLabelProps={{shrink: true}}
                                    sx={{mt: 2, mb: 2}}
                                    fullWidth
                                    autoFocus
                                    margin="dense"
                                    id="stock"
                                    value={reason}
                                    onChange={(event) => {
                                        setReason(event.target.value);
                                        setErrorReason(false);
                                    }}
                                    multiline
                                    label="Describe why do u need it"
                                    type="text"
                                    variant="outlined"
                                    error={errorReason}
                                    helperText={errorReason ? 'Please enter a reason' : ''}
                                />
                                <p> Your request will be checked by your center responsible user. We will try our best
                                    to get you the stocks! </p>
                                <Button sx={{mt: 2, mb: 5}} fullWidth variant="contained" color="primary"
                                        onClick={handleSubmit}> Request stocks </Button>
                            </Box>
                        </div>
                    </Paper>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default RequestStocks;