import React from "react";
import Button from '@mui/material/Button';
import {
    AppBar,
    Toolbar,
    CssBaseline,
    Typography,
    makeStyles,
    useTheme,
    useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import DrawerComponent from "./Drawer";
import logoImage from "../../images/safe_shelter_logo.png"
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@mui/material/Tooltip';

const useStyles = makeStyles((theme) => ({
    navigationBar: {
        backgroundColor: "rgba(34, 139, 34)",
        height: 78,

    },
    navlinks: {
        marginLeft: theme.spacing(12),
        display: "flex",
    },
    logo: {
        width: 120,
        height: 60,
        marginTop: 8,
    },
    link: {
        textDecoration: "none",
        color: "white",
        fontSize: "20px",
        marginLeft: theme.spacing(10),
        "&:hover": {
            color: "rgba(50,205,50)",
            borderBottom: "3px solid rgba(50,205,50)",
        },
    },
    loginButton: {
        marginLeft: "auto",
        display: "block",
        justifyContent: "right",
    }
}));

function NavigationBar({ handleLoginClick }) {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleClick = () => {
        handleLoginClick();
    }

    return (
        <AppBar position="static" className={classes.navigationBar}>
            <CssBaseline />
            <Toolbar>
                <Typography variant="h4" >
                    <img src={logoImage} className={classes.logo} />
                </Typography>
                {isMobile ? (
                    <DrawerComponent />
                ) : (
                    <div className={classes.navlinks}>
                        <Link to="/" className={classes.link}>
                            Home
                        </Link>
                        <Link to="/about" className={classes.link}>
                            About
                        </Link>
                        <Link to="/news" className={classes.link}>
                            News
                        </Link>
                        <Link to="/volunteer" className={classes.link}>
                            Volunteer
                        </Link>
                        <Link to="/contact" className={classes.link}>
                            Contact
                        </Link>
                        <Link to="/donate" className={classes.link}>
                            Donate
                        </Link>
                    </div>
                )}

                <div className={classes.loginButton}>
                    <Button onClick={handleClick}>
                        <Tooltip title="Login">
                            <LoginIcon className={classes.link} />
                        </Tooltip>
                    </Button>
                </div>
            </Toolbar>
        </AppBar >
    );
}
export default NavigationBar;
