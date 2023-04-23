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
    email: "",
    password: "",
    passwordConf:"",
};


const Forgot = () => {
    const classes = useStyles();

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

    const handleAfterFormResponse = () => {
        setTimeout(() => {
            setShowBanner(null);
        }, 3000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            axios
                .put("http://localhost:3001/forgotPassword", {
                    email: values.email,
                    password: values.password,
                    passwordConf: values.passwordConf,
                })
                .then((response) => {
                    if (response.data.msg === "data successfully updated") {
                        setShowBanner({
                            apiSuccessResponse: "data successfully updated!",
                        });

                        console.log("data successfully updated");
                        return history.push("/auth/signin");
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

        const Passval=/^(?=.*\d)(?=.*[A-Z])(?=.[a-z])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&?."])[a-zA-Z0-9!#$@^%&]{8,20}$/;

        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (name === "email" && !re.test(fieldValue.toLowerCase())) {
            fieldErrors.push(
                <p name={name} className={classes.errorMessage} key={name}>
                    Invalid email
                </p>
            );
        }
        if (name === "password" &&!Passval.test(fieldValue)) {
            fieldErrors.push(
                <p name={name} className={classes.errorMessage} key={name}>
                    MinLength should be 8 characters,atleast one uppercase , one lowercase , one number and one special Character
                </p>
            );
        }

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
                            Forgot Password
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
                                        label="Email"
                                        name="email"
                                        // type="email"
                                        type="text"
                                        key="email"
                                        value={values.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter Your Email"
                                        errors={errors["email"]}
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
                                        {getHelperText("email")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                    <TextField
                                        variant="outlined"
                                        label="New Password"
                                        name="password"
                                        type="password"
                                        key="password"
                                        value={values.password}
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
                                        {getHelperText("password")}
                                    </FormHelperText>
                                </Box>
                                <Box>
                                    <TextField
                                        variant="outlined"
                                        label="Confirm Password"
                                        name="passwordConf"
                                        type="password"
                                        key="passwordConf"
                                        value={values.passwordConf}
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
                                        {getHelperText("passwordConf")}
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

export default Forgot;
