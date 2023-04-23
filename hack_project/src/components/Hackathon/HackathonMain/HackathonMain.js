import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import {
    Paper,
    Grid,
    Divider,
    Button,
    Typography,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Container,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import NavBar from "../../navbar/NavBar";
import Footer from "../../footer/Footer";
import Formsectionheader from "../FormSectionHeader/FormSectionHeader";
import theme from "../../ui/Theme";
import axios from "axios";
import { AppContext } from "../../../AppContext";
import "./HackathonMain.scss";
import getIcon from "../../../static/Icons/getIcon";
import Carousel from "../../carousel/Carousel";


const useStyles = makeStyles((theme) => ({
    parent: {
        width: "100%",
    },
    innerGrid: {
        margin: "10px",
        padding: "20px",
    },
    carousel: {
        height: "400px",
        width: "100vw",
        backgroundColor: "#444",
    },
    card: {
        padding: "auto",
        width: "80px",
    },
    nestedGrid: {
        margin: "10px",
    },
    probStatementGridHeader: {},
    probStatDesc: {
        padding: "10px",
        overflowX: "auto",
        // wordWrap: "break-word"
    },
    probStatementGrid: {
        margin: "10px",
        padding: "10px 20px",
    },
    justifiedText: {
        textAlign: "justify",
        textJustify: "inner-word",
    },
}));

// const tempPrizes = [1, 2, 3];
// const tempProblemStatements = [1, 2, 3, 4];

const formatDate = (date, t) => {
    
     //let tempDate = new Date(date);
     //let tempDate = new Date("15-Mar-2023");
   
    let tempDate = date;
   
    //let tempDate = new Date(date.toString("dd-MMM-yyyy"));
    //let tempDate= new Date(date).toLocaleString();
    //let tempDate= new Date(date);
console.log('tempDate' +date)
    // if (t === 1) {
    //     tempDate.setDate(tempDate.getDate() - 1);
    //     return `${tempDate.getDate()}/${
    //         tempDate.getMonth() + 1
    //     }/${tempDate.getFullYear()}`;
    // } else if (t === 0) {
    //     return `${tempDate.getDate()}/${
    //         tempDate.getMonth() + 1
    //     }/${tempDate.getFullYear()}`;
    // }

    return `${tempDate}`;
    

};

const Hackathonmain = (props) => {
    const classes = useStyles();
    const [currentUser, setCurrentUser] = useState({});
    const [hackathon, setHackathon] = useState({});
    const [problemStatements, setProblemStatements] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [sliders, setSliders] = useState([]);
    const [registrationStatus, setRegistrationStatus] = useState(false);
    const [
        hackathonAllowParticipantStatus,
        setHackathonAllowParticipantStatus,
    ] = useState(true);
    const { setShowBanner } = useContext(AppContext);
    const [winners, setWinners] = useState(null);
    const [announcedWinners, setAnnouncedWinners] = useState(null);
    const [regStartStatus, setRegStartStatus] = useState(true);
    const history = useHistory();

    const handleAfterFormResponse = () => {
        setTimeout(() => {
            setShowBanner(null);
        }, 4000);
    };

    // const checkregistration = () => {
    //     axios
    //         .post(
    //             `http://localhost:4400/api/hackathon/get/checkregistration/${props.match.params.id}`,
    //             {
    //                 currentUser: currentUser,
    //             }
    //         )
    //         .then((responses) => {
    //             if (responses.data.message === "already registered") {
    //                 setRegistrationStatus(true);
    //                 console.log("Already registered", registrationStatus);
    //             } else {
    //                 setRegistrationStatus(false);
    //                 console.log("Not registered", registrationStatus);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log("Error registration check", err);
    //         });
    // };

    const handleParticipate = (e) => {
        e.preventDefault();
        console.log(props.match.params.id);
        console.log(currentUser.userType);
        try {
            // if (!currentUser) {
            //     setShowBanner({ apiErrorResponse: "You must be Signed In!" });
            //     return history.push("/auth/signin");
            // }

            if (localStorage.getItem("session")=== "organization") {
                return setShowBanner({
                    apiSuccessResponse:
                        "You can't register to a hackathon as an organization user! Kindly Sign In through student's account.",
                });
            }
            else{
                history.push(
                    `/auth/register/${props.match.params.id}`
                );
            }

            if (regStartStatus === false) {
                return setShowBanner({
                    apiErrorResponse:
                        "Registrations haven't started yet! Kindly verify start date.",
                });
            }
            if (hackathonAllowParticipantStatus === false) {
                return setShowBanner({
                    apiErrorResponse:
                        "Hackathon is already ended! Can't register now.",
                });
            }

            axios
                .post(
                    `http://localhost:4400/api/hackathon/register/${props.match.params.id}`,
                    {
                        currentUser: currentUser,
                    },
                    {
                        headers: {
                            authorization: localStorage.getItem("session"),
                        },
                    }
                )
                .then((responses) => {
                    if (
                        responses.data.register_user_db ===
                        "registered successfully"
                    ) {
                        setShowBanner({
                            apiSuccessResponse:
                                "You're successfully registered for the Hackathon",
                        });
                        console.log("PARAMS", props.match.params.id);
                        return history.push(
                            `/hackathon/submission/${props.match.params.id}`
                        );
                    }
                    console.log("Registration Request Data", responses.data);
                })
                .catch((err) => {
                    console.log("ERROR MESSAGE =", err.response?.data);
                    if (err.response?.data === "Not Authorized") {
                        setShowBanner({ apiErrorResponse: err.response?.data });
                        return history.push("/dashboard");
                    }
                    if (err.response?.data === "Not Authenticated") {
                        setShowBanner({ apiErrorResponse: err.response?.data });
                        return history.push("/auth/signin");
                    }
                    if (err.response?.data === "Already registered") {
                        return setShowBanner({
                            apiErrorResponse: err.response?.data,
                        });
                    }
                    if (err.response?.data === "Participant limit exceeded") {
                        return setShowBanner({
                            apiErrorResponse: err.response?.data,
                        });
                    } else {
                        // @WORKAROUND
                        /* This is just a WORKAROUND for the problem of Can't getting the response from the Backend
                        system. Remove this else part later on and handle the responses in the THEN block.
                    */
                        // setShowBanner({apiSuccessResponse: "You're successfully registered for the Hackathon"})
                        // history.push(`/hackathon/view/${props.match.params.id}`)
                    }

                    // return
                });
        } catch (err) {
            setShowBanner({
                apiErrorResponse: "Something went wrong! Please try again",
            });
        } finally {
            handleAfterFormResponse();
        }
    };

    useEffect(() => {
        try {
            axios
                   //.get(`http://localhost:3001/currentUserId/63ff8cefd32c0b12606fd9de`, {
                    //.get(`http://localhost:3001/currentUserId/${props.match.params.id}`, {
                        //.get(`http://localhost:3001/currentUserId/${localStorage.getItem('email')}`, {
                            .get(`http://localhost:3001/currentUserId/63ff8cefd32c0b12606fd9de`, {
                    headers: {
                        authorization: localStorage.getItem("session"),
                    },
                })
                .then((response) => {
                    console.log("Hack main user", response.data.data);
                    setCurrentUser(response.data.data);
                    // if (
                    //     !response.data.currentUser ||
                    //     response.data.currentUser === undefined ||
                    //     Object.keys(response.data.currentUser).length === 0
                    // ) {
                    //     setShowBanner({
                    //         apiErrorResponse: "You must be Signed In!",
                    //     });
                    //     return history.push("/auth/signin");
                    // }

                    // axios
                    //     .post(
                    //         `http://localhost:4400/api/hackathon/get/checkregistration/${props.match.params.id}`,
                    //         {
                    //             //currentUser: response.data.currentUser,
                    //             currentUser: response.data.data,
                    //         }
                    //     )
                    //     .then((responses) => {
                    //         if (
                    //             responses.data.message === "already registered"
                    //         ) {
                    //             setRegistrationStatus(true);
                    //             console.log(
                    //                 "Already registered",
                    //                 registrationStatus
                    //             );
                    //         } else {
                    //             setRegistrationStatus(false);
                    //             console.log(
                    //                 "Not registered",
                    //                 registrationStatus
                    //             );
                    //         }

                            axios
                                .get(
                                    //`http://localhost:4400/api/hackathon/get/id/${props.match.params.id}`,
                                    //`http://localhost:3001/getOrgUser/64149e899aec0c0dd064a883`,
                                    `http://localhost:3001/getOrgUser/${props.match.params.id}`,
                                    {
                                        body: {},
                                        headers: {
                                            authorization:
                                                localStorage.getItem("session"),
                                        },
                                    }
                                )
                                .then((responses) => {
                                    console.log("Got Hackathon", responses);
                                    console.log("problemStatements", responses.data.data.problemStatements)
                                    console.log("sponsors", responses.data.data.sponsors)
                                    console.log("sliders", responses.data.data.sliders)
                                    setHackathon(
                                        // responses.data.get_hackathon_db
                                        //     .hackathon
                                        responses.data.data
                                    );
                                    setProblemStatements(
                                        // responses.data.get_problem_statements_db
                                        //     .problemStatements
                                        responses.data.data.problemStatements
                                    );
                                    setSponsors(
                                        //responses.data.get_sponsors_db.sponsors
                                        responses.data.data.sponsors
                                    );
                                    setSliders(
                                        //responses.data.get_sliders_db.sliders
                                        responses.data.data.sliders
                                    );
                                    setShowBanner({
                                        apiSuccessResponse:
                                            "Loading Hackathon...",
                                    });

                                    let tempHackathon =responses.data.data;
                                        // responses.data.get_hackathon_db
                                        //     .hackathon;

                                        
                                        console.log("responses.data.data", responses.data.data);
                                    // Setting the Participate Hackathon Button in disable state if HackEnd date is gone
                                    // let currentDate = new Date();
                                    // let regEndDate = new Date(
                                    //     tempHackathon.regEnd
                                    // );
                                    // let regStartDate = new Date(
                                    //     tempHackathon.regStart
                                    // );
                                    // let hackEndDate = new Date(
                                    //     tempHackathon.hackEnd
                                    // );
                                    // if (
                                    //     currentDate.toISOString() <
                                    //     regStartDate.toISOString()
                                    // ) {
                                    //     console.log(
                                    //         "Reg start status to false"
                                    //     );
                                    //     setRegStartStatus(false);
                                    // }

                                    // if (
                                    //     currentDate.toISOString() >=
                                    //     regEndDate.toISOString()
                                    // ) {
                                    //     console.log(
                                    //         "Val Dates",
                                    //         currentDate.toISOString(),
                                    //         regEndDate.toISOString()
                                    //     );
                                    //     console.log(
                                    //         "Setting ALlow Status",
                                    //         false
                                    //     );
                                    //     setHackathonAllowParticipantStatus(
                                    //         false
                                    //     );
                                    // }

                                    // if (currentDate > hackEndDate) {
                                        // console.log("Hackathon Ended");
                                        axios
                                            .get(
                                                //`http://localhost:4400/api/hackathon/get/winners/${props.match.params.id}`
                                                //`http://localhost:3001/Getwinners/${props.match.params.id}`
                                                //`http://localhost:3001/Getwinners/64185f721a9c6b1c28d77f46`
                                                //`http://localhost:3001/Getwinners/64185f721a9c6b1c28d77f46`
                                                //`http://localhost:3001/getWinnersid/64185f721a9c6b1c28d77f46`
                                                //`http://localhost:3001/getWinnersid/${props.match.params.id}`
                                                //`http://localhost:3001/getWinnersCompanyId/${props.match.params.id}`
                                                `http://localhost:3001/getWinnerspricecompany/${props.match.params.id}`
                                            )
                                            .then((winnerResp) => {
                                                setWinners(
                                                    //winnerResp.data.data
                                                    //winnerResp.data.winnersid
                                                    winnerResp.data.addwinners
                                                );
                                                console.log(
                                                    "Got Winners",
                                                    //winnerResp.data.data
                                                    //winnerResp.data.winnersid
                                                    winnerResp.data.addwinners
                                                );
                                                if (
                                                    winnerResp.data.addwinners
                                                        .length !== 0
                                                ) {
                                                    console.log(
                                                        "SEtting winners"
                                                    );
                                                    setAnnouncedWinners(true);
                                                } else {
                                                    setAnnouncedWinners(false);
                                                }
                                            })
                                            .catch((err) => {
                                                console.log(
                                                    "Error getting winners"
                                                );
                                            });
                                    // } else {
                                    //     setWinners([]);
                                    //     console.log(
                                    //         "Not setting winners",
                                    //         currentDate,
                                    //         hackEndDate
                                    //     );
                                    //     setAnnouncedWinners(false);
                                    // }
                                })
                                .catch((err) => {
                                    console.log(
                                        "Error fetching hackathon",
                                        err
                                    );
                                    // setShowBanner({apiErrorResponse: err.response?.data})
                                    // if (
                                    //     err.response?.data ===
                                    //     "Hackathon doesn't exists!"
                                    // ) {
                                    //     setShowBanner({
                                    //         apiErrorResponse:
                                    //             err.response?.data,
                                    //     });
                                    //     return history.push("/dashboard");
                                    // }

                                    // if (err.response?.data === "Invalid user") {
                                    //     return history.push("/auth/signin");
                                    // } else {
                                    //     console.log(
                                    //         "Error connecting to Server!"
                                    //     );
                                    // }
                                });
                        })
                        .catch((err) => {
                            console.log("Error registration check", err);
                        });
                // })
                // .catch((err) => {
                //     console.log("Error in Hack Main Current User", err);
                // });
        } catch (err) {
        } finally {
            handleAfterFormResponse();
        }
    }, []);

    const handleNavToSummaryPage = () => {
        return history.push(`/hackathon/submission/summary/${hackathon.id}`)
    }

    return (
        // announcedWinners != null &&
        // winners != null && (
            <div className={classes.parent}>
                <NavBar location="dashboard" />

                {/* Parent Container */}
                    <Grid container>
                        {/* Carousel */}
                        {/* <Grid item xs={12} sm={12} md={12}>
                            <Carousel
                                sliders={sliders}
                                defaultSliders={false}
                            />
                        </Grid> */}

                        {/* Top Grid - Dates */}
                        
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            className={classes.innerGrid}
                        >
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12}>
                                    <center>
                                        <Typography
                                            variant="h5"
                                            fontFamily="Open Sans"
                                            color={
                                                theme.palette.common.orangeColor
                                            }
                                        >
                                            <strong>Registration</strong>
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="Open Sans"
                                            color={
                                                theme.palette.common.darkGreen
                                            }
                                        >
                                            Starts at
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="Open Sans"
                                            color={
                                                theme.palette.common.darkGreen
                                            }
                                        >
                                            Ends at
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="h5"
                                            fontFamily="Open Sans"
                                        >
                                            <b>
                                                {formatDate(
                                                    hackathon.regStart,
                                                    0
                                                )}
                                            </b>
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="h5"
                                            fontFamily="Open Sans"
                                        >
                                            <b>
                                                {formatDate(
                                                    hackathon.regEnd,
                                                    1
                                                )}
                                            </b>
                                        </Typography>
                                    </center>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            className={classes.innerGrid}
                        >
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12}>
                                    <center>
                                        <Typography
                                            variant="h5"
                                            fontFamily="Open Sans"
                                            color={
                                                theme.palette.common.orangeColor
                                            }
                                        >
                                            <strong>Hackathon</strong>
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="Open Sans"
                                            color={
                                                theme.palette.common.darkGreen
                                            }
                                        >
                                            Starts at
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="Open Sans"
                                            color={
                                                theme.palette.common.darkGreen
                                            }
                                        >
                                            Ends at
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="h5"
                                            fontFamily="Open Sans"
                                        >
                                            <b>
                                                {formatDate(
                                                    hackathon.hackStart,
                                                    0
                                                )}
                                            </b>
                                        </Typography>
                                    </center>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6}>
                                    <center>
                                        <Typography
                                            variant="h5"
                                            fontFamily="Open Sans"
                                        >
                                            <b>
                                                {formatDate(
                                                    hackathon.hackEnd,
                                                    1
                                                )}
                                            </b>
                                        </Typography>
                                    </center>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={4}
                            className={classes.innerGrid}
                        >
                            <center>
                                {/* <div component="div">
                                    <Typography
                                        variant="h6"
                                        fontFamily="Open Sans"
                                    >
                                        Participants Count:{" "}
                                        {hackathon.participantCount}
                                    </Typography>
                                </div> */}
                                
                                {currentUser.email === hackathon.organiserEmail ? (
                                    <Button 
                                        variant="contained"
                                        style={{ marginTop: "20px" }}
                                        size="large"
                                        onClick={handleNavToSummaryPage}
                                    >
                                        View Summary OR Announce Winners
                                    </Button>
                                ) : (
                                    registrationStatus ? (
                                        <Button
                                            variant="contained"
                                            style={{ marginTop: "20px" }}
                                            size="large"
                                            onClick={() => {
                                                history.push(
                                                    `/hackathon/submission/${props.match.params.id}`
                                                );
                                            }}
                                        >
                                            {/* View Hackathon */}

                                            Participate Now
                                        </Button>
                                    ) :    (
                                        <Button
                                            variant="contained"
                                            style={{ marginTop: "20px" }}
                                            size="large"
                                            onClick={handleParticipate}
                                        >
                                            Participate Now
                                        </Button>                    

                                    )
                                    
                                )
                                }
                            </center>
                        </Grid>

                        {/* Description Title Section */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sm={4}
                            className={classes.innerGrid}
                        > 
                            <Formsectionheader name="Description" />
                        </Grid>

                        {/* Description Texts */}
                        <Grid
                            item
                            xs={12}
                            md={12}
                            sm={12}
                            className={classes.innerGrid}
                        >
                            <Typography
                                variant="h6"
                                fontFamily="Open Sans"
                                className={classes.justifiedText}
                            >
                                {hackathon.hackDescription}
                            </Typography>
                        </Grid>

                        {/* Winning Prizes Title Section */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sm={4}
                            className={classes.innerGrid}
                        >
                            <Formsectionheader
                                name={
                                    announcedWinners
                                        ? "Hackathon Winners"
                                        : "Winning Prizes"
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}></Grid>

                        {/* Winning Prizes Details */}
                        <Container>
                            <Grid container>
                                {[
                                    "firstPrizeDesc",
                                    
                                ].map((tempPrize) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        className={classes.innerGrid}
                                        key={tempPrize}
                                    >
                                        <Card>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="div"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "200px",
                                                        display: "flex",
                                                    }}
                                                    alt="Hackathon Image"
                                                >
                                                    <img
                                                        src={getIcon(tempPrize)}
                                                        maxheight="100%"
                                                        alt="Icon"
                                                    />
                                                </CardMedia>
                                                <CardContent
                                                    style={{
                                                        paddingTop: "0px",
                                                        paddingBottom: "0px",
                                                    }}
                                                >
                                                    {announcedWinners && (
                                                        <Typography
                                                            variant="h5"
                                                            fontFamily="Open Sans"
                                                            style={{
                                                                color: theme
                                                                    .palette
                                                                    .common
                                                                    .orangeColor,
                                                            }}
                                                            fontWeight="bold"
                                                        >
                                                            <center>
                                                                {
                                                                    //console.log('winners.addwinners[]',winners[0])
                                                                    //winners.addwinners
                                                                    winners[0].firstPrize
                                                                }
                                                                
                                                            </center>

                                                        </Typography>
                                                    )}
                                                    <Typography
                                                        variant="h6"
                                                        fontFamily="Open Sans"
                                                    >
                                                        <ul>
                                                            {hackathon[
                                                                tempPrize
                                                            ]
                                                                ?.split(", ")
                                                                .map(
                                                                    (prize) => (
                                                                        <li key={prize}>
                                                                            {
                                                                                prize
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                           
                                {[
                                   
                                    "secondPrizeDesc",
                                    
                                ].map((tempPrize) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        className={classes.innerGrid}
                                        key={tempPrize}
                                    >
                                        <Card>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="div"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "200px",
                                                        display: "flex",
                                                    }}
                                                    alt="Hackathon Image"
                                                >
                                                    <img
                                                        src={getIcon(tempPrize)}
                                                        maxheight="100%"
                                                        alt="Icon"
                                                    />
                                                </CardMedia>
                                                <CardContent
                                                    style={{
                                                        paddingTop: "0px",
                                                        paddingBottom: "0px",
                                                    }}
                                                >
                                                    {announcedWinners && (
                                                        <Typography
                                                            variant="h5"
                                                            fontFamily="Open Sans"
                                                            style={{
                                                                color: theme
                                                                    .palette
                                                                    .common
                                                                    .orangeColor,
                                                            }}
                                                            fontWeight="bold"
                                                        >
                                                            <center>
                                                                {
                                                                    //console.log('winners.addwinners[]',winners[0])
                                                                    //winners.addwinners
                                                                    winners[0].secondPrize
                                                                }
                                                                
                                                            </center>

                                                        </Typography>
                                                    )}
                                                    <Typography
                                                        variant="h6"
                                                        fontFamily="Open Sans"
                                                    >
                                                        <ul>
                                                            {hackathon[
                                                                tempPrize
                                                            ]
                                                                ?.split(", ")
                                                                .map(
                                                                    (prize) => (
                                                                        <li key={prize}>
                                                                            {
                                                                                prize
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                       
                                {[
                                    
                                    "thirdPrizeDesc",
                                ].map((tempPrize) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        className={classes.innerGrid}
                                        key={tempPrize}
                                    >
                                        <Card>
                                            <CardActionArea>
                                                <CardMedia
                                                    component="div"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "200px",
                                                        display: "flex",
                                                    }}
                                                    alt="Hackathon Image"
                                                >
                                                    <img
                                                        src={getIcon(tempPrize)}
                                                        maxheight="100%"
                                                        alt="Icon"
                                                    />
                                                </CardMedia>
                                                <CardContent
                                                    style={{
                                                        paddingTop: "0px",
                                                        paddingBottom: "0px",
                                                    }}
                                                >
                                                    {announcedWinners && (
                                                        <Typography
                                                            variant="h5"
                                                            fontFamily="Open Sans"
                                                            style={{
                                                                color: theme
                                                                    .palette
                                                                    .common
                                                                    .orangeColor,
                                                            }}
                                                            fontWeight="bold"
                                                        >
                                                            <center>
                                                                {
                                                                    //console.log('winners.addwinners[]',winners[0])
                                                                    //winners.addwinners
                                                                    winners[0].thirdPrize
                                                                }
                                                                
                                                            </center>

                                                        </Typography>
                                                    )}
                                                    <Typography
                                                        variant="h6"
                                                        fontFamily="Open Sans"
                                                    >
                                                        <ul>
                                                            {hackathon[
                                                                tempPrize
                                                            ]
                                                                ?.split(", ")
                                                                .map(
                                                                    (prize) => (
                                                                        <li key={prize}>
                                                                            {
                                                                                prize
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                        </ul>
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
                        {/* Problem Statements Title Section */}
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sm={4}
                            className={classes.innerGrid}
                        >
                            <Formsectionheader name="Problem Statements" />
                        </Grid>

                        {/* Problem Statements Details */}
                        <Grid
                            item
                            xs={12}
                            md={12}
                            sm={12}
                            className={classes.probStatementGrid}
                        >
                            <Paper
                                elevation={10}
                                style={{
                                    backgroundColor:
                                        theme.palette.common.orangeColor,
                                    border: "2px solid",
                                    borderColor: theme.palette.secondary.main,
                                }}
                            >
                                <Grid container>
                                    <Grid
                                        item
                                        xs={6}
                                        md={1.3}
                                        sm={6}
                                        className={classes.probStatDesc}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="inherit"
                                            color="white"
                                        >
                                            <strong>ID</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        md={0.3}
                                        className={classes.probStatDesc}
                                    >
                                        <Divider orientation="vertical" />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={2.5}
                                        sm={6}
                                        className={classes.probStatDesc}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="inherit"
                                            color="white"
                                        >
                                            <strong>Title</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        md={0.3}
                                        className={classes.probStatDesc}
                                    >
                                        <Divider orientation="vertical" />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={4}
                                        sm={6}
                                        className={classes.probStatDesc}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="inherit"
                                            color="white"
                                        >
                                            <strong>Description</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        md={0.3}
                                        className={classes.probStatDesc}
                                    >
                                        <Divider orientation="vertical" />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={1}
                                        sm={6}
                                        className={classes.probStatDesc}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="inherit"
                                            color="white"
                                        >
                                            <strong>Solution Type</strong>
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        md={0.3}
                                        className={classes.probStatDesc}
                                    >
                                        <Divider orientation="vertical" />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                        md={2}
                                        sm={6}
                                        className={classes.probStatDesc}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontFamily="inherit"
                                            color="white"
                                        >
                                            <strong>Technologies</strong>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Problem Statements Details */}
                        {problemStatements.map((problemStatement) => (
                            <Grid
                                item
                                xs={12}
                                md={12}
                                sm={12}
                                className={classes.probStatementGrid}
                                key={problemStatement.id}
                            >
                                <Paper
                                    elevation={5}
                                    style={{
                                        border: "1px solid",
                                        borderColor: theme.palette.primary.main,
                                    }}
                                >
                                    <Grid
                                        container
                                        className={classes.justifiedText}
                                    >
                                        <Grid
                                            item
                                            xs={6}
                                            md={1.3}
                                            sm={6}
                                            className={classes.probStatDesc}
                                        >
                                            {problemStatement.problemstatementid}
                                        </Grid>
                                        <Grid
                                            item
                                            md={0.3}
                                            className={classes.probStatDesc}
                                        >
                                            <Divider orientation="vertical" />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            md={2.5}
                                            sm={6}
                                            className={classes.probStatDesc}
                                        >
                                            {problemStatement.probTitle}
                                        </Grid>
                                        <Grid
                                            item
                                            md={0.3}
                                            className={classes.probStatDesc}
                                        >
                                            <Divider orientation="vertical" />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            md={4}
                                            sm={6}
                                            className={classes.probStatDesc}
                                        >
                                            {problemStatement.probDescription}
                                        </Grid>
                                        <Grid
                                            item
                                            md={0.3}
                                            className={classes.probStatDesc}
                                        >
                                            <Divider orientation="vertical" />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            md={1}
                                            sm={6}
                                            className={classes.probStatDesc}
                                        >
                                            {problemStatement.probSolutionType}
                                        </Grid>
                                        <Grid
                                            item
                                            md={0.3}
                                            className={classes.probStatDesc}
                                        >
                                            <Divider orientation="vertical" />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            md={2}
                                            sm={6}
                                            className={classes.probStatDesc}
                                        >
                                            {problemStatement.probAcceptedTechs}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}

                        {/* Sponsors Title Section */}
                        {/* <Grid
                            item
                            xs={12}
                            md={3}
                            sm={4}
                            className={classes.innerGrid}
                        >
                            <Formsectionheader name="Sponsors" />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12}></Grid> */}

                        {/* Sponsors Details */}
                        {sponsors.map((sponsor) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                className={classes.innerGrid}
                                key={sponsor.webLink}
                            >
                                <a
                                    key={sponsor}
                                    href={sponsor.webLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        src={sponsor.imageLink}
                                        height={150}
                                        width="90%"
                                        style={{
                                            borderRadius: "2%",
                                            boxShadow: "5px 5px 10px #ccc",
                                            padding: "5px",
                                        }}
                                        alt="Sponsor"
                                    />
                                </a>
                            </Grid>
                        ))}
                    </Grid>

                <Footer />
            </div>
        )
    //);
};

export default Hackathonmain;
