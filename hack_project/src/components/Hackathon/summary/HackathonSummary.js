import {
    Grid,
    Typography,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Box,
    Paper,
    TextField,
    Icon,
    Divider,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import Footer from "../../footer/Footer";
import NavBar from "../../navbar/NavBar";
import Formsectionheader from "../FormSectionHeader/FormSectionHeader";
import { makeStyles } from "@material-ui/core";
import firstPrize from "../../../static/Icons/firstPrize.svg";
import secondPrize from "../../../static/Icons/secondPrize.svg";
import thirdPrize from "../../../static/Icons/thirdPrize.svg";
import axios from "axios";
import { AppContext } from "../../../AppContext";
import theme from "../../ui/Theme";
import useTable from "../../table/useTable";
import Carousel from "../../carousel/Carousel";

const useStyles = makeStyles((theme) => ({
    parent: {
        width: "100%",
    },
    carousel: {
        backgroundColor: "#D3D3D3",
        width: "100%",
        height: "60vh",
    },
    nestedGrid: {
        padding: "100px",
    },
    innerGrid: {
        padding: "10px 20px",
    },
    tableHeader: {
        padding: "0 20px",
    },
    tableHeaderCell: {
        padding: "50px",
    },
    tableCellInner: {
        padding: "10px",
        overflow: "auto",
    },
}));

// const subdetail = [
//     { id: "userEmail", label: "userEmail" },
//     { id: "fullName", label: "Full Name" },
//     { id: "userName", label: "Username" },
//     { id: "filePath", label: "filePath" },
//     { id: "timeStamp", label: "Timestamp" },
// ];

const defaultWinners = {
    firstPrize: "",
    secondPrize: "",
    thirdPrize: "",
};

const Hackathonsummary = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState({});
    const [hackathon, setHackathon] = useState({});
    const [problemStatements, setProblemStatements] = useState([]);
    const [sliders, setSliders] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [currentProblemStatement, setCurrentProblemStatement] = useState("");
    const [submittedUsers, setSubmittedUsers] = useState(null);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    const [winnersInput, setWinnersInput] = useState(defaultWinners);
    const [hasWinners, setHasWinners] = useState(null);

    // const { TblContainer, TblHead, TblPagination } = useTable(
    //     submissions,
    //     tableHeadCells
    // );

    const [
        selectedProblemStatementSubmissions,
        setSelectedProblemStatementSubmissions,
    ] = useState([]);

    const { setShowBanner } = useContext(AppContext);

    const handleAfterFormResponse = () => {
        setTimeout(() => {
            setShowBanner(null);
        }, 4000);
    };

    const handleSelectChange = (e) => {
         setCurrentProblemStatement(e.target.value);
        // setSelectedProblemStatementSubmissions(
        //     //submissions.filter((sub) => sub.problemStatID === e.target.value)
        //     submissions.filter((sub) => sub.problemStatementID === e.target.value)
        // );
          //filterSubmissionsOnChange(e.target.value);
          
    };



    const handleParticipate = (e) => {
        e.preventDefault();
        try {
        
            if (localStorage.getItem("session") === "developer") {
                return setShowBanner({
                    apiSuccessResponse:
                        "You can't announce  a hackathon winners as an student user! Kindly Sign In through organize's account.",
                });
            }
            else{
                history.push(
                    // `/auth/register/${props.match.params.id}`
                    `/hackathon/view/${props.match.params.id}`
                );
            }
        }
        catch (err) {
            setShowBanner({
                apiErrorResponse: "Something went wrong! Please try again",
            });
        } finally {
            // handleAfterFormResponse();
        };
}


    const getUserFromLocal = (email) => {
        return submittedUsers.filter((user) => email === user.email);
    };

    const filterSubmissionsOnChange = (probID) => {
        //return filteredSubmissions.filter((sub) => sub.problemStatID === probID);
        //return filteredSubmissions.filter((sub) => sub.problemStatementID === probID);
        console.log('filterSubmissionsOnChange'+ probID);
        //return filteredSubmissions.filter((sub) => sub.problemStatementID === probID);
    };

    const handleWinnersChange = (e) => {
        let { name, value } = e.target;
        if (hasWinners) {
            setShowBanner({
                apiErrorResponse: "Can't change winners once announced!",
            });
            setTimeout(() => {
                setShowBanner(null);
            }, 3000);
        } else {
            setWinnersInput({
                ...winnersInput,
                [name]: value,
            });
        }

        if (localStorage.getItem("session") === "developer") {
            return setShowBanner({
                apiSuccessResponse:
                    "You can't announce  a hackathon winners as an student user! Kindly Sign In through organize's account.",
            });
        }
        // else{
        //     history.push(
        //         // `/auth/register/${props.match.params.id}`
        //         `/hackathon/view/${props.match.params.id}`
        //     );
        // }
    };

    const changeDefaultWinners = (winners) => {
        winners.map((winner) => {
            defaultWinners[winner.prize] = winner.userName;
        });
    };

    const announceWinnersHandler = (e) => {
        e.preventDefault();
        try {
            // let { firstPrize, secondPrize, thirdPrize } = winnersInput;
            console.log("Winners", winnersInput);
            axios
                //.post(`http://localhost:4400/api/hackathon/announce/winners`, {
                    .post(`http://localhost:3001/addwinners`, {
                    //winnersInput,
                    firstPrize: winnersInput.firstPrize,
                    secondPrize: winnersInput.secondPrize,
                    thirdPrize: winnersInput.thirdPrize,
                    companyid: hackathon._id,
                    userid: props.match.params.id,
                })
                .then((resp) => {
                    console.log("Winners Resp", resp);  
                    if (resp.data.success === true) {
                        return setShowBanner({
                            apiSuccessResponse:
                                "Winners added Successfully! 🤩👨‍🎓",
                        });
                    }
                    //const a = `/hackathon/view/${resp.data.data._id}`
                    const a = `/hackathon/view/${props.match.params.id}`
                   return history.push(a);
                })
                .catch((err) => {
                    console.log("Errors WInner upload", err.response?.data);
                });
        } catch (err) { 
        } finally {
            handleAfterFormResponse();
        }
    };

    useEffect(() => {
        try {
            axios
            .get(`http://localhost:3001/currentUserId/640acda3dfadd13afcd879cf`, {
                    headers: {
                        authorization: localStorage.getItem("session"),
                    },
                })
                .then((responses) => {
                    setCurrentUser(responses.data.currentUser);
                    // if (
                    //     !responses.data.currentUser ||
                    //     responses.data.currentUser === undefined ||
                    //     Object.keys(responses.data.currentUser).length === 0
                    // ) {
                    //     setShowBanner({
                    //         apiErrorResponse: "You must be signed in!",
                    //     });
                    //     return history.push("/auth/signin");
                    // }

                    // if (responses.data.data.userType === "developer") {
                    //     setShowBanner({
                    //         apiSuccessResponse: "You're not authorized!",
                    //     });
                    //     return history.push(
                    //         `/hackathon/view/${props.match.params.id}`
                    //     );
                    // }

                    axios
                        .get(
                           // `http://localhost:4400/api/hackathon/get/id/${props.match.params.id}`,
                           //`http://localhost:3001/getOrgUser/6402d8bfa201cd41f8962abd`,
                           `http://localhost:3001/getOrgUser/${props.match.params.id}`,
                            {
                                body: {},
                                headers: {
                                    authorization:
                                        localStorage.getItem("session"),
                                },
                            }
                        )
                        .then((hackResp) => {
                            setHackathon(
                                //hackResp.data.get_hackathon_db.hackathon
                                hackResp.data.data
                            );
                            setProblemStatements(
                                // hackResp.data.get_problem_statements_db
                                //     .problemStatements

                                hackResp.data.data.problemStatements
                            );
                            //setSliders(hackResp.data.get_sliders_db.sliders);
                            
                            console.log("Hackathon Resp", hackResp)
                            setShowBanner({
                                apiSuccessResponse: "Loading Hackathon...",
                            });

                            axios
                                .get(
                                   // `http://localhost:4400/api/hackathon/get/submissions/${props.match.params.id}`,
                                   //`http://localhost:3001/GetSubmission`,
                                //    `http://localhost:3001/GetSubmissionByCompanyId/${props.match.params.id}`,
                                //    `http://localhost:3001/GetSubmissionByCompanyId/companyid`,
                                    `http://localhost:3001/GetSubmissionByhackathonID/${props.match.params.id}`,
                                    {
                                        headers: {
                                            authorization:
                                                localStorage.getItem("session"),
                                        },
                                    }
                                )
                                .then((subResp) => {
                                    console.log("Got submissions", subResp);
                                    console.log("Got submissions", subResp.data.subdetail);
                                    //setSubmissions(subResp.data.submissions);
                                    setSubmissions(subResp.data.subdetail);
                                    //setSubmittedUsers(subResp.data.users);
                                    setFilteredSubmissions(
                                        //subResp.data.submissions
                                        // subResp.data.subdetail
                                        //filteredSubmissions()
                                        subResp.data.subdetail
                                    );
                                    console.log("Got filersubmission",  subResp.data.subdetail);
                                    // axios
                                    //     .get(
                                    //         `http://localhost:4400/api/hackathon/get/winners/${props.match.params.id}`
                                    //     )
                                    //     .then((winnerResp) => {
                                    //         console.log(
                                    //             "Got Winners",
                                    //             winnerResp
                                    //         );
                                    //         if (
                                    //             winnerResp.data.data.length !== 0
                                    //         ) {
                                    //             setHasWinners(true);
                                    //             changeDefaultWinners(
                                    //                 winnerResp.data.data
                                    //             );
                                    //         } else {
                                    //             setHasWinners(false);
                                    //         }
                                    //     })
                                    //     .catch((err) => {
                                    //         console.log(
                                    //             "Error getting winners",
                                    //             err.response?.data
                                    //         );
                                    //         setShowBanner({
                                    //             apiErrorResponse:
                                    //                 "Can't fetch winners!",
                                    //         });
                                    //     });
                                })
                                .catch((err) => {
                                    return console.log(
                                        "Error getting submissions",
                                        err
                                    );
                                });
                        })
                        .catch((err) => {
                            console.log("Summary Catch", err);
                            if (
                                err.response?.data ===
                                "Hackathon doesn't exists!"
                            ) {
                                setShowBanner({
                                    apiErrorResponse: err.response?.data,
                                });
                                return history.push("/dashboard");
                            }

                            if (err.response?.data === "Invalid user") {
                                return history.push("/auth/login");
                            } else {
                                console.log("Error connecting to Server!");
                            }
                        });
                });
        } catch (err) {
        } finally {
            handleAfterFormResponse();
        }
    }, []);

    return (
        // submittedUsers &&
        // submissions &&
        // filteredSubmissions &&
        // hasWinners != null && (
            <div>
                    <NavBar location="dashboard" />

                    {/* Body Container Grid */}
                    <Grid container>
                        {/* Top Carousel */}
                        {/* <Carousel sliders={sliders} /> */}

                        {/* Submission Status Title */}
                        <Grid item xs={12} md={12} sm={12} />
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sm={4}
                            className={classes.innerGrid}
                        >
                            <Formsectionheader name="Submissions Status" />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12} />

                        {/* Submission Status Details */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            className={classes.innerGrid}
                        >
                            {/* <Typography variant="h6">
                                <strong>
                                    Total Submissions:{" "}
                                    {submissions && submissions.length}/
                                    {hackathon.maxParticipants}
                                </strong>
                            </Typography> */}
                        </Grid>

                        {/* Problem Statement DropDown */}
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            className={classes.innerGrid}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Problem Statements
                                </InputLabel>
                                <Select
                                    id="demo-simple-select"
                                    label="probStateSummary"
                                    value={currentProblemStatement}
                                    onChange={handleSelectChange}
                                >
                                    {problemStatements.map((probState) => (
                                        <MenuItem
                                            value={probState.problemstatementid}
                                            key={probState.problemstatementid}
                                            name={probState.problemstatementid}
                                        >
                                            {probState.probTitle}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            className={classes.innerGrid}
                        >
                            {/* Problem Statement Specific Submission */}

                            <Typography variant="subtitle1">
                                <strong>
                                    {currentProblemStatement ? (
                                        <>
                                            {/* Problem Statement Submissions:{" "} */}
                                            {/* {
                                                selectedProblemStatementSubmissions.length
                                            } */}
                                        </>
                                    ) : (
                                        "Please select Problem Statement"
                                    )}
                                </strong>
                            </Typography>
                        </Grid>

                        {/* Submission Table */}
                       

        



                            


                        <Box
                            component="div"
                            style={{ maxHeight: "80vh", overflow: "auto" }}
                        >
                            {/* Validating if User has selected any current problem statement */}

                            
                            {currentProblemStatement && filteredSubmissions.length !== 0 ? (
                                <>
                                    {/* Table Header */}
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        className={classes.innerGrid}
                                    >
                                        <Paper
                                            elevation={10}
                                            style={{
                                                backgroundColor:
                                                    theme.palette.common
                                                        .orangeColor,
                                                border: "2px solid",
                                                borderColor:
                                                    theme.palette.secondary
                                                        .main,
                                                padding: "5px 10px",
                                            }}
                                        >
                                            <Grid
                                                container
                                            >
                                                <Grid
                                                    item
                                                    xs={6}
                                                    md={2}
                                                    sm={6}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontFamily="inherit"
                                                        color="white"
                                                    >
                                                        <strong>Email</strong>
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    md={0.3}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    {/* <Divider orientation="vertical" /> */}
                                                </Grid>
                                                {/* <Grid
                                                    item
                                                    xs={6}
                                                    md={1}
                                                    sm={6}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontFamily="inherit"
                                                        color="white"
                                                    >
                                                        <strong>
                                                            Full Name
                                                        </strong>
                                                    </Typography>
                                                </Grid> */}
                                                <Grid
                                                    item
                                                    md={0.3}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Divider orientation="vertical" />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    md={2}
                                                    sm={6}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontFamily="inherit"
                                                        color="white"
                                                    >
                                                        <strong>
                                                            Username
                                                        </strong>
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    md={0.3}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Divider orientation="vertical" />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    md={4}
                                                    sm={6}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontFamily="inherit"
                                                        color="white"
                                                    >
                                                        <strong>
                                                            Submission Link
                                                        </strong>
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    md={0.3}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Divider orientation="vertical" />
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={6}
                                                    md={2}
                                                    sm={6}
                                                    className={
                                                        classes.tableCellInner
                                                    }
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontFamily="inherit"
                                                        color="white"
                                                    >
                                                        <strong>
                                                            Timestamp
                                                        </strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Table Body */}
                                    {/* {filteredSubmissions.map((submission) => ( */}

                                    {(filteredSubmissions).map((submission) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            className={classes.innerGrid}
                                            key={submission._id}
                                        >
                                            <Paper
                                                elevation={10}
                                                style={{
                                                    border: "1px solid",
                                                    borderColor:
                                                        theme.palette.primary
                                                            .main,
                                                    padding: "5px 10px",
                                                }}
                                            >
                                                <Grid
                                                    container
                                                >
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        md={2}
                                                        sm={6}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            fontFamily="inherit"
                                                        >
                                                            {
                                                                submission.userEmail
                                                            }
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={0.3}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Divider orientation="vertical" />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        md={2}
                                                        sm={6}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            fontFamily="inherit"
                                                        >
                                                            {/* {
                                                                getUserFromLocal(
                                                                    submission.userEmail
                                                                )[0].fullName
                                                            } */}
                                                            {
                                                                submission.userEmail
                                                            }
                                                        </Typography>
                                                    </Grid>
                                                    {/* <Grid
                                                        item
                                                        md={0.3}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Divider orientation="vertical" />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        md={1}
                                                        sm={6}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            fontFamily="inherit"
                                                        > */}
                                                            {/* {
                                                                
                                                                getUserFromLocal(
                                                                    submission.userEmail
                                                                )[0].username
                                                            } */}
                                                            {/* {
                                                                submission.userEmail
                                                            }
                                                        </Typography>
                                                    </Grid> */}
                                                    <Grid
                                                        item
                                                        md={0.3}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Divider orientation="vertical" />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        md={4}
                                                        sm={6}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            fontFamily="inherit"
                                                        >
                                                            <a
                                                                href={
                                                                    submission.filePath
                                                                }
                                                            >
                                                                {
                                                                    submission.filePath
                                                                }
                                                            </a>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        md={0.3}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Divider orientation="vertical" />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={6}
                                                        md={2}
                                                        sm={6}
                                                        className={
                                                            classes.tableCellInner
                                                        }
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            fontFamily="inherit"
                                                        >
                                                            {
                                                                submission.createdAt
                                                            }
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </>
                            ) : (
                                <></>
                                
                            )}
                        </Box>











                        {/* Add Winners Title */}
                        <Grid item xs={12} md={12} sm={12} />
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sm={4}
                            className={classes.innerGrid}
                        >
                            <Formsectionheader name="Add Winners" />
                        </Grid>
                        <Grid item xs={12} md={12} sm={12} />

                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            className={classes.innerGrid}
                        >
                            <Paper
                                className={classes.formPaper}
                                style={{ padding: "20px 0" }}
                            >
                                <form onSubmit={announceWinnersHandler}>
                                    <Grid container>
                                        {/* 1st Row */}
                                        <Grid item xs={3} sm={3} md={3}></Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={6}
                                            className={classes.innerGrid}
                                        >
                                            <TextField
                                                label="1st Prize - Username"
                                                name="firstPrize"
                                                type="text"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <Icon
                                                            classes={{
                                                                root: classes.iconRoot,
                                                            }}
                                                        >
                                                            <img
                                                                className={
                                                                    classes.imageIcon
                                                                }
                                                                src={firstPrize}
                                                                alt="1st"
                                                            />
                                                        </Icon>
                                                    ),
                                                }}
                                                onChange={handleWinnersChange}
                                                value={winnersInput.firstPrize}
                                            />
                                        </Grid>
                                        <Grid item xs={3} sm={3} md={3}></Grid>

                                        {/* 2nd Row */}
                                        <Grid item xs={3} sm={3} md={3}></Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={6}
                                            className={classes.innerGrid}
                                        >
                                            <TextField
                                                label="2nd Prize - Username"
                                                name="secondPrize"
                                                type="text"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <Icon
                                                            classes={{
                                                                root: classes.iconRoot,
                                                            }}
                                                        >
                                                            <img
                                                                className={
                                                                    classes.imageIcon
                                                                }
                                                                src={
                                                                    secondPrize
                                                                }
                                                                alt="2nd"
                                                            />
                                                        </Icon>
                                                    ),
                                                }}
                                                onChange={handleWinnersChange}
                                                value={winnersInput.secondPrize}
                                            />
                                        </Grid>
                                        <Grid item xs={3} sm={3} md={3}></Grid>

                                        {/* 3rd Row */}
                                        <Grid item xs={3} sm={3} md={3}></Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={6}
                                            md={6}
                                            className={classes.innerGrid}
                                        >
                                            <TextField
                                                label="3rd Prize - Username"
                                                name="thirdPrize"
                                                type="text"
                                                variant="outlined"
                                                fullWidth
                                                required
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <Icon
                                                            classes={{
                                                                root: classes.iconRoot,
                                                            }}
                                                        >
                                                            <img
                                                                className={
                                                                    classes.imageIcon
                                                                }
                                                                src={thirdPrize}
                                                                alt="3rd"
                                                            />
                                                        </Icon>
                                                    ),
                                                }}
                                                onChange={handleWinnersChange}
                                                value={winnersInput.thirdPrize}
                                            />
                                        </Grid>
                                        <Grid item xs={3} sm={3} md={3}></Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            md={12}
                                            sm={12}
                                            className={classes.innerGrid}
                                        >
                                            <center>
                                                <Button
                                                    // onClick={handleParticipate}

                                                    variant="contained"
                                                    type="submit"
                                                    disabled={hasWinners}
                                                    
                                                >
                                                    {hasWinners
                                                        ? "Winners Announced"
                                                        : "Announce"}
                                                </Button>
                                            </center>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Footer />
            </div>
        )
    //);
};

export default Hackathonsummary;
