import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {Grid} from "@mui/material";

const News = () => {
    return (
        <Grid container>
            <Grid item xs={4}>
                <Card sx={{maxWidth: 500, mt: 2, ml: 1}}>
                    <CardMedia
                        component="img"
                        height="210"
                        image="https://i.ibb.co/w4j9qs7/help-others-Artboard-10-3x.png"
                        alt="about"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Our Mission
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card sx={{maxWidth: 500, mt: 2}}>
                    <CardMedia
                        component="img"
                        height="210"
                        image="https://i.ibb.co/Px02rwT/differences-employee-worker.webp"
                        alt="about"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Our staf is growing
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={4}>
                <Card sx={{maxWidth: 500, mt: 2}}>
                    <CardMedia
                        component="img"
                        height="210"
                        image="https://i.ibb.co/xsQzSKG/5e8dfa294.webp"
                        alt="about"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Activities and Events
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                            galley of type and scrambled it to make a type specimen book. It has survived not only five
                            centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                            passages, and more recently with desktop publishing software like Aldus PageMaker including
                            versions of Lorem Ipsum.
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

}

export default News;