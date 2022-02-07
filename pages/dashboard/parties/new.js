import React, { useState, useRef, useEffect } from "react";
import Wrapper from "../../../components/Wrapper";
import { motion } from "framer-motion";
import ThemedSelect from "../../../components/ThemedSelect";
import classes from "./newParty.module.css";
import { BsCalendarCheck, BsTextareaT } from "react-icons/bs";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { TextField, makeStyles } from "@material-ui/core";
import Select, { components } from "react-select";
import {
  DesktopDatePicker,
  LocalizationProvider,
  MobileDatePicker,
  TimePicker,
} from "@mui/lab";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
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
import { BiCategory, BiDish, BiPlusCircle, BiArrowBack } from "react-icons/bi";
import moment from "moment";
import { MdAccountCircle } from "react-icons/md";
import HoolaLoader from "../../../components/HoolaLoader";
import states from "../../../components/state";
import { ImLocation } from "react-icons/im";
import { IoFastFoodOutline, IoPizzaOutline } from "react-icons/io5";
import { GiWineBottle } from "react-icons/gi";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../../context/context";
function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [partyName, setpartyName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [start_date, setStartDate] = useState(new Date());
  const [isPrivate, setIsPrivate] = useState(null);
  const [cover_img, setCoverImg] = useState(null);
  const [currImg, setCurrentImg] = useState(null);
  const [misc, setMisc] = useState("");
  const [toggled, setToggled] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [partyUrl, setPartyUrl] = useState("");

  const [menus, setMenus] = useState([]);
  const { darkMode } = useGlobalContext();
  const steps = ["", "", ""];
  const [loading, setLoading] = useState(false);
  const menuCategories = [
    { label: "Food", value: "food", icon: <IoFastFoodOutline /> },
    { label: "Drinks", value: "drink", icon: <GiWineBottle /> },
    { label: "Dessert", value: "dessert", icon: <IoPizzaOutline /> },
    { label: "Side Dishes", value: "side_dishes", icon: <BiDish /> },
  ];

  const { Option } = components;
  const IconOption = (props) => (
    <Option {...props}>
      <Box display="flex" justifyContent="space-between" gap="10px">
        {" "}
        {props.data.label}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {props.data.icon}
        </span>
      </Box>
    </Option>
  );
  const router = useRouter();
  const naijaStates = states.map((s) => {
    return {
      label: s,
      value: s.toLowerCase(),
    };
  });
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
    { label: "Festival", value: "festival", icon: <GiPartyFlags /> },
    { label: "Concert", value: "concert", icon: <GiPartyFlags /> },
    { label: "Re-Union", value: "reunion", icon: <GiPartyFlags /> },
  ];

  const handleImgChange = (e) => {
    const img = e.target.files[0];
    setCurrentImg(URL.createObjectURL(img));
    // console.log(currImg);
    setCoverImg(img);
    // console.log(img);
  };

  const createParty = (url) => {
    function makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    const docRef = collection(db, "parties");
    addDoc(
      docRef,
      {
        cover_img: url,
        category: { label: category.label, value: category.value },
        start_date: myTimestamp,
        partyName,
        location: {
          street: street.trim(),
          city: city.trim(),
          state: state.label,
        },
        isPrivate,
        isStarted: false,
        created_At: Timestamp.fromDate(new Date()),
        created_By: user.user.uid,
        code: [{ type: "party_code", code: makeid(7) }],
      },
      { merge: true }
    )
      .then((newRef) => {
        setLoading(false);
        const notifRef = collection(db, "notifications");
        addDoc(notifRef, {
          userId: user.user.uid,
          type: "event_add",
          notification: {
            header: `New party created`,
            body: `You created a ${
              category.label
            } (${partyName}) and it is scheduled to start at: ${moment(
              start_date
            ).format("ddd, MMM DD, YYYY hh:mm:a")}`,
            attachment: null,
          },
          created_At: Timestamp.fromDate(new Date()),
          read: false,
        });
        setPartyUrl(newRef.id);
        toast.success("Party Created Successfully");
        handleNext();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };
  const handleImageUpload = () => {
    setLoading(true);
    const storage = getStorage();
    const storageRef = ref(
      storage,
      "cover-images/" + cover_img.name + new Date().getTime().toString()
    );
    const metadata = {
      contentType: "image/jpeg",
      size: cover_img.size,
    };
    // const handleMenuImages = (img) => {
    //   const menuImgRef = ref(storage, "menu-images/" + img.name);
    //   const uploadTask = uploadBytes(menuImgRef, img, metadata);
    //   uploadTask.then((snapshot) => {
    //     getDownloadURL(menuImgRef).then((url) => {
    //       console.log(url);
    //     });
    //   });
    // };
    const uploadTask = uploadBytes(storageRef, cover_img, metadata);

    uploadTask.then((snapshot) => {
      console.log(snapshot);
      getDownloadURL(storageRef).then((url) => {
        createParty(url);
        console.log(url);
      });
      console.log("Uploaded a blob or file!");
    });
  };

  const handleNext = () => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
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
      "& .MuiStepLabel-label": {
        color: darkMode ? "#efefef" : "initial",
        [theme.breakpoints.down(767)]: {
          fontSize: "10px !important",
        },
      },
      "& .MuiStepIcon-root.MuiStepIcon-active": {
        color: "#8800ff",
      },
      "& .MuiStepper-root": {
        marginBottom: "20px !important",
        background: darkMode ? "#242526" : "#fff",
        [theme.breakpoints.down(767)]: {
          padding: "0px !important",
        },
      },
      "& .MuiOutlinedInput-marginDensed": {
        outline: "none",
        border: "none",
      },
      "& .MuiStepIcon-root.MuiStepIcon-completed": {
        color: "#5cb85c !important",
      },
      "& .Mui-focused": {
        border: "none !important",

        outline: "none !important",
      },
      "& .MuiInputBase-root": {
        fontFamily: "Montserrat !important",
        color: darkMode ? "#efefef" : "#00000087",
        background: darkMode ? "#373737ff" : "initial",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#a7a7a7  !important",
        // backgroundColor: "red",
        outline: "none",
        borderRadius: "10px",
      },

      "& .css-1u4zpwo-MuiSvgIcon-root-MuiStepIcon-root": {
        // color: "#8800ff",
        [theme.breakpoints.down(767)]: {
          width: "0.5em !important",
          height: "0.5em !important",
        },
      },
    },
    border: {
      // borderColor: "#8800ff !important",
      fontFamily: "washeim !important",
      "& .MuiOutlinedInput-notchedOutline": {},
    },
    label: {
      fontSize: "10px !important",
    },
  }));
  const myclass = useStyles();
  var myTimestamp = Timestamp.fromDate(start_date);
  console.log(category);
  const { user } = useAuthState();
  const handleChange = (e) => {
    setIsPrivate(e.target.value);
  };
  console.log(isPrivate);
  return (
    <Box
      borderRadius="10px"
      padding="10px"
      sx={{ width: "100%" }}
      className={myclass.root}
    >
      {/* <HoolaLoader /> */}
      {loading && <HoolaLoader />}
      <Stepper
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          padding: "10px",
          marginBottom: "20px",
        }}
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
          <div className={classes.img_con}>
            <img src="/done.svg" />
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "600",
              padding: "15px",
            }}
          >
            Congrats!!! your Party has been created. Proceed to setting your
            reservations.
          </div>
          <Box
            display="flex"
            position="absolute"
            bottom="60px"
            justifyContent="space-between"
            sx={{ flex: "1 1 auto" }}
            paddingTop="10px"
            width="100%"
          >
            <Button
              color="primary"
              style={{ border: "solid 2px #8800ff", color: "#8800ff" }}
              onClick={handleReset}
            >
              <BiArrowBack />
            </Button>
            <Button
              color="primary"
              style={{ background: "#8800ff", color: "#fff" }}
              onClick={() => router.push(`/dashboard/my-parties/${partyUrl}`)}
            >
              Set Reservation
            </Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
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
                  <label className={classes.label}>Party Name </label>
                  <input
                    className={classes.input}
                    ref={nameRef}
                    value={partyName}
                    onChange={(e) => setpartyName(e.target.value)}
                    placeholder="Choose a party name"
                  />
                </Box>
                <br />

                <Box>
                  <label className={classes.label}>Category</label>
                  <ThemedSelect
                    value={category}
                    options={cards}
                    onChange={(e) => setCategory(e)}
                    components={{ Option: IconOption }}
                    placeholder="Select category"
                    // getOptionLabel={e => (
                    //   <div style={{display: 'flex', alignItems: 'center'}}
                    // )}
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
                <br />
                <FormControl component="fieldset">
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="controlled-radio-buttons-group"
                    value={isPrivate}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio />}
                      label="Private"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio />}
                      label="Public"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            ) : activeStep === 1 ? (
              <Box>
                <div>Fill all details Correctly</div>

                <br />
                <br />
                <div className={classes.flex_gap}>
                  <div>
                    <label className={classes.label}>
                      {" "}
                      Start date and time
                    </label>
                    <LocalizationProvider dateAdapter={DateAdapter}>
                      <DateTimePicker
                        value={start_date}
                        onChange={(e) => setStartDate(e._d)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <label className={classes.label}> Street</label>
                    <input
                      required
                      className={classes.input}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Street"
                    />
                  </div>
                  <div>
                    <label className={classes.label}>City</label>
                    <input
                      className={classes.input}
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className={classes.label}>State</label>
                    <ThemedSelect
                      options={naijaStates}
                      value={state}
                      onChange={(e) => setState(e)}
                    />
                  </div>
                </div>
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
                  <Box display="flex" alignItems="center" gap="10px">
                    {" "}
                    <span className={classes.reviewIcon}>
                      <ImLocation />
                    </span>
                    <span className={classes.reviewText}>
                      {`${street.trim()} ${city.trim()} ${state.value}`}
                    </span>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            marginTop="16px"
            sx={{
              display: "flex",
              flexDirection: "row",
              pt: 2,
              justifyContent: "space-between",
            }}
          >
            {
              activeStep !== 0 && (
                <Button
                  color="primary"
                  style={{
                    border: "solid 2px #8800ff",
                    color: "#8800ff",
                    padding: "9px 17px",
                    borderRadius: "8px !important",
                  }}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  <BiArrowBack />
                </Button>
              )
              // <Box sx={{ flex: "1 1 auto" }} />
            }

            <Button
              fullWidth={activeStep === 0 ? true : false}
              color="primary"
              style={{
                padding: "9px 35px",
                borderRadius: "8px !important",
                fontFamily: "Delius, Montserrat",
                background:
                  !category || isPrivate === null || !partyName || !cover_img
                    ? "efefef"
                    : "#8800ff",
                color: "#fff",
              }}
              disabled={
                !category || isPrivate === null || !partyName || !cover_img
              }
              variant={"contained"}
              onClick={
                activeStep === steps.length - 1 ? handleImageUpload : handleNext
              }
            >
              {activeStep === steps.length - 1 ? "Start Party" : "Continue"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

const NewParty = () => {
  const { darkMode } = useGlobalContext();
  return (
    <Wrapper>
      <div className={`${classes.bc} ${darkMode ? classes.darkBc : ""}`}>
        <HorizontalLinearStepper />
      </div>
    </Wrapper>
  );
};

export default NewParty;
