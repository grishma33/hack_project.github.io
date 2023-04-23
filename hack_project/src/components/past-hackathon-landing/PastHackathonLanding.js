import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Container, Grid } from "@mui/material";
import useStyles from "../ui/Style";
import axios from "axios";
import silderimage from "../../static/Icons/silderimage.jpg"
import "./PastHackathonLanding.css";

const PastHackathonLanding = () => {
    const classes = useStyles();
    const [pastHackathons, setPastHackathons] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios
            //.get("http://localhost:4400/api/hackathon/get/pastHackathons", {
                .get("http://localhost:3001/getOrg", {
                headers: {
                    authorization: localStorage.getItem("session"),
                },
            })
            .then((responses) => {
                if (responses) {
                    console.log("Past Hackathons", responses.data.data);
                    setPastHackathons(
                        // responses.data.responses.get_past_hackathons_db
                        //     .pastHackathons
                        responses.data.data
                    );
                } else {
                }
            })
            .catch((err) => {
                console.log("Error getting past hackathons", err);
            });
    }, []);

    const handleCardClick = (hackId) => {
        history.push(`hackathon/view/${hackId}`);
    };

    return (
        <Container className={classes.cardContainer}>
            <h1>Upcoming Hackathons</h1>

            <Grid container style={{ marginTop: "10px" }}>
                {pastHackathons.map((hackathon) => (
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        key={hackathon}
                        style={{ paddingRight: "15px", paddingTop: "15px" }}
                    >
                        <Card sx={{ maxWidth: 700, height: "330px" }}>
                            <CardActionArea
                                onClick={() => {
                                    handleCardClick(hackathon._id);
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={silderimage}
                                    // image="C://Users/GRISHMA/hack_project/screenshots/Overview_Page.png"
                                    alt="hackathon image"
                                    className={classes.cardMedia}
                                />

                                {/* <CardMedia>
                                    <Typography
                                        variant="h6"
                                        fontFamily="Open Sans"
                                        gutterBottom
                                    >
                                        {"Hackathon ORG."}
                                    </Typography>
                                </CardMedia> */}
{/* 
                                    <CardMedia
                                    component="img"
                                    height="140"
                                    //image="https://source.unsplash.com/random"
                                    image="C://Users/GRISHMA/hack_project/screenshots/Overview_Page.png"
                                    alt="hackathon image"
                                    // className={classes.cardMedia}
                                /> */}


                                <CardContent className={classes.cardContent}>
                                    <Typography
                                        variant="h6"
                                        fontFamily="Open Sans"
                                        gutterBottom
                                    >
                                        {hackathon.hackTitle}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                        style={{
                                            textAlign: "justify",
                                            justifyContent: "center",
                                        }}
                                        className="line-clamp module"
                                    >
                                        {hackathon.hackDescription}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
                {pastHackathons.length === 0 && (
                    <Typography
                        fontFamily="Open Sans"
                        variant="h6"
                        style={{color: 'red'}}
                    >
                        No upcoming Hackathons! 😀
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default PastHackathonLanding;
