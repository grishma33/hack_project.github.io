import React, { useState, useEffect } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import { Controlled as ControlledEditor } from "react-codemirror2";
import {
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Button,
    Avatar,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import "./CodeEditor.css";
import axios from "axios";
import stub from "./defaultStub";

const useStyles = makeStyles((theme) => ({
    codeEditorHeader: {
        padding: "15px 40px",
        marginBottom: "10px",
        backgroundColor: `${theme.palette.common.lightMainGreenColor}`,
    },
    codeEditorTitleName: {
        placeSelf: "center",
        [theme.breakpoints.down("xs")]: {
            textAlign: "center",
            padding: "10px 0",
        },
    },
    codeEditorLanguageChange: {
        placeSelf: "center",
        textAlign: "end",
        [theme.breakpoints.down("xs")]: {
            textAlign: "center",
            padding: "10px 0",
        },
    },
}));

const Codeeditor = (props) => {
    const classes = useStyles();

    const [codeEditorLanguage, setCodeEditorLanguage] = useState("JavaScript");
    const [title, setTitle] = useState("JavaScript");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [status, setStatus] = useState("");
    const [jobId, setJobId] = useState("");
    const [currentUser, setCurrentUser] = useState({});

    const [tempQuestionData, setTempQuestionData] = useState({});

    const handleChangeLanguage = (e) => {
        let response = window.confirm(
            "WARNING: You're about to change the language of code editor.\n\nThis may remove your currently written code!"
        );
        if (response) {
            setCodeEditorLanguage(e.target.value);
            switch (e.target.value) {
                case "text/x-csrc":
                    setTitle("C");
                    break;

                case "text/x-java":
                    setTitle("Java");
                    break;

                case "text/x-c++src":
                    setTitle("C++");
                    break;

                case "Python":
                    setTitle("Python");
                    break;

                case "JavaScript":
                    setTitle("JavaScript");
                    break;
            }
        }
    };

    const handleChange = (editor, data, value) => {
        // console.log(data);
        setCode(value);
        stub[codeEditorLanguage] = value;
        // onChange(value)
    };

    let intervalId;

    useEffect(() => {
        // Resetting the prev code editor stub values!
        stub["javascript"] = "";
        stub["python"] = "";

        if (props.defaultCode !== undefined || props.defaultCode) {
            console.log("Def code", props.defaultCode);
            setCode(props.defaultCode);
        }

        if (props.question !== undefined && props.question) {
            console.log("Question inside CodeEditor", props.question);
            setTempQuestionData(props.question);
        }

        axios.get(`http://localhost:3001/currentUserId/63ff8cefd32c0b12606fd9de`, {
            headers: {
                authorization: localStorage.getItem('session'),
            }
        }).then((userResp) => {
            setCurrentUser(userResp.data.currentUser);
        }).catch((err) => {
            console.log("CODE EDITOR ERRR", err);
        })

    }, []);

    useEffect(() => {
        setCode(stub[codeEditorLanguage]);
    }, [codeEditorLanguage]);

    const handleCodeSubmit = async () => {
        let payload = {
            language: codeEditorLanguage,
            content: code,
        };

        if (Object.keys(tempQuestionData).length !== 0 && tempQuestionData) {
            console.log();
            payload["questionId"] = tempQuestionData["_id"];

            // @WorkAround
            payload["userEmail"] = currentUser.email;
        }

        setOutput("");
        setStatus("");
        setJobId("");

        console.log("FROM CODE", payload);

        await axios
            .post("http://localhost:9200/api/coding/run/code", payload)
            .then((response) => {
                if (response) {
                    // let { data } = response;
                    console.log(response);
                    console.log("OP", response.data.jobId);
                    setJobId(response.data.jobId);

                    intervalId = setInterval(async () => {
                        const { data: statusRes } = await axios.get(
                            `http://localhost:9200/api/coding/status/${payload.language}/${response.data.jobId}`
                        );

                        const { success, job, error } = statusRes;
                        console.log(statusRes);

                        if (success) {
                            const { status: jobStatus, output: jobOutput } =
                                job;
                            setStatus(
                                `${jobStatus.charAt(0)}${jobStatus.slice(1)}`
                            );
                            if (jobStatus === "pending") return;

                            setOutput(jobOutput);
                            clearInterval(intervalId);
                        } else {
                            setStatus("Error: Please try again!");
                            console.err(error);
                            clearInterval(intervalId);
                            setOutput(error);
                        }
                        console.log(statusRes);
                    }, 1000);
                } else {
                    setOutput("Error, please try again!");
                    console.log("Error connecting to server!");
                }
            })
            .catch((err) => {
                setOutput(err.response.data.resp);
                console.log("ERROR :: ", err.response);
            });
    };

    return (
        <div className="editor-container">
            <Grid container>
                <Grid item xs={12} sm={12} md={12}>
                    <Paper
                        elevation={3}
                        className={classes.codeEditorHeader}
                    >
                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                className={classes.codeEditorTitleName}
                            >
                                <Typography
                                    variant="h5"
                                    fontFamily="Open Sans"
                                    fontWeight="bold"
                                >
                                    {title} Editor
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                className={classes.codeEditorLanguageChange}
                                xs={12}
                                sm={6}
                                md={6}
                            >
                                <FormControl style={{ width: "250px" }}>
                                    <InputLabel id="demo-simple-select-label">
                                        Language
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={codeEditorLanguage}
                                        label="language"
                                        onChange={handleChangeLanguage}
                                    >
                                        <MenuItem
                                            value="JavaScript"
                                            name="JavaScript"
                                        >
                                            JavaScript
                                        </MenuItem>
                                        <MenuItem value="Python" name="Python">
                                            Python
                                        </MenuItem>
                                        <MenuItem value="text/x-csrc" name="C">
                                            C
                                        </MenuItem>
                                        <MenuItem
                                            value="text/x-c++src"
                                            name="C++"
                                        >
                                            C++
                                        </MenuItem>
                                        <MenuItem
                                            value="text/x-java"
                                            name="Java"
                                        >
                                            Java
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>

                    <ControlledEditor
                        onBeforeChange={handleChange}
                        value={code}
                        className="code-mirror-wrapper"
                        options={{
                            lineWrapping: true,
                            lint: true,
                            mode: codeEditorLanguage.toLowerCase(),
                            theme: "material",
                            lineNumbers: true,
                        }}
                    />

                    <center>
                        <Button
                            variant="contained"
                            style={{ margin: "20px 0" }}
                            size="large"
                            onClick={handleCodeSubmit}
                        >
                            Execute Code
                        </Button>
                    </center>
                    <Paper elevation={5} style={{ padding: "10px 15px" }}>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            style={{ alignItems: "center", display: "flex" }}
                        >
                            <Avatar
                                style={{
                                    height: "30px",
                                    width: "30px",
                                    backgroundColor: "green",
                                }}
                            >
                                {" "}
                            </Avatar>
                            <Typography
                                fontFamily="Open Sans"
                                variant="h6"
                                style={{ padding: "0px 10px" }}
                            >
                                {status}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            style={{ alignItems: "center", display: "flex" }}
                        >
                            {jobId && `Job ID: ${jobId}`}
                        </Grid>
                        <pre
                            style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                justifyContent: "center",
                            }}
                        >
                            <Grid container>
                                <Grid item xs={12} md={12} sm={12}>
                                    {output}
                                </Grid>
                            </Grid>
                        </pre>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default Codeeditor;
