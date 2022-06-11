import React from "react";
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { lightGreen } from '@mui/material/colors';
import { Link } from "@mui/material";

const SocialNetworks = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} >
                <Link href="https://twitter.com/?lang=bg" target="_blank">
                    <TwitterIcon sx={{ fontSize: 60, mt: 5, color: lightGreen[800] }} />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=100003779133605" target="_blank">
                    <FacebookIcon sx={{ fontSize: 60, mt: 5, color: lightGreen[800] }} />
                </Link>
                <Link href="https://www.instagram.com/sacha_rullz/" target="_blank">
                    <InstagramIcon sx={{ fontSize: 60, mt: 5, color: lightGreen[800] }} />
                </Link>
                <Link href="https://www.linkedin.com/in/iliyan-stanchev-838237224/" target="_blank">
                    <LinkedInIcon sx={{ fontSize: 60, mt: 5, color: lightGreen[800] }} />
                </Link>
            </div>
        </div>
    );
}
export default SocialNetworks; 