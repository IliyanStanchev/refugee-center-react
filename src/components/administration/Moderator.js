import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import ModeratorNavigationBar from "../navigation/ModeratorNavigation";
import { Routes, Route } from "react-router-dom";
import Registration from './Registration';
import PendingRegistrations from './PendingRegistrations';
import Groups from './Groups';
import Messages from './Messages';
import Facilities from './Facilities';
import Donations from './Donations';
import UserProfile from './UserProfile';
import { ReactSession } from 'react-client-session';
import Box from '@mui/material/Box';
import UserService from "../../services/UserService";

const Moderator = () => {

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
            if (response.data.role.roleType !== process.env.REACT_APP_MODERATOR) {
                navigate(-1);
            }
        })
            .catch(error => { navigate(-1); });

    });
    return (
        <div>
            <ModeratorNavigationBar></ModeratorNavigationBar>
            <Box>
                <Routes>
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/facilities" element={<Facilities />} />
                    <Route path="/donations" element={<Donations />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
            </Box>
        </div>
    );

}

export default Moderator