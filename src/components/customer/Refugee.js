import React, {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import RefugeeNavigationBar from "../navigation/RefugeeNavigation";
import {ReactSession} from 'react-client-session';
import Box from '@mui/material/Box';
import UserService from "../../services/UserService";
import Messages from './../administration/Messages';
import RequestStocks from './RequestStocks';
import RequestLocationChange from './RequestLocationChange';
import RequestMedicalHelp from './RequestMedicalHelp';
import RefugeeProfile from './RefugeeProfile';
import Requests from './../administration/Requests';
import CustomerFooter from "../footer/CustomerFooter";

const Refugee = () => {

    const navigate = useNavigate();
    const id = ReactSession.get('id');
    const sessionTimestamp = ReactSession.get('timestamp');

    const [user, setUser] = useState(null);
    const [openVerification, setOpenVerification] = useState(false);

    useEffect(() => {

        const authorizationToken = ReactSession.get('authorization');

        let userSession = {
            id: id,
            authorizationToken: authorizationToken
        }

        UserService.verifyUser(userSession).then(response => {
            if (response.data.role.roleType !== process.env.REACT_APP_CUSTOMER) {
                navigate(-1);
                return;
            }

            let accountStatus = response.data.accountStatus.accountStatusType;
            if (accountStatus === 'Approved') {
                navigate('/verify-refugee');
            }
        })
            .catch(error => {
                if (error.response.status == process.env.REACT_APP_HTTP_STATUS_UNAUTHORIZED) {
                    navigate("/unauthorized-page");
                    return;
                }

                navigate(-1);
            });
    });

    return (

        <div><RefugeeNavigationBar/>
            <Box>
                <Routes>
                    <Route path="/request-stocks" element={<RequestStocks/>}/>
                    <Route path="/request-location-change" element={<RequestLocationChange/>}/>
                    <Route path="/request-medical-help" element={<RequestMedicalHelp/>}/>
                    <Route path="/messages" element={<Messages/>}/>
                    <Route path="/requests" element={<Requests/>}/>
                    <Route path="/profile" element={<RefugeeProfile/>}/>
                </Routes>
                <CustomerFooter/>
            </Box>
        </div>
    );

}

export default Refugee