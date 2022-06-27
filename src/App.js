import React from "react";
import HomeRouter from "./HomeRouter";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Admin from "./components/administration/Admin";
import Moderator from "./components/administration/Moderator";
import Refugee from "./components/customer/Refugee";
import {ThemeProvider} from '@mui/material/styles';
import VerifyRefugeeDialog from './components/customer/VerifyRefugeeDialog';
import {ReactSession} from 'react-client-session';
import MyTheme from './controls/MyTheme';
import UnauthorizedPage from './components/error/UnauthorizedPage';

export default function App() {

    ReactSession.setStoreType("sessionStorage");

    return (
        <ThemeProvider theme={MyTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<HomeRouter/>}/>
                    <Route path="/admin/*" element={<Admin/>}/>
                    <Route path="/moderator/*" element={<Moderator/>}/>
                    <Route path="/verify-refugee" element={<VerifyRefugeeDialog/>}/>
                    <Route path="/refugee/*" element={<Refugee/>}/>
                    <Route path="/unauthorized-page" element={<UnauthorizedPage/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}