import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router";
import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import axios from "axios";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";
import Tabs from "../tabs/Tabs";
import Codeeditor from "../code-editor/CodeEditor";
import Upcominghackathons from "../Hackathon/upcoming-hackathons/UpcomingHackathons";
import JS from "../../static/Icons/JS.svg";
import Python from "../../static/Icons/Python.svg";
import CPlusPlus from "../../static/Icons/C++.svg";
import DS from "../../static/Icons/DS.svg";
import Algorithm from "../../static/Icons/Algorithm.svg";
import { AppContext } from "../../AppContext";
import Carousel from "../carousel/Carousel";

const useStyles = makeStyles((theme) => ({
    dashboardContainer: {
        width: "100vw",
        height: "100vh",
    },
    carousel: {
        height: "400px",
        width: "100vw",
        backgroundColor: "#444",
    },
    upcomingHackathonsContainer: {
        margin: "auto",
        padding: "20px",
    },
    card: {
        padding: "auto",
    },
    cardContainer: {
        // marginLeft: "auto",
        // display: "flex",
        // justifyContent: "space-between"
    },
    openHackathon: {
        border: "2px solid lightgreen",
        borderRadius: "5px",
        padding: "6px",
        color: theme.palette.secondary.main,
    },
    practiceCodingContainer: {
        // marginTop: "100px",
        margin: "auto",
        padding: "20px",
        backgroundColor: theme.palette.common.ternaryColor,
    },
    readArticlesGrid: {
        margin: "auto",
        padding: "20px",
    },
    codeEditorGrid: {
        margin: "auto",
        padding: "20px",
        backgroundColor: theme.palette.common.ternaryColor,
    },
}));

// For Testing Purpose
// let upcomingHackathons = [1, 2, 3, 4];

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState({});
    const history = useHistory();
    const classes = useStyles();
    const { setShowBanner } =
        useContext(AppContext);
    // For Code Editor
    const [html, setHTML] = useState("");
    const [python, setPython] = useState("");

    const codeEditorRef = useRef(null);
    const articleRef = useRef(null);
    const questionsRef = useRef(null);
    const hackathonsRef = useRef(null);

    const navClickHandler = (sectionName) => {
        console.log("Click handled for", sectionName);
        switch (sectionName) {
            case "codeeditor":
                codeEditorRef.current.scrollIntoView();
                break;
            case "practice":
                questionsRef.current.scrollIntoView();
                break;
            case "learn":
                articleRef.current.scrollIntoView();
                break;
        }
    };

    useEffect(() => {
        axios
            .get(`http://localhost:3001/currentUserId/63ff8cefd32c0b12606fd9de`, {
                headers: {
                    authorization: localStorage.getItem("session"),
                },
            })
            .then((responses) => {
                console.log("C User Dash Resp", responses.data.data);
                setCurrentUser(responses.data.data);
            })
            .catch((err) => {
                console.log("ERR Current User in Dashboard", err);
                setShowBanner({
                    apiErrorResponse: "Error fetching data! Please try again.",
                });
            });
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setShowBanner({
                apiErrorResponse: "You must be signed in to view dashboard.",
            });
            return history.push("/auth/signin");
        }
    }, [currentUser]);

    const navigateToCoding = (category) => {
        history.push(`/coding/practice/${category}`);
    };

    return (
        <div>
            <NavBar
                currentUser={currentUser}
                location="dashboard"
                navClickHandler={navClickHandler}
            />
            <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                    <Carousel defaultSliders={true} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    className={classes.upcomingHackathonsContainer}
                >
                    <h1 style={{ paddingBottom: "15px" }}>
                        Upcoming Hackathons
                    </h1>
                    <Upcominghackathons />
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    className={classes.practiceCodingContainer}
                    ref={questionsRef}
                >
                    <h1 style={{ paddingBottom: "15px" }}>Practice Coding!</h1>
                    <Grid
                        container
                        style={{
                            alignItems: "center",
                            justifyItems: "center",
                        }}
                    >
                        <Grid item xs={12} sm={6} md={6}>
                            <Card className={classes.card}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="250"
                                        image="https://media.istockphoto.com/photos/man-working-on-laptop-at-cafe-picture-id1317787665?b=1&k=20&m=1317787665&s=170667a&w=0&h=BTy4IYYOiJFyX2c8eChRT2FpWCVRNSIH5HrVrQacWbE="
                                        alt="Hackathon Image"
                                    />

                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12} sm={12} md={12}>
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                >
                                                    Why Coding is Important?
                                                </Typography>
                                            </Grid>
                                            <Grid>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    <strong>
                                                        Lorem ipsum dolor sit
                                                        amet, consectetur
                                                        adipiscing elit, sed do
                                                        eiusmod tempor
                                                        incididunt ut labore et
                                                        dolore magna aliqua. Ut
                                                        enim ad minim veniam,
                                                        quis nostrud
                                                        exercitation ullamco
                                                        laboris nisi ut aliquip
                                                        ex ea commodo consequat.
                                                    </strong>
                                                </Typography>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    gutterBottom
                                                >
                                                    <strong>
                                                        Lorem ipsum dolor sit
                                                        amet, consectetur
                                                        adipiscing elit, sed do
                                                        eiusmod tempor
                                                        incididunt ut labore et
                                                        dolore magna aliqua. Ut
                                                        enim ad minim veniam,
                                                        quis nostrud
                                                        exercitation ullamco
                                                        laboris nisi ut aliquip
                                                        ex ea commodo consequat.
                                                    </strong>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} style={{paddingLeft: "15px"}}>
                            <Grid container>
                                <Grid item xs={4} style={{ margin: "10px 0" }}>
                                    <Card
                                        sx={{ display: "flex" }}
                                        onClick={() => {
                                            navigateToCoding("python");
                                        }}
                                    >
                                        <CardActionArea>
                                            <Grid
                                                container
                                                style={{
                                                    alignItems: "center",
                                                    justifyItems: "center",
                                                }}
                                            >
                                                <Grid item xs={6} md={6} sm={6}>
                                                    <CardMedia
                                                        component="img"
                                                        style={{
                                                            padding: "10px",
                                                        }}
                                                        image={Python}
                                                        alt="Live from space album cover"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={6} md={6}>
                                                    <CardContent
                                                        style={{
                                                            padding: "0px",
                                                            resize: "both",
                                                        }}
                                                    >
                                                        <Typography
                                                            component="div"
                                                            variant="h6"
                                                            fontFamily="Open Sans"
                                                        >
                                                            <center>
                                                                Python
                                                            </center>
                                                        </Typography>
                                                    </CardContent>
                                                </Grid>
                                            </Grid>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid
                                    item
                                    xs={4}
                                    style={{ margin: "10px 0" }}
                                ></Grid>
                                <Grid item xs={4} style={{ margin: "10px 0" }}>
                                    <Card
                                        sx={{ display: "flex" }}
                                        onClick={() => {
                                            navigateToCoding("javascript");
                                        }}
                                    >
                                        <CardActionArea>
                                            <Grid
                                                container
                                                style={{
                                                    alignItems: "center",
                                                    justifyItems: "center",
                                                }}
                                            >
                                                <Grid item xs={6} md={6} sm={6}>
                                                    <CardMedia
                                                        component="img"
                                                        style={{
                                                            padding: "10px",
                                                        }}
                                                        image={JS}
                                                        alt="Live from space album cover"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={6} md={6}>
                                                    <CardContent
                                                        style={{
                                                            padding: "0px",
                                                            resize: "both",
                                                        }}
                                                    >
                                                        <Typography
                                                            component="div"
                                                            variant="h6"
                                                            fontFamily="Open Sans"
                                                        >
                                                            <center>
                                                                JavaScript
                                                            </center>
                                                        </Typography>
                                                    </CardContent>
                                                </Grid>
                                            </Grid>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid
                                    item
                                    xs={4}
                                    style={{ margin: "10px 0" }}
                                ></Grid>
                                <Grid item xs={4} style={{ margin: "10px 0" }}>
                                    <Card
                                        sx={{ display: "flex" }}
                                        onClick={() => {
                                            navigateToCoding("c++");
                                        }}
                                    >
                                        <CardActionArea>
                                            <Grid
                                                container
                                                style={{
                                                    alignItems: "center",
                                                    justifyItems: "center",
                                                }}
                                            >
                                                <Grid item xs={6} md={6} sm={6}>
                                                    <CardMedia
                                                        component="img"
                                                        style={{
                                                            padding: "10px",
                                                        }}
                                                        image={CPlusPlus}
                                                        alt="Live from space album cover"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={6} md={6}>
                                                    <CardContent
                                                        style={{
                                                            padding: "0px",
                                                        }}
                                                    >
                                                        <Typography
                                                            component="div"
                                                            variant="h6"
                                                            fontFamily="Open Sans"
                                                        >
                                                            <center>C++</center>
                                                        </Typography>
                                                    </CardContent>
                                                </Grid>
                                            </Grid>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid
                                    item
                                    xs={4}
                                    style={{ margin: "10px 0" }}
                                ></Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={4} style={{ margin: "10px 0" }}>
                                    <Card
                                        sx={{ display: "flex" }}
                                        onClick={() => {
                                            navigateToCoding("data-structures");
                                        }}
                                    >
                                        <CardActionArea>
                                            <Grid
                                                container
                                                style={{
                                                    alignItems: "center",
                                                    justifyItems: "center",
                                                }}
                                            >
                                                <Grid item xs={6} md={6} sm={6}>
                                                    <CardMedia
                                                        component="img"
                                                        style={{
                                                            padding: "10px",
                                                        }}
                                                        image={DS}
                                                        alt="Live from space album cover"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={6} md={6}>
                                                    <CardContent
                                                        style={{
                                                            padding: "0px",
                                                        }}
                                                    >
                                                        <Typography
                                                            component="div"
                                                            variant="h6"
                                                            fontFamily="Open Sans"
                                                        >
                                                            <center>
                                                                Data Structures
                                                            </center>
                                                        </Typography>
                                                    </CardContent>
                                                </Grid>
                                            </Grid>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                                <Grid
                                    item
                                    xs={4}
                                    style={{ margin: "10px 0" }}
                                ></Grid>
                                <Grid item xs={4} style={{ margin: "10px 0" }}>
                                    <Card
                                        sx={{ display: "flex" }}
                                        onClick={() => {
                                            navigateToCoding("algorithms");
                                        }}
                                    >
                                        <CardActionArea>
                                            <Grid
                                                container
                                                style={{
                                                    alignItems: "center",
                                                    justifyItems: "center",
                                                }}
                                            >
                                                <Grid item xs={6} md={6} sm={6}>
                                                    <CardMedia
                                                        component="img"
                                                        style={{
                                                            padding: "10px",
                                                        }}
                                                        image={Algorithm}
                                                        alt="Live from space album cover"
                                                    />
                                                </Grid>
                                                <Grid item xs={6} sm={6} md={6}>
                                                    <CardContent
                                                        style={{
                                                            padding: "0px",
                                                        }}
                                                    >
                                                        <Typography
                                                            component="div"
                                                            variant="h6"
                                                            fontFamily="Open Sans"
                                                        >
                                                            <center>
                                                                Algorithms
                                                            </center>
                                                        </Typography>
                                                    </CardContent>
                                                </Grid>
                                            </Grid>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                container
                className={classes.readArticlesGrid}
                ref={articleRef}
            >
                <h1 style={{ marginLeft: "auto" }}>
                    Read, Remember & Register
                </h1>
                <Tabs />
            </Grid>

            <Grid
                container
                className={classes.codeEditorGrid}
                ref={codeEditorRef}
            >
                <h1 style={{ paddingBottom: "15px" }}>
                    Let's start with Coding...
                </h1>
                <Grid item xs={12} sm={12} md={12}>
                    <Codeeditor />
                </Grid>
            </Grid>

            <Footer />
        </div>
    );
};

export default Dashboard;
