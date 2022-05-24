import React from "react";
import HomeRouter from "./HomeRouter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./components/administration/Admin";
import { ReactSession } from 'react-client-session';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lightGreen } from '@mui/material/colors';

export default function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: lightGreen[800],
      },
    },
  });

  ReactSession.setStoreType("localStorage");

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<HomeRouter />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}