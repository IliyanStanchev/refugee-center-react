import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/navigation/NavigationBar";
import Home from "./components/home/Home";
import About from "./components/home/About";
import News from "./components/home/News";
import Volunteer from "./components/home/Volunteer";
import DonateMoney from "./components/home/Donate";
import LoginComponent from "./components/login/LoginComponent";
import ForgotPasswordComponent from "./components/login/ForgotPasswordComponent";
import Footer from "./components/footer/Footer";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import { ReactSession } from 'react-client-session';
import MyTheme from './controls/MyTheme';
import SocialNetworks from './components/home/SocialNetworks';
import Contact from './components/home/Contact';

export default function HomeRouter() {

  const [isLoginShown, setIsLoginShown] = React.useState(false)

  const handleLoginClick = () => {
    setIsLoginShown((isLoginShown) => !isLoginShown)
  }

  useEffect(() => {
    ReactSession.set('id', 0);
  });

  return (
    <ThemeProvider theme={MyTheme}>
      <NavigationBar handleLoginClick={handleLoginClick} />

      <Grid container >

        <Grid item zeroMinWidth xs={isLoginShown ? '9' : '11.9'}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<News />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/donate" element={<DonateMoney />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
        </Grid>

        <Grid zeroMinWidth item xs={isLoginShown ? '3' : '0.1'} sx={{ mt: 5 }}  >
          <Routes>
            <Route path="/forgot-password" element={!isLoginShown ? (<LoginComponent />) : <ForgotPasswordComponent />} />
            <Route path="/" element={isLoginShown ? (<LoginComponent />) : (<SocialNetworks />)} />
            <Route path="/about" element={isLoginShown ? (<LoginComponent />) : (<SocialNetworks />)} />
            <Route path="/news" element={isLoginShown ? (<LoginComponent />) : (<SocialNetworks />)} />
            <Route path="/volunteer" element={isLoginShown ? (<LoginComponent />) : (<SocialNetworks />)} />
            <Route path="/donate" element={isLoginShown ? (<LoginComponent />) : (<SocialNetworks />)} />
            <Route path="/contact" element={isLoginShown ? (<LoginComponent />) : (<SocialNetworks />)} />
          </Routes>
        </Grid>
      </Grid>
      <Footer />
    </ThemeProvider >
  );
}