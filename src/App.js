import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomeRouter from "./HomeRouter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminComponent from "./components/admin/AdminComponent";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminComponent />} />
        <Route path="/*" element={<HomeRouter />} />
      </Routes>
    </BrowserRouter>
  );
}