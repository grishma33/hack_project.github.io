import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import NavBar from "../../navbar/NavBar";
import Footer from "../../footer/Footer";
// import theme from "../../ui/Theme";
import { makeStyles } from "@material-ui/core";
import {
    Grid,
    Paper,
    Typography,
    Button,
    Divider,
    TextField,
    Select,
    Icon,
    FormControl,
    InputLabel,
    MenuItem,
    TableBody,
    TableRow,
    TableCell,
    FormHelperText,
} from "@mui/material";
import "./OrganizePage.css";
import firstPrize from "../../../static/Icons/firstPrize.svg";
import secondPrize from "../../../static/Icons/secondPrize.svg";
import thirdPrize from "../../../static/Icons/thirdPrize.svg";
import Formsectionheader from "../FormSectionHeader/FormSectionHeader";
import Popup from "../Popup/Popup";
import Problemstatementform from "../ProblemStatementForm/ProblemStatementForm";
import useTable from "../../table/useTable";
import Sponsorsform from "../SponsorsForm/SponsorsForm";
import axios from "axios";
import { AppContext } from "../../../AppContext";
import Slidersform from "../SlidersForm/SlidersForm";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: "50px 30px",
        marginTop: "20px",
    },
    headerGrid: {
        display: "flex",
        justifyContent: "space-between",
    },
    formPaper: {
        padding: "15px",
        border: ".5px solid #d3d3d3",
    },
    innerGrid: {
        padding: "10px",
    },
    imageIcon: {
        height: "100%",
    },
    iconRoot: {
        textAlign: "center",
    },

    imageSponsor: {
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
    },
    errorMessage: {
        margin: "0px",
    },
}));

// Initial Form Values
const initialValues = {
    hackTitle: "",
    hackCompanyName: "",
    hackDescription: "",
    regStart: "",
    regEnd: "",
    hackStart: "",
    hackEnd: "",
    totalApplications: "",
    problemStatements: [
        {
            // problemstatementid: "1",
            // probTitle: "test",
            // probDescription: "",
            // probTechnologies: "",
            // probSolutionType: "",
            // probRefLinks: "",
        },
    ],
    sponsors: [
        // {
        //     sponsorName: "",
        //     sponsorImageLink: "",
        //     sponsorWebLink: "",
        // },
    ],
    submissionFormats: [],
    submissionGuidelines: "",
    linkedIn: "",
    facebook: "",
    instagram: "",
    twitter: "",
    companyWebsite: "",
    firstPrizeDesc: "",
    secondPrizeDesc: "",
    thirdPrizeDesc: "",
    sliders: [
        // sliderTitle: "",
        // sliderSubtitle: "",
    ],
};

const tabelHeadCells = [
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "solutionType", label: "Solution Type" },
    { id: "technologies", label: "Technologies" },
];

const validateURL = (inputURL) => {
    let url;

    try {
        url = new URL(inputURL);
    } catch (_) {
        return false;
    }

    return url.protocol === "https:";
};

const Organizepage = () => {
    const classes = useStyles();
    const { setShowBanner } = useContext(AppContext);
    const history = useHistory();

    const [currentUser, setCurrentUser] = useState({});
    const [values, setValues] = useState(initialValues);
    const [openPopup, setOpenPopup] = useState(false);
    const [sponsorOpenPopup, setSponsorOpenPopup] = useState(false);
    const [sliderOpenPopup, setSliderOpenPopup] = useState(false);

    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const [probStatementCSV, setProbStatementCSV] = useState(null);
    // const [csvResult, setCsvResult] = useState([]);

    const { TblContainer, TblHead, TblPagination } = useTable(
        values.problemStatements,
        tabelHeadCells
    );

    const handleCSVUpload = (event) => {
        console.log("D", event.target.files[0]);
        setProbStatementCSV(event.target.files[0]);
        let csvFormData = new FormData();
        csvFormData.append("userImage", event.target.files[0]);
        axios
            .post(
                "http://localhost:4400/api/hackathon/tempUpload",
                csvFormData,
                {
                    headers: {
                        "Content-type": "multipart/form-data",
                    },
                }
            )
            .then((resp) => {
                console.log("Excel Path", resp.data.filePaths);
                axios
                    .post("http://localhost:4400/api/hackathon/parse/excel", {
                        filePath: resp.data.filePaths[0],
                    })
                    .then((excelResp) => {
                        console.log("Excel RESP", excelResp.data.parsedData);
                        setValues({
                            ...values,
                            problemStatements: [
                                ...values.problemStatements,
                                excelResp.data.parsedData[0],
                            ],
                        });

                        console.log("After update", values);
                    })
                    .catch((err) => {
                        const multiErrors = err.response.data.errors;
                        let errorMessage = "";
                        multiErrors.map((er) => {
                            return errorMessage += `${er.column} ${er.error}\n`;
                        });

                        setShowBanner({ apiErrorResponse: errorMessage });
                        console.log("Error parsing Excel file", err.response);
                    });
            })
            .catch((err) => {
                // setShowBanner({apiErrorResponse: })
                console.log("Error uploading Excel file", err);
            });
    };

    // const results = [];

    useEffect(() => {
        try {
            axios
                // .get(`http://localhost:3001/currentUserId`,{
                .get('http://localhost:4200/api/user/currentuser', {
                    // .get(`http://localhost:3001/currentUser`,{
                    headers: {
                        authorization: localStorage.getItem("session"),
                    },
                })
                .then((responses) => {
                    console.log("C User Org Resp", responses.data.currentUser);
                    // setCurrentUser(responses.data.currentUser);
                    if (
                        !responses.data.currentUser ||
                        responses.data.currentUser === undefined
                    ) {
              
                        setShowBanner({
                            apiErrorResponse: "You must be signed in!",
                        });
                        return history.push("/auth/signin");
                    }
                    if (responses.data.data.userType === "developer") {
                        setShowBanner({
                            apiErrorResponse:
                                "You're not allowed to create hackathons!\nPlease SignIn using an Organization account.",
                        });
                       // return history.push("/dashboard");
                       return history.push('/hackathon/myhackathons')
                    // return history.push('/hackathon/hackathonmain')
                    }

                    setCurrentUser(responses.data.currentUser);
                })
                .catch((err) => {
                    console.log("ERR Current User in Dashboard", err);
                    setShowBanner({
                        apiErrorResponse:
                            "Error fetching data! Please try again. 2",
                    });
                });
        } catch (err) {
            console.log("Error catched in Org Page", err);
        } finally {
            handleAfterFormResponse();
        }

        if (probStatementCSV != null) {
            // fs.createReadStream(probStatementCSV)
            //     .pipe(csv({}))
            //     .on('data', (data) => { results.push(data) })
            //     .on('end', () => {
            //         console.log("File results", results);
            //     })
            // getCsvData();
            console.log("CSV", probStatementCSV);
        }
    }, [probStatementCSV]);

    const validateForm = (name, fieldValue) => {
        const fieldErrors = [];
        const hErrors = { ...errors };

        if (name === "hackTitle" && fieldValue.length < 8) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    MinLength should be 8
                </p>
            );
        }

        if (name === "hackCompanyName" && fieldValue.length < 5) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    MinLength should be 8
                </p>
            );
        }

        if (name === "regStart" && fieldValue) {
            let currentDate = new Date();
            let fieldDate = new Date(fieldValue);

            if (currentDate > fieldDate) {
                fieldErrors.push(
                    <p className={classes.errorMessage} name={name}>
                        Starting date should start from tomorrow!
                    </p>
                );
            }
        }

        if (name === "regEnd" && fieldValue) {
            let currentDate = new Date();
            let fieldDate = new Date(fieldValue);
            let startDate = new Date(values.regStart);

            if (fieldDate < currentDate || fieldDate <= startDate) {
                fieldErrors.push(
                    <p className={classes.errorMessage} name={name}>
                        Invalid Ending Date
                    </p>
                );
            }
        }

        if (name === "hackStart" && fieldValue) {
            let fieldDate = new Date(fieldValue);
            let regEndDate = new Date(values.regEnd);

            if (fieldDate < regEndDate) {
                fieldErrors.push(
                    <p className={classes.errorMessage} name={name}>
                        Hackathon must start after registration date ends!
                    </p>
                );
            }
        }

        if (name === "hackEnd" && fieldValue) {
            let fieldDate = new Date(fieldValue);
            let hackStartDate = new Date(values.hackStart);

            if (fieldDate < hackStartDate) {
                fieldErrors.push(
                    <p className={classes.errorMessage} name={name}>
                        Invalid Ending date
                    </p>
                );
            }
        }

        if (name === "totalApplications" && parseInt(fieldValue) <= 0) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    Invalid total number of applications.
                </p>
            );
        }

        if (name === "hackDescription" && fieldValue.length < 25) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    MinLength should be 25 characters.
                </p>
            );
        }

        if (name === "submissionGuidelines" && fieldValue.length < 10) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    MinLength should be 10
                </p>
            );
        }

        if (
            (name === "companyWebsite" ||
                name === "facebook" ||
                name === "linkedIn" ||
                name === "instagram" ||
                name === "twitter") &&
            !validateURL(fieldValue)
        ) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    Invalid Website Link
                </p>
            );
        }

        if (
            (name === "firstPrizeDesc" ||
                name === "secondPrizeDesc" ||
                name === "thirdPrizeDesc") &&
            fieldValue.length < 10
        ) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    MinLength should be 10
                </p>
            );
        }

        return {
            ...hErrors,
            [name]: fieldErrors,
        };
    };

    const checkFormValidation = (formErrors) => {
        let valid = 1;

        for (const [key, value] of Object.entries(formErrors)) {
            if (value.length) {
                valid = 0;
                break;
            }
        }

        return valid;
    };

    const getHelperText = (name) => {
        if (errors[name] && errors[name].length) {
            return errors[name];
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const inputErrors = {
            ...errors,
            ...validateForm(name, value),
        };

        setValues({
            ...values,
            [name]: value,
        });

        setErrors({
            ...inputErrors,
        });

        setIsFormValid(checkFormValidation(inputErrors));
    };

    const handleProblemStatementSubmit = (probDetails) => {
        setValues({
            ...values,
            problemStatements: [...values.problemStatements, probDetails],
        });
        setOpenPopup(false);
        console.log("After adding prob", values);
    };

    const handleSponsorSubmit = (sponsorDetails) => {
        setValues({
            ...values,
            sponsors: [...values.sponsors, sponsorDetails],
        });
        setSponsorOpenPopup(false);
    };

    const handleSliderSubmit = (sliderDetails) => {
        setValues({
            ...values,
            sliders: [...values.sliders, sliderDetails],
        });

        setSliderOpenPopup(false);
    };

    const handleSelectChange = (e) => {
        setValues({
            ...values,
            ["submissionFormats"]: e.target.value,
        });
        // console.log("Format", values.submissionFormat)
    };

    const handleAfterFormResponse = () => {
        setTimeout(() => {
            setShowBanner(null);
        }, 5000);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            values["submissionFormat"] = values["submissionFormats"].join(", ");
            let temp = values["hackStart"].split("-");
            let temp2 = values["hackEnd"].split("-");
            let temp3 = values["regStart"].split("-");
            let temp4 = values["regEnd"].split("-");
            values["hackStart"] = temp[2] + "-" + temp[1] + "-" + temp[0];
            values["hackEnd"] =
                // (parseInt(temp2[2]) + 1).toString() +
                (parseInt(temp2[2])).toString() +
                "-" +
                temp2[1] +
                "-" +
                temp2[0];
            values["regStart"] = temp3[2] + "-" + temp3[1] + "-" + temp3[0];
            values["regEnd"] =
                // (parseInt(temp4[2]) + 1).toString() +
                (parseInt(temp4[2])).toString() +
                "-" +
                temp4[1] +
                "-" +
                temp4[0];

            let { sliders, sponsors } = values;
            let slidersFormData = new FormData();
            let sponsorsFormData = new FormData();

            sliders.map((slide) => {
                console.log("Inv Image", slide.sliderImage);
                slidersFormData.append("userImage", slide.sliderImage);
            });

            sponsors.map((sponsor) => {
                console.log("Inv Sponsor Image", sponsor.sponsorImageLink);
                sponsorsFormData.append("userImage", sponsor.sponsorImageLink);
            });

            // axios
            //     .post(
            //         "http://localhost:4400/api/hackathon/tempUpload",
            //         slidersFormData,
            //         {
            //             headers: {
            //                 "Content-type": "multipart/form-data",
            //             },
            //         }
            //     )
            //     .then((resp) => {
            //         values["localUploadedSlidersFilesPath"] =
            //             resp.data.filePaths;
            //         console.log("Updated - All values", values);

            //         axios
            //             .post(
            //                 "http://localhost:4400/api/hackathon/tempUpload",
            //                 sponsorsFormData,
            //                 {
            //                     headers: {
            //                         "Content-type": "multipart/form-data",
            //                     },
            //                 }
            //             )
            //             .then((response) => {
            //                 values["localUploadedSponsorsFilesPath"] =
            //                     response.data.filePaths;
            //                 console.log("Updated - All values 2", values);
                            axios
                                .post("http://localhost:3001/createOrg",
                                    {
                                        ...values,
                                        organiserEmail: currentUser.email,

                                        // hackTitle: values.hackTitle,
                                        // hackCompanyName: values.hackCompanyName,
                                        // hackDescription: values.hackDescription,
                                        // regStart: values.regStart,
                                        // regEnd: values.regEnd,
                                        // hackStart: values.hackStart,
                                        // hackEnd: values.hackEnd,
                                        // totalApplications: values.totalApplications,
                                        // problemStatements: values.problemStatements,
                                        // sponsors: values.sponsors,
                                        // submissionFormats: values.submissionFormats,
                                        // submissionGuidelines: values.submissionGuidelines,
                                        // linkedIn: values.linkedIn,
                                        // facebook: values.facebook,
                                        // instagram: values.instagram,
                                        // twitter: values.twitter,
                                        // companyWebsite: values.companyWebsite,
                                        // firstPrizeDesc: values.firstPrizeDesc,
                                        // secondPrizeDesc: values.secondPrizeDesc,
                                        // thirdPrizeDesc: values.thirdPrizeDesc,
                                        // sliders: values.sliders,

                                    },
                                    {
                                        // headers: {
                                        //     authorization:
                                        //         /localStorage.getItem("session"),
                                        // },
                                    }
                                )
                                .then((response) => {
                                    setShowBanner({
                                        apiSuccessResponse:
                                            "Created.",
                                    });

                                    console.log(
                                        "Got Response, Hackathon Created!!"
                                    );
                                    // console.log(
                                    //     response.data.add_hackathon_db.uniqueHackathonID
                                    // );
                                    // history.push(
                                    //      `/hackathon/view/${response.data.add_hackathon_db.uniqueHackathonID}`
                                    //      //`http://localhost:3001/getOrgUser/6402d8bfa201cd41f8962abd`
                                    // );
                                    console.log(
                                        response.data
                                    );
                                    console.log(
                                        response.data.message
                                    );
                                    if (response.data.message === "Created.") {
                                        setShowBanner({
                                            apiErrorResponse:
                                                "Successfully",
                                        });
                                       //return history.push('/hackathon/myhackathons')

                                       const a = `/hackathon/view/${response.data.data._id}`
                                       return history.push(a);
                                    }

                                })
                                .catch((err) => {
                                    setShowBanner({
                                        apiErrorResponse:
                                            "Problem occured while creating a hackathon! 😦",
                                    });
                                    console.log(
                                        "Error in axios while creating Hackathon",
                                        err
                                    );
                                });
                            console.log("Resp after uploading");
                            setShowBanner({
                                apiSuccessResponse:
                                    "Your hackathon is being created! ⏳🤩 \nYou'll be automatically redirected to your hackathon page once it is created!",
                            });

                           

                            //return history.push('/hackathon/myhackathons')
                            // return history.push('/hackathon/hackathonmain')

                            // setTimeout(() => {
                            //     setShowBanner(null);
                            // }, 2000);
                        //});
                // })
                // .catch((err) => {
                //     console.log("ERR1", err);
                // });
        } catch (err) {
        } finally {
            handleAfterFormResponse();
        }
    };

    return (
        <div>
            <NavBar location="dashboard" />
            <form method="POST" onSubmit={handleFormSubmit}>
                <Grid
                    container
                    sm={12}
                    xs={12}
                    md={12}
                    spacing={{ xs: 1, md: 2 }}
                    className={classes.container}
                >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        className={classes.headerGrid}
                    >
                        <Typography variant="h3" fontFamily="Bebas Neue">
                            Organize A Hackathon
                        </Typography>

                        {/* <Button variant="contained">Save</Button> */}
                    </Grid>

                    {/* Hackathon Details Title */}
                    <Formsectionheader name="Hackathon" />

                    {/* Hackathon Details */}
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.formPaper} elevation={5}>
                            <Grid container xs={12} md={12} sm={12}>
                                {/* 1st Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                
                              
                                    <TextField
                                        label="Title"
                                        name="hackTitle"
                                        variant="outlined"
                                        type="text"
                                        required
                                        placeholder="Enter Hackathon Title"
                                        size="small"
                                        onChange={handleInputChange}
                                        value={values.hackTitle}
                                        fullWidth
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("hackTitle")}
                                    </FormHelperText>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Organization Name"
                                        name="hackCompanyName"
                                        // name="hackOrganizationName"
                                        variant="outlined"
                                        type="text"
                                        required
                                        placeholder="Enter Organization Name"
                                        size="small"
                                        fullWidth
                                        value={values.hackCompanyName}
                                        onChange={handleInputChange}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("hackCompanyName")}
                                    </FormHelperText>
                                </Grid>

                                {/* 2nd Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Registration starts at"
                                        name="regStart"
                                        variant="outlined"
                                        type="date"
                                        required
                                        size="small"
                                        fullWidth
                                        value={values.regStart}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("regStart")}
                                    </FormHelperText>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Registration ends at"
                                        name="regEnd"
                                        variant="outlined"
                                        type="date"
                                        required
                                        size="small"
                                        fullWidth
                                        value={values.regEnd}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("regEnd")}
                                    </FormHelperText>
                                </Grid>

                                {/* 3rd Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Hackathon starts at"
                                        name="hackStart"
                                        variant="outlined"
                                        type="date"
                                        required
                                        size="small"
                                        fullWidth
                                        value={values.hackStart}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("hackStart")}
                                    </FormHelperText>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Hackathon ends at"
                                        name="hackEnd"
                                        variant="outlined"
                                        type="date"
                                        required
                                        size="small"
                                        fullWidth
                                        value={values.hackEnd}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={handleInputChange}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("hackEnd")}
                                    </FormHelperText>
                                </Grid>

                                {/* 4th Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Total Applications"
                                        name="totalApplications"
                                        variant="outlined"
                                        type="number"
                                        required
                                        placeholder="Total Applications"
                                        size="small"
                                        value={values.totalApplications}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("totalApplications")}
                                    </FormHelperText>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                ></Grid>

                                {/* 5th Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Description"
                                        name="hackDescription"
                                        variant="outlined"
                                        type="text"
                                        required
                                        placeholder="Hackathon description"
                                        size="small"
                                        value={values.hackDescription}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("hackDescription")}
                                    </FormHelperText>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Problem Statements Details Title */}
                    <Formsectionheader name="Problem Statements" />

                    {/* Problem Statements Form */}
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.formPaper}>
                            <Grid container xs={12} md={12} sm={12}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    style={{
                                        marginLeft: "0",
                                        placeContent: "end",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => setOpenPopup(true)}
                                        style={{
                                            display: "flex",
                                            float: "right",
                                            marginLeft: "auto"
                                        }}
                                    >
                                        Add Problem Statement
                                    </Button>

                                    {/* <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            document
                                                .getElementById("csvUpload")
                                                .click();
                                        }}
                                        style={{
                                            display: "flex",
                                            float: "right",
                                            marginRight: "10px",
                                            marginLeft: "auto"
                                        }}
                                    >
                                        Import from Excel
                                    </Button> */}
                                    <input
                                        id="csvUpload"
                                        type="file"
                                        accept=".xlsx"
                                        style={{ visibility: "hidden" }}
                                        onChange={handleCSVUpload}
                                    />

                                    {/* <Button
                                        variant="contained"
                                        size="small"
                                        href="https://firebasestorage.googleapis.com/v0/b/eduhack-ea18b.appspot.com/o/hackathons%2Fdefault_files%2FProblem_Statements.xlsx?alt=media&token=fae5b021-f685-4d0b-9245-68e749bf65b6"
                                        style={{
                                            display: "flex",
                                            float: "right",
                                            marginRight: "10px",
                                            marginLeft: "auto"
                                        }}
                                    >
                                        Excel Format
                                    </Button> */} 
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    style={{ marginTop: "20px" }}
                                >
                                    <Divider />
                                </Grid>

                                <Grid item xs={12} sm={12} md={12}>
                                    <TblContainer>
                                        <TblHead />

                                        <TableBody>
                                            {values.problemStatements.map(
                                                (statement) => (
                                                    <TableRow
                                                        key={
                                                            statement.probTitle
                                                        }
                                                    >
                                                        <TableCell>
                                                            {
                                                                statement.probTitle
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                statement.probDescription
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                statement.probSolutionType
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                statement.probAcceptedTechs
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </TblContainer>
                                    <TblPagination />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Formsectionheader
                        name="Solutions"
                        className={classes.innerGrid}
                    />

                    {/* Solutions Form  */}
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.formPaper}>
                            <Grid container xs={12} md={12} sm={12}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    className={classes.innerGrid}
                                >
                                    <FormControl style={{ width: "300px" }}>
                                        <InputLabel id="demo-simple-select-label">
                                            Submission Format
                                        </InputLabel>
                                        <Select
                                            id="demo-simple-select"
                                            label="submissionFormats"
                                            multiple
                                            value={values.submissionFormats}
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem
                                                value="ZIP"
                                                name="ZIP"
                                                key="ZIP"
                                            >
                                                ZIP
                                            </MenuItem>
                                            <MenuItem
                                                value="RAR"
                                                name="RAR"
                                                key="RAR"
                                            >
                                                RAR
                                            </MenuItem>
                                            {/* <MenuItem
                                                value="TZ"
                                                name="TZ"
                                                key="TZ"
                                            >
                                                TZ
                                            </MenuItem>
                                            <MenuItem
                                                value="7Z"
                                                name="7Z"
                                                key="7Z"
                                            >
                                                7Z
                                            </MenuItem> */}
                                            <MenuItem
                                                value="Single Program File"
                                                name="Single Program File"
                                                key="Single Program File"
                                            >
                                                Single Program File
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid
                                    item
                                    sm={12}
                                    md={12}
                                    xs={12}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Submission Guidelines"
                                        name="submissionGuidelines"
                                        size="small"
                                        type="text"
                                        fullWidth
                                        value={values.submissionGuidelines}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("submissionGuidelines")}
                                    </FormHelperText>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Social media handles Details Title */}
                    <Formsectionheader name="Social Media Handles" />

                    {/* Social Media Handles Form */}
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.formPaper}>
                            <Grid container xs={12} md={12} sm={12}>
                                {/* 1st Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Website"
                                        name="companyWebsite"
                                        placeholder="Website"
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={values.companyWebsite}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("companyWebsite")}
                                    </FormHelperText>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Facebook"
                                        name="facebook"
                                        placeholder="Facebook"
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={values.facebook}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("facebook")}
                                    </FormHelperText>
                                </Grid>

                                {/* 2nd Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Instagram"
                                        name="instagram"
                                        placeholder="Instagram"
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={values.instagram}
                                        onChange={handleInputChange}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("instagram")}
                                    </FormHelperText>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="Twitter"
                                        name="twitter"
                                        placeholder="Twitter"
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        value={values.twitter}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("twitter")}
                                    </FormHelperText>
                                </Grid>

                                {/* 3rd Row */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                >
                                    <TextField
                                        label="LinkedIn"
                                        name="linkedIn"
                                        placeholder="LinkedIn"
                                        variant="outlined"
                                        type="text"
                                        size="small"
                                        value={values.linkedIn}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("linkedIn")}
                                    </FormHelperText>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    className={classes.innerGrid}
                                ></Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Sponsors Title */}
                    {/* <Formsectionheader name="Sponsors" />

                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.formPaper}>
                            <Grid container xs={12} md={12} sm={12}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    style={{ display: "flex" }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{ marginLeft: "auto" }}
                                        onClick={() =>
                                            setSponsorOpenPopup(true)
                                        }
                                    >
                                        Add Sponsor
                                    </Button>
                                </Grid>

                                {values.sponsors.map((sponsor) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={2.4}
                                        style={{ marginTop: "20px" }}
                                        key={sponsor.sponsorName}
                                    >
                                        <center>
                                            <div>
                                                <a
                                                    href={
                                                        sponsor.sponsorWebLink
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <img
                                                        src="https://source.unsplash.com/random"
                                                        style={{
                                                            width: "200px",
                                                            height: "140px",
                                                            borderRadius:
                                                                "10px",
                                                        }}
                                                        className={
                                                            classes.imageSponsor
                                                        }
                                                        alt={sponsor.sponsorName}
                                                    />
                                                </a>
                                            </div>
                                        </center>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid> */}

                    {/* Posters Title */}
                    {/* <Formsectionheader name="Hackathon Sliders" />
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.formPaper}>
                            <Grid container xs={12} md={12} sm={12}>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    style={{ display: "flex" }}
                                >
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{ marginLeft: "auto" }}
                                        onClick={() => setSliderOpenPopup(true)}
                                    >
                                        Add Slider
                                    </Button>
                                </Grid>

                                {values.sliders.map((slider) => (
                                    <p>{slider.sliderTitle}</p>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid> */}

                    {/* Winning prizes Details Title */}
                    <Formsectionheader name="Winning Prizes" />

                    {/* Winners Form */}
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.formPaper}>
                            <Grid container xs={12} md={12} sm={12}>
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
                                        label="1st Prize"
                                        name="firstPrizeDesc"
                                        type="text"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        size="small"
                                        value={values.firstPrizeDesc}
                                        onChange={handleInputChange}
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
                                                        alt="First Prize"
                                                    />
                                                </Icon>
                                            ),
                                        }}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("firstPrizeDesc")}
                                    </FormHelperText>
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
                                        label="2nd Prize"
                                        name="secondPrizeDesc"
                                        type="text"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        size="small"
                                        value={values.secondPrizeDesc}
                                        onChange={handleInputChange}
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
                                                        src={secondPrize}
                                                        alt="Second Prize"
                                                    />
                                                </Icon>
                                            ),
                                        }}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("secondPrizeDesc")}
                                    </FormHelperText>
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
                                        label="3rd Prize"
                                        name="thirdPrizeDesc"
                                        type="text"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        size="small"
                                        value={values.thirdPrizeDesc}
                                        onChange={handleInputChange}
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
                                                        alt="Third Prize"
                                                    />
                                                </Icon>
                                            ),
                                        }}
                                    />
                                    <FormHelperText
                                        component="div"
                                        error={errors && errors.length > 0}
                                        style={{
                                            paddingLeft: "8px",
                                            boxSizing: "border-box",
                                            color: "red",
                                        }}
                                    >
                                        {getHelperText("thirdPrizeDesc")}
                                    </FormHelperText>
                                </Grid>
                                <Grid item xs={3} sm={3} md={3}></Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                        <center>
                            <Button
                                variant="contained"
                                size="large"
                                type="Submit"
                                disabled={!isFormValid}
                            >
                                Organize Hackathon
                            </Button>
                        </center>
                    </Grid>

                    {/* Problem Statement Dialog */}
                    <Popup
                        openPopup={openPopup}
                        title="Add Problem Statement"
                        setOpenPopup={setOpenPopup}
                    >
                        <Problemstatementform
                            setOpenPopup={setOpenPopup}
                            handleSubmit={handleProblemStatementSubmit}
                        />
                    </Popup>

                    {/* Sponsors Dialog */}
                    <Popup
                        openPopup={sponsorOpenPopup}
                        title="Add Sponsor"
                        setOpenPopup={setSponsorOpenPopup}
                    >
                        <Sponsorsform
                            setOpenPopup={setSponsorOpenPopup}
                            handleSubmit={handleSponsorSubmit}
                        />
                    </Popup>

                    {/* Slider Dialog */}
                    <Popup
                        openPopup={sliderOpenPopup}
                        title="Add Slider"
                        setOpenPopup={setSliderOpenPopup}
                    >
                        <Slidersform
                            setOpenPopup={setSliderOpenPopup}
                            handleSubmit={handleSliderSubmit}
                        />
                    </Popup>
                </Grid>
            </form>
            <Footer />
        </div>
    );
};

export default Organizepage;
