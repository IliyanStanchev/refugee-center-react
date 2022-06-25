import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Button } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Card from '@mui/material/Card';
import MyText from "../../controls/MyText";
import DonationService from "../../services/DonationService";
import { lightGreen } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import RecentDonors from './RecentDonors';

export default function DonateMoney() {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [orderID, setOrderID] = useState(false);
    const [amount, setAmount] = useState(0);

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        description: "Refugee Center Donation",
                        amount: {
                            currency_code: "USD",
                            value: amount,
                        },
                    },
                ],
            })
            .then((orderID) => {
                setOrderID(orderID);
                return orderID;
            });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            registerNewDonation(details);
            setSuccess(true);
            setShow(false);
        });
    };

    const registerNewDonation = (details) => {

        let donation = {
            quantity: details.purchase_units[0].amount.value,
            unit: details.purchase_units[0].amount.currency_code,
            donatorName: details.payer.name.given_name + " " + details.payer.name.surname,
            donatorEmail: details.payer.email_address
        }

        DonationService.donateMoney(donation);
    }

    const handleDonateButton = () => {

        setSuccess(false);
        setErrorMessage(null)

        if (amount <= 0) {
            setErrorMessage("Please enter a valid amount");
            return;
        }

        setShow(!show);
    }

    return (
        <Grid container >
            <Grid item xs={3.5}>
                <RecentDonors />
            </Grid>
            <Grid item xs={7.5}>
                <Card
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: 800,
                        textAlign: 'center',
                        border: 1
                        , borderColor: lightGreen[800]
                        , borderRadius: '16px'
                        , mt: 5
                    }}>
                    <FormControl variant="outlined" sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}>
                        <InputLabel htmlFor="outlined-adornment-oldPassword">Amount</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-oldPassword"
                            type='number'
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value).toFixed(2))}
                            endAdornment={
                                <InputAdornment position="end">
                                    USD
                                </InputAdornment>
                            }
                            label="Amount"
                        />
                    </FormControl>
                    <Button
                        sx={{ ml: 2, mr: 2, mt: 2, mb: 2 }}
                        variant="contained"
                        onClick={() => handleDonateButton(!show)}>A
                        {show ? "Change amount" : "Donate"}
                    </Button>
                    <PayPalScriptProvider
                        options={{ "client-id": process.env.REACT_APP_CLIENT_ID }} >
                        {errorMessage && <p style={{ color: "red" }} > {errorMessage} </p>}
                        <Box margin={10} >
                            {show ? (
                                <div>
                                    <MyText> Pick your payment method </MyText>
                                    <PayPalButtons
                                        style={{ layout: "vertical", position: 'absolute' }}
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                    />
                                </div>
                            ) : success ? (<MyText> Thank you for donating!  </MyText>) : null}
                        </Box>
                    </PayPalScriptProvider>
                </ Card >
            </Grid>
        </Grid>
    );
}