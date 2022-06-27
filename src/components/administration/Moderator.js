import React, {useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import ModeratorNavigationBar from "../navigation/ModeratorNavigation";
import Registration from './Registration';
import Groups from './Groups';
import Messages from './Messages';
import Facilities from './Facilities';
import Donations from './Donations';
import UserProfile from './UserProfile';
import {ReactSession} from 'react-client-session';
import Box from '@mui/material/Box';
import UserService from "../../services/UserService";
import CustomerFooter from "../footer/CustomerFooter";
import Requests from './Requests';
import Questions from './Questions';

const Moderator = () => {

    const navigate = useNavigate();
    const id = ReactSession.get('id');

    useEffect(() => {

        const authorizationToken = ReactSession.get('authorization');

        let userSession = {
            id: id,
            authorizationToken: authorizationToken
        }

        UserService.verifyUser(userSession).then(response => {
            if (response.data.role.roleType !== process.env.REACT_APP_MODERATOR) {
                navigate(-1);

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
        <div>
            <ModeratorNavigationBar></ModeratorNavigationBar>
            <Box>
                <Routes>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/groups" element={<Groups/>}/>
                    <Route path="/messages" element={<Messages/>}/>
                    <Route path="/facilities" element={<Facilities/>}/>
                    <Route path="/donations" element={<Donations/>}/>
                    <Route path="/requests" element={<Requests/>}/>
                    <Route path="/questions" element={<Questions/>}/>
                    <Route path="/profile" element={<UserProfile/>}/>
                </Routes>
                <CustomerFooter/>
            </Box>
        </div>
    );

}

export default Moderator