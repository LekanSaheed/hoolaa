import React, { useState, useRef, useEffect } from "react";
import Wrapper from "../../../components/Wrapper";
import { motion } from "framer-motion";
import classes from "./newParty.module.css";
import { BsGrid, BsListUl } from "react-icons/bs";
import ColorTabs from "../../../components/MultiForm";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { TextField } from "@material-ui/core";
import { LocalizationProvider, MobileDatePicker } from "@mui/lab";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import DateAdapter from "@mui/lab/AdapterMoment";
import DateTimePicker from "@mui/lab/DateTimePicker";

const steps = ["Select Category", "Input party details", "Review"];

function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [partyName, setpartyName] = useState("");
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState("");
  const [start_date, setStartDate] = useState(new Date());
  const [isPrivate, setIsPrivate] = useState(false);
  const [misc, setMisc] = useState("");
  const [toggled, setToggled] = useState(false);

  const nameRef = useRef(null);
  const cards = [
    { label: "House Party", value: "house_party" },
    { label: "Street Party", value: "street_party" },
    { label: "Carnival", value: "carnival" },
    { label: "Club Party", value: "club_party" },
    { label: "Wedding Party", value: "wedding_party" },
    { label: "Weekend Party", value: "weekend_party" },
    { label: "Get-Together Party", value: "get_together_party" },
    { label: "Beach Party", value: "beach_party" },
  ];
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
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
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
              "Select Cateogry"
            ) : activeStep === 1 ? (
              <Box>
                <div>Fill all details Correctly</div>
                <TextField
                  ref={nameRef}
                  value={partyName}
                  onChange={(e) => setpartyName(e.target.value)}
                  label="Party Name"
                  placeholder="Choose a party name"
                  fullWidth={true}
                />
                <br />
                <br />
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <div className={classes.lgDate}>
                    <DateTimePicker
                      label="Select Start Date and time"
                      value={start_date}
                      onChange={(e) => setStartDate(e)}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                    />
                  </div>
                  <div className={classes.mobileDate}>
                    <MobileDatePicker
                      label="Select Start Date and time"
                      value={start_date}
                      onChange={(e) => setStartDate(e)}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" />
                      )}
                    />
                  </div>
                </LocalizationProvider>
              </Box>
            ) : (
              "Select medium"
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

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
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
