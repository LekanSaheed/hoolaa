import React, { useState, useRef, useEffect } from "react";
import Wrapper from "../../../components/Wrapper";
import { motion } from "framer-motion";
import classes from "./newParty.module.css";
import {
  BsCalendarCheck,
  BsFillCalendar2WeekFill,
  BsGrid,
  BsListUl,
  BsTextareaT,
} from "react-icons/bs";
import ColorTabs from "../../../components/MultiForm";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { TextField, makeStyles } from "@material-ui/core";
import Select from "react-select";
import {
  DesktopDatePicker,
  LocalizationProvider,
  MobileDatePicker,
  TimePicker,
} from "@mui/lab";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import DateAdapter from "@mui/lab/AdapterMoment";
import DateTimePicker from "@mui/lab/DateTimePicker";
import SwipeableViews from "react-swipeable-views";
import {
  GiPartyHat,
  GiPartyFlags,
  GiPartyPopper,
  GiCarnivalMask,
  GiClown,
  GiJesterHat,
  GiDiamondRing,
} from "react-icons/gi";
import {
  db,
  Timestamp,
  doc,
  addDoc,
  collection,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "../../../firebase/firebase";
import { useAuthState } from "../../../context/AuthContext";

import Image from "next/image";
import { BiCategory, BiPlusCircle } from "react-icons/bi";
import moment from "moment";
const steps = ["Select Category", "Party details", "Review"];

function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [partyName, setpartyName] = useState("");
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState("");
  const [start_date, setStartDate] = useState(new Date());
  const [isPrivate, setIsPrivate] = useState(false);
  const [cover_img, setCoverImg] = useState(null);
  const [currImg, setCurrentImg] = useState(null);
  const [misc, setMisc] = useState("");
  const [toggled, setToggled] = useState(false);

  const nameRef = useRef(null);
  const cards = [
    { label: "House Party", value: "house_party", icon: <GiPartyHat /> },
    { label: "Street Party", value: "street_party", icon: <GiClown /> },
    { label: "Carnival", value: "carnival", icon: <GiCarnivalMask /> },
    { label: "Club Party", value: "club_party", icon: <GiPartyPopper /> },
    { label: "Wedding Party", value: "wedding_party", icon: <GiDiamondRing /> },
    {
      label: "Get-Together Party",
      value: "get_together_party",
      icon: <GiJesterHat />,
    },
    { label: "Beach Party", value: "beach_party", icon: <GiPartyFlags /> },
  ];

  const handleImgChange = (e) => {
    const img = e.target.files[0];
    setCurrentImg(URL.createObjectURL(img));
    console.log(currImg);
    setCoverImg(img);
    console.log(img);
  };

  const createParty = (url) => {
    const docRef = collection(db, "parties");
    addDoc(
      docRef,
      {
        // cover_img: url,
        category: { label: category.label, value: category.value },
        start_date: myTimestamp,
        partyName,
        location,
        isPrivate,
        isStarted: false,
        created_At: Timestamp.fromDate(new Date()),
        created_By: user.user.uid,
      },
      { merge: true }
    ).then(() => {
      handleNext();
      console.log("DOcument Written");
    });
  };
  const handleImageUpload = () => {
    const storage = getStorage();
    const storageRef = ref(storage, "cover-images/" + cover_img.name);

    uploadBytes(storageRef, cover_img.name && cover_img.name).then(
      (snapshot) => {
        console.log(snapshot);
        getDownloadURL(ref(storage, "cover-images/" + cover_img.name)).then(
          (url) => {
            createParty(url);
            console.log(url);
          }
        );
        console.log("Uploaded a blob or file!");
      }
    );
  };
  const handleNext = () => {
    let newSkipped = skipped;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  console.log(start_date);
  const useStyles = makeStyles((theme) => ({
    root: {
      "& .css-qivjh0-MuiStepLabel-label": {
        [theme.breakpoints.down(767)]: {
          fontSize: "10px !important",
        },
      },
      "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-active": {
        color: "#8800ff99",
      },
      "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root.Mui-completed": {
        color: "goldenrod",
      },
      "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root": {
        // color: "#8800ff",
        [theme.breakpoints.down(767)]: {
          width: "0.5em",
          height: "0.5em",
        },
      },
    },
    label: {
      fontSize: "10px !important",
    },
  }));
  const myclass = useStyles();
  var myTimestamp = Timestamp.fromDate(start_date);
  console.log(category);
  const { user } = useAuthState();

  return (
    <Box
      backgroundColor="#fff"
      borderRadius="10px"
      padding="10px"
      sx={{ width: "100%" }}
    >
      <Stepper
        sx={{ borderBottom: 1, borderColor: "divider", padding: "10px" }}
        activeStep={activeStep}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step className={myclass.root} key={label} {...stepProps}>
              <StepLabel className={myclass.label} {...labelProps}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box>
            {activeStep === 0 ? (
              <Box>
                <Box>
                  <label className={classes.label}> Choose a cover photo</label>
                  <div
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0,.1), rgba(0,0,0,.1)), url(${currImg})`,

                      borderRadius: "10px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "200px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <label htmlFor="upload" className={classes.upload}>
                      <input
                        id="upload"
                        className={classes.custom_file_input}
                        type="file"
                        // value={cover_img}
                        onChange={handleImgChange}
                      />
                      <BiPlusCircle />
                    </label>
                  </div>
                </Box>
                <br />
                <Box>
                  <label className={classes.label}>Enter party Name </label>
                  <TextField
                    variant="outlined"
                    size="small"
                    ref={nameRef}
                    value={partyName}
                    onChange={(e) => setpartyName(e.target.value)}
                    placeholder="Choose a party name"
                    fullWidth={true}
                  />
                </Box>
                <br />

                <Box>
                  <label className={classes.label}>Choose a category</label>
                  <Select
                    options={cards}
                    onChange={(e) => setCategory(e)}
                    placeholder="Select category"
                  />
                </Box>
                {/* <div className={classes.listContainer}>
                  {cards.map((c, id) => {
                    return (
                      <Box
                        display="flex"
                        gap="10px"
                        alignItems="center"
                        key={id}
                        onClick={() => setCategory(c.value)}
                        backgroundColor="#8800ff"
                        padding="10px"
                        borderRadius="4px"
                        color="#fff"
                      >
                        {c.icon}
                        {c.label}
                      </Box>
                    );
                  })}
                </div> */}
              </Box>
            ) : activeStep === 1 ? (
              <Box>
                <div>Fill all details Correctly</div>

                <br />
                <br />
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <DateTimePicker
                    label="Select start date and time"
                    value={start_date}
                    onChange={(e) => setStartDate(e._d)}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                  />
                  {/* <div className={classes.lgDate}>
                    <DesktopDatePicker
                      inputFormat="MM/dd/yyyy"
                      label="Select start date"
                      value={start_date}
                      onChange={(e) => setStartDate(e._d)}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                    />
                    <TimePicker
                      label="Select time"
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                    />
                  </div> */}
                  {/* <div className={classes.mobileDate}>
                    <MobileDatePicker
                      label="Select Start Date and time"
                      value={start_date}
                      onChange={(e) => setStartDate(e._d)}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                    />
                    <TimePicker
                      label="Select time"
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                    />
                  </div> */}
                </LocalizationProvider>
              </Box>
            ) : (
              <Box>
                <div
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0,.1), rgba(0,0,0,.1)), url(${currImg})`,

                    borderRadius: "10px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "200px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                ></div>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="10px"
                  marginTop="10px"
                >
                  <Box display="flex" alignItems="center" gap="10px">
                    <span className={classes.reviewIcon}>
                      {" "}
                      <BsTextareaT />
                    </span>
                    <span className={classes.reviewText}>{partyName}</span>
                  </Box>
                  <Box display="flex" alignItems="center" gap="10px">
                    <span className={classes.reviewIcon}>
                      <BiCategory />
                    </span>
                    <span className={classes.reviewText}>{category.label}</span>
                  </Box>
                  <Box display="flex" alignItems="center" gap="10px">
                    {" "}
                    <span className={classes.reviewIcon}>
                      <BsCalendarCheck />
                    </span>
                    <span className={classes.reviewText}>
                      {" "}
                      {moment(start_date).format("ddd, MMM DD YYYY hh:mm a")}
                    </span>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button
              disabled={!category}
              variant={activeStep === 2 ? "contained" : "outlined"}
              onClick={
                activeStep === steps.length - 1 ? handleImageUpload : handleNext
              }
            >
              {activeStep === steps.length - 1 ? "Start Party" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

const NewParty = () => {
  return (
    <Wrapper>
      <div className={classes.bc}>
        <HorizontalLinearStepper />
      </div>
    </Wrapper>
  );
};

export default NewParty;
