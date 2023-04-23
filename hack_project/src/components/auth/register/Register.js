import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {
    TextField,
    Button,
    Box,
    Grid,
    Paper,
    Typography,
    Link,
    Avatar,
    FormHelperText,
} from "@mui/material";
import theme from "../../ui/Theme";
import { LockOutlined } from "@mui/icons-material";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles({
    root: {
        "& .MuiFormControl-root": {
            width: "100%",
            // margin: theme.spacing(1),
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        "& .MuiButton-root": {
            width: "40%",
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            // margin: theme.spacing(1),
        },
    },
    pageContent: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        width: "35%",
        [theme.breakpoints.down("md")]: {
            width: "40%",
        },
        [theme.breakpoints.down("sm")]: {
            width: "90%",
        },
        margin: "auto",
        marginTop: "50px",
        marginBottom: "50px",
    },
    formLink: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    mainContainer: {
        display: "grid",
        minHeight: "100vh",
        alignContent: "center",
        backgroundColor: theme.palette.common.lightMainGreenColor,
    },
    formButton: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    errorMessage: {
        margin: "0px",
    },
});

const initialValues = {
    groupname: "",
    collegename: "",
    groupleadername:"",
    groupleadercontactno:"",
    groupleaderemailid:"",
    groupmembertwoname:"",
    groupmembertwocontactno:"",
    groupmembertwoemailid:"",
    groupmemberthreename:"",
    groupmemberthreecontactno:"",
    groupmemberthreeemailid:"",
    userid:"",
};


const Register = (props) => {
    const classes = useStyles();
    const [currentUser, setCurrentUser] = useState({});
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    const history = useHistory();
    const { setShowBanner, appCurrentUser, updateAppCurrentUser } =
        useContext(AppContext);

    useEffect(() => {
        updateAppCurrentUser();
        console.log("Sign User", updateAppCurrentUser());
        if (appCurrentUser) {
            setShowBanner({ apiSuccessResponse: "You're already signed in!" });
            return history.push("/dashboard");
        }
    }, []);

    // const validate = () => {
    //     const re =
    //         /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //     let temp = {};

    //     temp.email = re.test(values.email.toLowerCase()) ? "" : "Invalid";
    //     temp.password =
    //         values.password.length > 7
    //             ? ""
    //             : "Password length should be greater than 10.";
    //     console.log("Temp", temp);
    //     setErrors(
    //         {
    //             something: "true",
    //         },
    //         () => {
    //             return Object.values(temp).every((x) => x == "");
    //         }
    //     );
    // };


    // const validate = (name, fieldValue) => {
    //     const fieldErrors = [];
    //     const hErrors = { ...errors };


    //     const re =
    //         /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    //     if (name === "groupleaderemailid" && !re.test(fieldValue.toLowerCase())) {
    //         fieldErrors.push(
    //             <p className={classes.errorMessage} name={name}>
    //                 Invalid Email
    //             </p>
    //         );
    //     }

    //     if (name === "userName" && fieldValue.length < 3) {
    //         fieldErrors.push(
    //             <p className={classes.errorMessage} name={name}>
    //                 MinLength should be 3
    //             </p>
    //         );
    //     }


    //     if (name === "college" && fieldValue.length < 2) {
    //         fieldErrors.push(
    //             <p className={classes.errorMessage} name={name}>
    //                 Please add valid College name
    //             </p>
    //         );
    //     }

    

    //     if (name === "groupleadercontactno" && fieldValue.toString().length < 10) {
    //         fieldErrors.push(
    //             <p className={classes.errorMessage} name={name}>
    //                 MinLength should be 10
    //             </p>
    //         );
    //     }



    //     return {
    //         ...hErrors,
    //         [name]: fieldErrors,
    //     };
    // };



    const handleAfterFormResponse = () => {
        setTimeout(() => {
            setShowBanner(null);
        }, 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            axios
                .post("http://localhost:3001/eventreg", {
                    groupname: values.groupname,
                    collegename: values.collegename,
                    groupleadername: values.groupleadername,
                    groupleadercontactno: values.groupleadercontactno,
                    groupleaderemailid: values.groupleaderemailid,
                    groupmembertwoname: values.groupmembertwoname,
                    groupmembertwocontactno: values.groupmembertwocontactno,
                    groupmembertwoemailid: values.groupmembertwoemailid,
                    groupmemberthreename: values.groupmemberthreename, 
                    groupmemberthreecontactno: values.groupmemberthreecontactno,
                    groupmemberthreeemailid: values.groupmemberthreeemailid,
                    userid: props.match.params.id,//values.userid,

                })
                .then((response) => {
                    if (response.data.message === "Register.") {
                        setShowBanner({
                            apiSuccessResponse: "Register.",
                        });

                        console.log("register  successfully");
                        //return history.push("/auth/signin");
                        //return history.push("/");
                        //const a = `/hackathon/submission/${response.data.data._id}`
                        const a = `/hackathon/submission/${props.match.params.id}`
                        return history.push(a);
                    } else {
                        setShowBanner({
                            apiErrorResponse: response.data.warning,
                        });
                        console.log("Can't create user. Please try again!");
                    }
                    // if (response) {
                    //     localStorage.setItem(
                    //         "session",
                    //         response.data.data.accessToken
                    //     );
                    //     setShowBanner({
                    //         apiSuccessResponse: "forgot  successfully!",
                    //     });
                    //     updateAppCurrentUser();
                    //     return history.push("/");
                    // }
                })
                .catch((err) => {
                    console.log("Some problem occured. Please try again!");
                    setShowBanner({
                        apiErrorResponse:
                            "Invalid credentials, Please try again!",
                    });
                    console.log(err);
                });
        } catch (err) {
        } finally {
            handleAfterFormResponse();
        }
    };

    const checkFormValidation = (formErrors) => {
        let valid = 1;
        // let tempErrors = {};

        for (const [key, value] of Object.entries(formErrors)) {
            if (value.length) {
                valid = 0;
                // console.log("Valid Changed to 0");
                break;
            }
        }

        return valid;
    };

    const validateForm = (name, fieldValue) => {
        const fieldErrors = [];
        const hErrors = { ...errors };

        const mm = 
        /^([+]\d{2}[ ])?\d{10}$/;

        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (name === "groupleaderemailid" && !re.test(fieldValue.toLowerCase())) {
            fieldErrors.push(
                <p name={name} className={classes.errorMessage} key={name}>
                    Invalid email
                </p>
            );
        }
        if (name === "groupmembertwoemailid" && !re.test(fieldValue.toLowerCase())) {
            fieldErrors.push(
                <p name={name} className={classes.errorMessage} key={name}>
                    Invalid email
                </p>
            );
        }
        if (name === "groupmemberthreeemailid" && !re.test(fieldValue.toLowerCase())) {
            fieldErrors.push(
                <p name={name} className={classes.errorMessage} key={name}>
                    Invalid email
                </p>
            );
        }
        if (name === "groupleadercontactno" && !mm.test(fieldValue.toLowerCase())) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    Mobile Number is not valid.
                </p>
            );
        }
        if (name === "groupmembertwocontactno" && !mm.test(fieldValue.toLowerCase())) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    Mobile Number is not valid.
                </p>
            );
        }
        if (name === "groupmemberthreecontactno" && !mm.test(fieldValue.toLowerCase())) {
            fieldErrors.push(
                <p className={classes.errorMessage} name={name}>
                    Mobile Number is not valid.
                </p>
            );
        }

        if (name === "userName" && fieldValue.length < 3) {
                    fieldErrors.push(
                        <p className={classes.errorMessage} name={name}>
                            MinLength should be 3
                        </p>
                    );
                }
        
        
                if (name === "college" && fieldValue.length < 2) {
                    fieldErrors.push(
                        <p className={classes.errorMessage} name={name}>
                            Please add valid College name
                        </p>
                    );
                }
        
            
        
                // if (name === "groupleadercontactno" && fieldValue.toString().length < 10) {
                //     fieldErrors.push(
                //         <p className={classes.errorMessage} name={name}>
                //             MinLength should be 10
                //         </p>
                //     );
                // }
        
        

        return {
            ...hErrors,
            [name]: fieldErrors,
        };
    };

    const getHelperText = (name) => {
        // console.log("Errors", errors.name);
        if (errors[name] && errors[name].length) {
            return errors[name];
        }
        // return errors[name] || " ";
        // return "Hello World"
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const inputErrors = {
            ...errors,
            ...validateForm(name, value),
        };

        // console.log("Input Errors", inputErrors);

        setValues({
            ...values,
            [name]: value,
        });

        setErrors({
            ...inputErrors,
        });

        setIsFormValid(checkFormValidation(inputErrors));
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid className={classes.mainContainer} container>
                {/* <center> */}
                <Paper className={classes.pageContent}>
                    <center>
                        <Avatar
                            style={{
                                backgroundColor: `${theme.palette.primary.main}`,
                            }}
                        >
                            <LockOutlined />{" "}
                        </Avatar>
                        <h2
                            style={{ color: `${theme.palette.secondary.main}` }}
                        >
                             Registration Form
                        </h2>
                    </center>
                    <form
                        className={classes.root}
                        elevation={10}
                        onSubmit={handleSubmit}
                    >
                        <Grid container>
                            <Grid item xs={12} md={12} sm={12}>
                                <Box>
                                    <TextField
                                        variant="outlined"
                                        label="Group Name"
                                        name="groupname"
                                        type="text"
                                        key="groupname"
                                        value={values.groupname}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Name"
                                        errors={errors["groupname"]}
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
                                        {getHelperText("groupname")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                    <TextField
                                        variant="outlined"
                                        label="College Name"
                                        name="collegename"
                                        type="text"
                                        key="collegename"
                                        value={values.collegename}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your College Name"
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
                                        {getHelperText("collegename")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Leader Name"
                                        name="groupleadername"
                                        type="text"
                                        key="groupleadername"
                                        value={values.groupleadername}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Leader Name"
                                        errors={errors["groupleadername"]}
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
                                        {getHelperText("groupleadername")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Leader Contact No"
                                        name="groupleadercontactno"
                                        type="tel"
                                        key="groupleadercontactno"
                                        value={values.groupleadercontactno}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Leader Contact No"
                                        errors={errors["groupleadercontactno"]}
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
                                        {getHelperText("groupleadercontactno")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Leader Email id"
                                        name="groupleaderemailid"
                                        type="email"
                                        key="groupleaderemailid"
                                        value={values.groupleaderemailid}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Leader Email id"
                                        errors={errors["groupleaderemailid"]}
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
                                        {getHelperText("groupleaderemailid")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Member 2 Name"
                                        name="groupmembertwoname"
                                        type="text"
                                        key="groupmembertwoname"
                                        value={values.groupmembertwoname}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Member 2 Name"
                                        errors={errors["groupmembertwoname"]}
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
                                        {getHelperText("groupmembertwoname")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group member 2 Contact No"
                                        name="groupmembertwocontactno"
                                        type="tel"
                                        key="groupmembertwocontactno"
                                        value={values.groupmembertwocontactno}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group member 2 Contact No"
                                        errors={errors["groupmembertwocontactno"]}
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
                                        {getHelperText("groupmembertwocontactno")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Member 2 Email id"
                                        name="groupmembertwoemailid"
                                        type="email"
                                        key="groupmembertwoemailid"
                                        value={values.groupmembertwoemailid}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Member 2 Email id"
                                        errors={errors["groupmembertwoemailid"]}
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
                                        {getHelperText("groupmembertwoemailid")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Member 3 Name"
                                        name="groupmemberthreename"
                                        type="text"
                                        key="groupmemberthreename"
                                        value={values.groupmemberthreename}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Member 3 Name"
                                        errors={errors["groupmemberthreename"]}
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
                                        {getHelperText("groupmemberthreename")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Member 3 Contact No"
                                        name="groupmemberthreecontactno"
                                        type="tel"
                                        key="groupmemberthreecontactno"
                                        value={values.groupmemberthreecontactno}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Member 3 Contact No"
                                        errors={errors["groupmemberthreecontactno"]}
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
                                        {getHelperText("groupmemberthreecontactno")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                <TextField
                                        variant="outlined"
                                        label="Group Member 3 Email id"
                                        name="groupmemberthreeemailid"
                                        type="email"
                                        key="groupmemberthreeemailid"
                                        value={values.groupmemberthreeemailid}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Group Member 3 Email id"
                                        errors={errors["groupmemberthreeemailid"]}
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
                                        {getHelperText("groupmemberthreeemailid")}
                                    </FormHelperText>
                                </Box>
                                <Box
                                    sx={{
                                        typography: "body1",
                                        "& > :not(style) + :not(style)": {
                                            ml: 2,
                                        },
                                    }}
                                    className={classes.formLink}
                                    //   onClick={preventDefault}
                                >
                                    <Typography
                                        variant="button"
                                        style={{ textDecoration: "underline" }}
                                    >
                                        {/* <p component={Link} to="/">Forgot Password?</p> */}
                                        {/* <Link href="http://localhost:3000/">
                                            <b
                                                style={{
                                                    color: `${theme.palette.common.darkGreen}`,
                                                }}
                                            >
                                                Forgot Password
                                            </b>
                                        </Link> */}
                                    </Typography>
                                </Box>
                                <center>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            style={{
                                                backgroundColor: `${theme.palette.secondary.main}`,
                                                color: `${theme.palette.common.ternaryColor}`,
                                            }}
                                            type="Submit"
                                            disabled={!isFormValid}
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                    <Box className={classes.formLink}>
                                        <Typography variant="body2">
                                            {/* <Link href="http://localhost:3000/auth/signup">
                                                <b
                                                    style={{
                                                        color: `${theme.palette.common.darkGreen}`,
                                                    }}
                                                >
                                                    Don't have an Account?
                                                    Create Here
                                                </b>
                                            </Link> */}
                                        </Typography>
                                    </Box>
                                </center>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </ThemeProvider>
    );
};

export default Register;
