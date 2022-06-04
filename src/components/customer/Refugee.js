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

const Refugee = () => {

    const navigate = useNavigate();
    const id = ReactSession.get('id');

    useEffect(() => {

        if (id === undefined)
            return;

        if (id == null)
            return;

        if (id <= 0)
            navigate(-1);

        UserService.getUser(id).then(response => {
            if (response.data.role.roleType !== process.env.REACT_APP_CUSTOMER) {
                navigate(-1);
            }
        })
            .catch(error => { navigate(-1); });

    });

    return (
        <div>
            <RefugeeNavigationBar />
            <Box>
                <Routes>
                    <Route path="/request-stocks" element={<RequestStocks />} />
                    <Route path="/request-location-change" element={<RequestLocationChange />} />
                    <Route path="/request-medical-help" element={<RequestMedicalHelp />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/profile" element={<RefugeeProfile />} />
                </Routes>
            </Box>
        </div>
    );

}

export default Refugee