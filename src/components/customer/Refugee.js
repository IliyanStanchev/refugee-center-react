import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import RefugeeNavigationBar from "../navigation/RefugeeNavigation";
import { Routes, Route } from "react-router-dom";
import { ReactSession } from 'react-client-session';
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

    const [user, setUser] = useState(null);
    const [openVerification, setOpenVerification] = useState(false);

    useEffect(() => {

        if (id === undefined)
            return;

        if (id == null)
            return;

        if (id <= 0) {
            navigate(-1);
            return;
        }

        UserService.getUser(id).then(response => {
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
                navigate(-1);
                return;
            });

    });

    return (

        <div> <RefugeeNavigationBar />
            <Box>
                <Routes>
                    <Route path="/request-stocks" element={<RequestStocks />} />
                    <Route path="/request-location-change" element={<RequestLocationChange />} />
                    <Route path="/request-medical-help" element={<RequestMedicalHelp />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/requests" element={<Requests />} />
                    <Route path="/profile" element={<RefugeeProfile />} />
                </Routes>
                <CustomerFooter />
            </Box>
        </div>
    );

}

export default Refugee