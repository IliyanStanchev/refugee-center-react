import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import {lightGreen} from '@mui/material/colors';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import {Link} from "@mui/material";

export default function CustomerFooter() {

    const ref = React.useRef(null);

    return (
        <Box sx={{pb: 7}} ref={ref}>
            <CssBaseline/>
            <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
                <BottomNavigation
                    sx={{bgcolor: lightGreen[800]}}
                    showLabels
                >


                    <BottomNavigationAction label="Twitter"
                                            icon={<Link href="https://twitter.com/?lang=bg" target="_blank">
                                                <TwitterIcon sx={{fontSize: 30, color: 'white'}}/>
                                            </Link>}/>
                    <BottomNavigationAction label="Facebook"
                                            icon={<Link href="https://www.facebook.com/profile.php?id=100003779133605"
                                                        target="_blank">
                                                <FacebookIcon sx={{fontSize: 30, color: 'white'}}/>
                                            </Link>}/>
                    <BottomNavigationAction label="Instagram"
                                            icon={<Link href="https://www.instagram.com/sacha_rullz/" target="_blank">
                                                <InstagramIcon sx={{fontSize: 30, color: 'white'}}/>
                                            </Link>}/>
                    <BottomNavigationAction label="LinkedIn"
                                            icon={<Link href="https://www.linkedin.com/in/iliyan-stanchev-838237224/"
                                                        target="_blank">
                                                <LinkedInIcon sx={{fontSize: 30, color: 'white'}}/>
                                            </Link>}/>
                </BottomNavigation>
            </Paper>
        </Box>
    );
}
