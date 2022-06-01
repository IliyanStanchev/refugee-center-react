import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import AdminNavigationBar from "../navigation/AdminNavigation";
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


const Admin = () => {

    const navigate = useNavigate();
    const id = ReactSession.get('id');

    useEffect(() => {
        if (id <= 0)
            navigate('/');
    });

    return (
        <div>
            <AdminNavigationBar></AdminNavigationBar>
            <Box>
                <Routes>
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/confirm-registrations" element={<PendingRegistrations />} />
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

export default Admin