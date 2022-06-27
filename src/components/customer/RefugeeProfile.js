import React, {useEffect, useState} from "react";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import UserService from "../../services/UserService";
import {ReactSession} from 'react-client-session';
import {ThemeProvider} from "styled-components";
import MyTheme from './../../controls/MyTheme';
import UserProfile from "../administration/UserProfile";
import RefugeeDialog from './RefugeeDialog';

const options = {year: 'numeric', month: 'long', day: 'numeric'};

const RefugeeProfile = () => {

    const id = ReactSession.get('id');

    const [user, setUser] = useState(null);
    const [userPage, setUserPage] = useState(false);

    const getUser = async () => {
        try {

            UserService.getUser(id)
                .then(
                    response => {
                        setUser(response.data);
                    }
                )

        } catch (error) {
            setUser(null);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (

        <ThemeProvider theme={MyTheme}>
            <div style={{justifyContent: 'center', textAlign: 'center', marginTop: 40}}>
                <ToggleButtonGroup value={userPage} color="primary">
                    <ToggleButton value={true} onClick={() => setUserPage(true)}> User data </ToggleButton>
                    <ToggleButton value={false} onClick={() => setUserPage(false)}> Refugee data </ToggleButton>
                </ToggleButtonGroup>
                {userPage ? <UserProfile/> : <RefugeeDialog/>}
            </div>
        </ThemeProvider>
    );

}

export default RefugeeProfile;