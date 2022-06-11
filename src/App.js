import React from "react";
import HomeRouter from "./HomeRouter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./components/administration/Admin";
import Moderator from "./components/administration/Moderator";
import Refugee from "./components/customer/Refugee";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightGreen } from '@mui/material/colors';
import VerifyRefugeeDialog from './components/customer/VerifyRefugeeDialog';
import { ReactSession } from 'react-client-session';
import MyTheme from './controls/MyTheme';

export default function App() {

  ReactSession.setStoreType("localStorage");

  return (
    <ThemeProvider theme={MyTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<HomeRouter />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/moderator/*" element={<Moderator />} />
          <Route path="/verify-refugee" element={<VerifyRefugeeDialog />} />
          <Route path="/refugee/*" element={<Refugee />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}