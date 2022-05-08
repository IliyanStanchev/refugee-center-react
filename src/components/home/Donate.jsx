import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import env from "react-dotenv";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Button } from "@mui/material";
import TextField from '@mui/material/TextField';
import NumberFormat from 'react-number-format';
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Card from '@mui/material/Card';
import MyText from "../../controls/MyText";
import DonationService from "../../services/DonationService";

export default function DonateMoney() {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [orderID, setOrderID] = useState(false);
    const [amount, setAmount] = useState(0);

    const navigate = useNavigate();

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

    const handleValueChange = (value) => {

        setErrorMessage(null);
        setAmount(value);
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
        <Box sx={{ ml: 10, mr: 10, mb: 10, mt: 10 }} textAlign='center' marginTop={5}>
            <Card   >
                <PayPalScriptProvider
                    options={{
                        "client-id": env.CLIENT_ID,
                    }}
                >
                    <FormControl sx={{ mt: 5 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                        <NumberFormat
                            customInput={OutlinedInput}
                            onValueChange={(values) => handleValueChange(values.value)}
                            value={amount}
                            id="outlined-adornment-amount"
                            variant="outlined"
                            error={amount <= 0}
                            endAdornment={<InputAdornment position="end">USD</InputAdornment>}
                            label="Amount"
                            disabled={show}
                        />
                    </FormControl>
                    <Button
                        sx={{ ml: 2, mt: 6, mb: 5 }}
                        variant="contained"
                        onClick={() => handleDonateButton(!show)}>
                        {show ? "Change amount" : "Donate"}
                    </Button>
                    {errorMessage && <p style={{ color: "red" }} > {errorMessage} </p>}
                    <Box margin={10} >
                        {show ? (
                            <div>
                                <MyText> Pick your payment method </MyText>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                />
                            </div>
                        ) : success ? (<MyText> Thank you for donating!  </MyText>) : null}
                    </Box>
                </PayPalScriptProvider>
            </ Card >
        </Box >
    );
}