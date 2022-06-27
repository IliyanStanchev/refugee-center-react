import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const About = () => {
    return (
        <Card sx={{maxWidth: 500, mt: 2}}>
            <CardMedia
                component="img"
                height="210"
                image="https://i.ibb.co/vQYZQQY/bigstock-hundreds-of-migrants-and-refug-294146482-990x556.jpg"
                alt="about"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    About us
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Typography>
            </CardContent>
        </Card>
    );

}

export default About;