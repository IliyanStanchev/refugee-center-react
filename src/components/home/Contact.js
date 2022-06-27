import React from "react";
import Grid from '@mui/material/Grid';
import Map from './../../Map';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {lightGreen} from '@mui/material/colors';
import {Button, TextField} from "@mui/material";
import Reaptcha from 'reaptcha';
import QuestionService from "../../services/QuestionService";

const Contact = () => {

    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [verify, setVerify] = React.useState(false);

    const [responseMessage, setResponseMessage] = React.useState("");

    const [emailError, setEmailError] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [messageError, setMessageError] = React.useState(false);

    const handleSubmit = () => {

        setEmailError(false);
        setNameError(false);
        setMessageError(false);

        if (email.length === 0) {
            setEmailError(true);
            return;
        }

        if (name.length === 0) {
            setNameError(true);
            return;
        }

        if (message.length === 0) {
            setMessageError(true);
            return;
        }

        let question = {
            email: email,
            name: name,
            message: message
        }

        QuestionService.sendQuestion(question)
            .then(() => {
                setResponseMessage("Question send successfully");
                setVerify(false);
                window.grecaptcha.reset();
                setEmail("");
                setName("");
                setMessage("");
            })
    }

    return (
        <Grid container>
            <Grid item zeroMinWidth xs={6}>
                <Card
                    sx={{border: 1, borderColor: lightGreen[800], borderRadius: '16px', maxWidth: 700, ml: 5, mt: 10}}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Our centres
                        </Typography>
                    </CardContent>
                    <Map/>
                </Card>
            </Grid>
            <Grid item zeroMinWidth xs={6}>
                <Card sx={{border: 1, borderColor: lightGreen[800], borderRadius: '16px', maxWidth: 700, mt: 10}}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Ask us something
                            <p style={{color: lightGreen[800]}}> {responseMessage} </p>
                        </Typography>
                        <TextField sx={{mt: 2, mb: 2}}
                                   fullWidth
                                   label="Email"
                                   variant="outlined"
                                   onChange={(event) => {
                                       setEmail(event.target.value)
                                   }}
                                   error={emailError}
                                   helperText={emailError ? 'Fill correct email' : ''}
                        />
                        <TextField sx={{mt: 2, mb: 2}}
                                   fullWidth
                                   label="Name"
                                   variant="outlined"
                                   onChange={(event) => {
                                       setName(event.target.value)
                                   }}
                                   error={nameError}
                                   helperText={nameError ? 'Fill your name' : ''}
                        />
                        <TextField sx={{mt: 2, mb: 2}}
                                   multiline
                                   fullWidth
                                   label="Message"
                                   variant="outlined"
                                   onChange={(event) => {
                                       setMessage(event.target.value)
                                   }}
                                   error={messageError}
                                   helperText={messageError ? 'Fill message' : ''}
                        />
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Reaptcha
                                sitekey="6LcvR68fAAAAAJOX3feeHRMvDMe3J2bxVIyY0k9O"
                                onVerify={(response) => {
                                    setVerify(true)
                                }}
                                reset/>
                            <Button variant="contained" readOnly={!verify} onClick={handleSubmit}>Submit</Button>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

}

export default Contact;