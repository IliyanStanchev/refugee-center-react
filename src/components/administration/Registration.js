import * as React from 'react';
import {useEffect} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {ThemeProvider} from '@mui/material/styles';
import MainData from './RegistrationWizard/MainData';
import PersonalData from './RegistrationWizard/PersonalData';
import AdditionalData from './RegistrationWizard/AdditionalData';
import {lightGreen} from '@mui/material/colors';
import HowToRegSharpIcon from '@mui/icons-material/HowToRegSharp';
import Avatar from '@mui/material/Avatar';
import MyTheme from '../../controls/MyTheme';
import UserService from '../../services/UserService';
import {ReactSession} from 'react-client-session';

const ABSTRACT_API_URL = process.env.REACT_APP_ABSTRACT_API_URL;
const DELIVERABLE_EMAIL = 'DELIVERABLE';

const MAIN_DATA_STEP = 0;
const PERSONAL_DATA_STEP = 1;
const ADDITIONAL_DATA_STEP = 2;

const steps = ['Main Data', 'Personal Data', 'Additional Data'];

const Registration = () => {

    const id = ReactSession.get('id');

    const [user, setUser] = React.useState({
        firstName: ''
        , lastName: ''
        , email: ''
        , identifier: ''
        , country: null
        , state: null
        , city: null
        , address: ''
        , phoneNumber: ''
        , age: 1
        , shelter: null
        , diseases: ''
        , alergens: ''
        , specialDiet: ''
        , hasError: true
    });

    const [errorMessage, setErrorMessage] = React.useState(null);

    const [emailError, setEmailError] = React.useState(true);
    const [dataError, setDataError] = React.useState(true);

    const [disableNext, setDisableNext] = React.useState(false);

    const [activeStep, setActiveStep] = React.useState(0);
    const [userRole, setUserRole] = React.useState(process.env.REACT_APP_MODERATOR)

    useEffect(() => {

        UserService.getUser(id).then(response => {
            setUserRole(response.data.role.roleType);
        })

    });


    const handleNext = () => {

        setErrorMessage(null);

        if (user.hasError) {
            setErrorMessage('Please fill all required fields');
            return;
        }

        if (activeStep === MAIN_DATA_STEP) {
            setDisableNext(true);
            checkInputData();
        }

        if (activeStep == PERSONAL_DATA_STEP) {
            setActiveStep(activeStep + 1);
        }

        if (activeStep === ADDITIONAL_DATA_STEP) {
            handleRefugeeRegistration();
        }
    };

    const handleBack = () => {

        setErrorMessage(null);
        if (activeStep === MAIN_DATA_STEP) {

            handleEmployeeRegistration();
            return;
        }

        setActiveStep(activeStep - 1);
    };

    const handleEmployeeRegistration = () => {

        setErrorMessage(null);
        if (user.hasError) {
            setErrorMessage('Please fill all required fields');
            return;
        }

        UserService.createEmployee(user)
            .then(response => handleResponse(response))
            .catch((error) => handleError(error.response));
    }

    const handleRefugeeRegistration = () => {

        setErrorMessage(null);
        if (user.hasError) {
            setErrorMessage('Please fill all required fields');
            return;
        }

        let refugee = {
            user: {
                firstName: user.firstName
                , lastName: user.lastName
                , email: user.email
                , identifier: user.identifier
            }

            , address: {
                countryIsoCode: user.country.isoCode
                , stateIsoCode: user.state.isoCode
                , cityName: user.city.name
                , address: user.address
            }

            , phoneNumber: user.phoneNumber
            , age: user.age
            , facility: user.shelter
            , diseases: user.diseases
            , allergens: user.allergens
            , specialDiet: user.specialDiet
        }

        let refugeeRegistrationData = {
            employeeId: id
            , refugee: refugee
        }

        UserService.createRefugee(refugeeRegistrationData)
            .then(response => handleResponse(response))
            .catch((error) => handleError(error.response));
    }

    const handleResponse = (response) => {

        if (response.status == process.env.REACT_APP_HTTP_STATUS_OK) {
            setActiveStep(steps.length);
            setUserRole(response.data);
        } else {
            handleError(response);
        }
    }

    const handleError = (response) => {

        setDataError(true);
        setEmailError(true);

        if (response.status == process.env.REACT_APP_HTTP_STATUS_INTERNAL_SERVER_ERROR) {
            setErrorMessage("Something went wrong. Please try again later");
        } else if (response.status == process.env.REACT_APP_HTTP_STATUS_CUSTOM_SERVER_ERROR) {
            setErrorMessage(response.data);
        } else {
            setErrorMessage("Something went wrong. Please try again later");
        }

    }

    const sendEmailValidationRequest = async (email) => {
        try {
            //const response = await axios.get(ABSTRACT_API_URL + '&email=' + email);
            //if (response.data.deliverability != DELIVERABLE_EMAIL) {
            setEmailError(false);
            setDisableNext(false);
            return;
            // }

            setErrorMessage("This email doesn't exist");
            setEmailError(true);
            setDisableNext(false);
        } catch (error) {
            setErrorMessage("This email doesn't exist");
            setEmailError(true);
            setDisableNext(false);
        }
    }

    const checkInputData = () => {

        if (activeStep != MAIN_DATA_STEP)
            return;

        sendEmailValidationRequest(user.email);

        UserService.validateUserCreation(user)
            .then(response =>
                setDataError(false))
            .catch((error) => handleError(error.response));

    }

    const getStepContent = (step) => {
        switch (step) {
            case MAIN_DATA_STEP:
                return <MainData user={user}/>;
            case PERSONAL_DATA_STEP:
                return <PersonalData user={user}/>;
            case ADDITIONAL_DATA_STEP:
                return <AdditionalData user={user}/>;
            default:
                return;
        }
    }

    useEffect(() => {

        if (emailError === true) {
            return;
        }

        if (dataError === true)
            return;

        setActiveStep(activeStep + 1);
        setEmailError(true);
        setDataError(true);
    });

    return (
        <ThemeProvider theme={MyTheme}>
            <CssBaseline/>
            <Container component="main" maxWidth="sm" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Avatar sx={{bgcolor: lightGreen[800]}}>
                            <HowToRegSharpIcon/>
                        </Avatar>
                    </div>
                    <Typography component="h1" variant="h4" align="center">
                        Registration
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                        {steps.map((label) => (
                            <Step sx={{color: lightGreen[800]}} key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {errorMessage && <p style={{color: "red", textAlign: "center"}}>{errorMessage}</p>}
                    <React.Fragment>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="h5" gutterBottom align='center'>
                                    Succesfull user registration
                                </Typography>
                                <Typography variant="subtitle1" align='center'>
                                    {userRole == process.env.REACT_APP_MODERATOR ?
                                        "Refugee registration is pending for approval" :
                                        "Don't forget to remind customer to check his email for account information"
                                    }
                                </Typography>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {getStepContent(activeStep)}
                                <Box sx={{display: 'flex', justifyContent: 'flex', textAlign: 'center'}}>
                                    {(userRole === process.env.REACT_APP_ADMINISTRATOR || (userRole === process.env.REACT_APP_MODERATOR && activeStep != MAIN_DATA_STEP)) &&
                                        <Button variant="contained"
                                                onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                            {activeStep == MAIN_DATA_STEP ? 'Employee Registration' : 'Back'}
                                        </Button>}
                                    <Button
                                        variant="contained"
                                        fullWidth={userRole == process.env.REACT_APP_MODERATOR && activeStep == MAIN_DATA_STEP}
                                        onClick={handleNext}
                                        sx={{mt: 3, ml: 1}}
                                        disabled={disableNext}
                                    >
                                        {activeStep == MAIN_DATA_STEP ? 'Refugee Registration' : activeStep === steps.length - 1 ? 'Finish registration' : 'Next'}

                                    </Button>
                                </Box>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default Registration;