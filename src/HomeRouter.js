import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/navigation/NavigationBar";
import Home from "./components/home/Home";
import About from "./components/home/About";
import News from "./components/home/News";
import Volunteer from "./components/home/Volunteer";
import Contact from "./components/home/Contact";
import DonateMoney from "./components/home/Donate";
import LoginComponent from "./components/login/LoginComponent";
import ForgotPasswordComponent from "./components/login/ForgotPasswordComponent";
import Footer from "./components/footer/Footer";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { ReactSession } from 'react-client-session';
import "./style.css"

const theme = createTheme();

export default function HomeRouter() {

  const [isLoginShown, setIsLoginShown] = React.useState(false)

  const handleLoginClick = () => {
    setIsLoginShown((isLoginShown) => !isLoginShown)
  }

  useEffect(() => {
    ReactSession.set('id', 0);
  });

  return (
    <ThemeProvider theme={theme}>
      <NavigationBar handleLoginClick={handleLoginClick} />
      <Grid container
        display="flex"
        justifyContent="center"
        style={{ minHeight: '100vh' }}>
        <CssBaseline />
        <Grid item
          alignContent="center"
          xs={9}
          sx={{
            backgroundImage: 'url(https://img.huffingtonpost.com/asset/5d0179702500004e12df2b4e.jpeg?ops=1778_1000)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/news" element={<News />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/donate" element={<DonateMoney />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Grid>
        <Grid item xs={3} component={Paper} elevation={6} style={{ minWidth: "350px" }}
          justifyContent="center" >
          <Routes>
            <Route path="/forgot-password" element={!isLoginShown ? (<LoginComponent />) : <ForgotPasswordComponent />} />
            <Route path="/" element={isLoginShown ? (<LoginComponent />) : (<div>Hello</div>)} />
            <Route path="/about" element={isLoginShown ? (<LoginComponent />) : (<div>Hello</div>)} />
            <Route path="/news" element={isLoginShown ? (<LoginComponent />) : (<div>Hello</div>)} />
            <Route path="/volunteer" element={isLoginShown ? (<LoginComponent />) : (<div>Hello</div>)} />
            <Route path="/donate" element={isLoginShown ? (<LoginComponent />) : (<div>Hello</div>)} />
            <Route path="/contact" element={isLoginShown ? (<LoginComponent />) : (<div>Hello</div>)} />
          </Routes>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider >
  );
}