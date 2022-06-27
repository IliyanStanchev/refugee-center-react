import React, {useEffect, useState} from "react";
import {CardContent} from "@mui/material";
import Card from '@mui/material/Card';
import DonationService from "../../services/DonationService";
import {lightGreen} from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

export default function RecentDonors() {

    const [donors, setDonors] = useState([]);

    const getDonors = async () => {
        try {
            DonationService.getDonors()
                .then(
                    response => {
                        setDonors(response.data);
                    }
                )

        } catch (error) {
            setDonors([]);
        }
    };

    useEffect(() => {
        getDonors();
    }, []);

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 400,
                textAlign: 'center',
                border: 1
                , borderColor: lightGreen[800]
                , borderRadius: '16px'
                , mr: 1
                , ml: 2
                , mt: 5
            }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Our recent donors
                </Typography>

                <List dense={true}>
                    {donors.map((donor, index) => {
                        return (<ListItem>
                            <ListItemIcon>
                                <VolunteerActivismIcon/>
                            </ListItemIcon>
                            <ListItemText
                                primary={donor.name}

                            />
                        </ListItem>)

                    })}
                </List>

            </CardContent>
        </ Card>
    );
}