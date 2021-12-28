import React, { useState } from "react";
import { Box } from "@mui/system";
import classes from "./PopParties.module.css";
import { Avatar, Skeleton, useMediaQuery, Button } from "@mui/material";
// import { Button } from "@m-ui/core";
import { MdSpaceDashboard } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { BsDot, BsFillCalendar2WeekFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  getDocs,
  db,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "../firebase/firebase";
import Image from "next/image";
import moment from "moment";
import { useGlobalContext } from "../context/context";
import { BiCheck } from "react-icons/bi";
import { async } from "@firebase/util";
import ActiveNotifier from "./ActiveNotifier";
import { useAuthState } from "../context/AuthContext";

const PopParties = () => {
  const { darkMode, isToggled } = useGlobalContext();
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { user } = useAuthState();
  React.useEffect(() => {
    const token = user.user.token;

    const fetchParties = async () => {
      // await fetch("http://localhost:3000/api/hello", {
      //   method: "GET",
      //   headers: {
      //     authorization: "lekansaheed@prodeveloperforlife",
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      const myParties = [];
      const temp = [];
      const docRef = collection(db, "parties");
      // const q = query(docRef, orderBy("created_At", "desc"), limit(10));
      const q = docRef;
      onSnapshot(q, async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          parties = [];
          if (change.type === "added") {
            const data = { ...change.doc.data(), id: change.doc.id };
            await temp.push(data);
            await myParties.push(data);

            // console.log(myParties);
          }
          if (change.type === "modified") {
            const data = { ...change.doc.data(), id: change.doc.id };

            let ind = temp.findIndex((t) => t.id === data.id);
            temp[ind] = data;
            myParties[ind] = data;
            //  const newTemp = temp.filter((t) => t.id !== data.id);
            // console.log(ind);

            // temp = newTemp;
            // console.log(newTemp);
            // const newParties = myParties.filter((t) => t.id !== data.id);
            // myParties = newParties;
            // temp.push(data);
            // myParties.push(data);
            console.log("MOdified", data);
          }
          if (change.type === "removed") {
            const data = { ...change.doc.data(), id: change.doc.id };
            const newTemp = temp.filter((t) => t.id !== data.id);
            temp = newTemp;
            const newParties = myParties.filter((t) => t.id !== data.id);
            myParties = newParties;
          }
        });
        const res = [];
        function shuffle(array) {
          let currentIndex = array.length,
            randomIndex;

          // While there remain elements to shuffle...
          while (currentIndex != 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
              array[randomIndex],
              array[currentIndex],
            ];
          }

          return array;
        }

        await temp.forEach(async (t) => {
          // const creator = {};
          const userDocRef = doc(db, "users", t.created_By);
          await getDoc(userDocRef)
            .then(async (adoc) => {
              const creator = adoc.data();
              res.push({ ...t, creator: creator });
            })
            .catch((err) => console.log(err));
        });
        const setItems = async () => {
          setParties(shuffle(res));
        };
        setTimeout(() => {
          setItems();
          setLoading(false);
        }, 600);
      });
    };
    fetchParties();
  }, []);
  console.log(parties);
  const HoolaSkels = () => {
    return (
      <Box padding="10px">
        <Skeleton
          variant="rectangular"
          style={{ borderRadius: "10px" }}
          height={200}
        />
        <Box display="flex" marginTop="10px" flexDirection="column" gap="16px">
          <Box display="flex" gap="15px" alignItems="center">
            <Skeleton variant="circular" height={40} width={40} />
            <Skeleton
              variant="text"
              width={Math.floor(Math.random() * 100) + 70}
            />
          </Box>

          <Box display="flex" gap="8px" alignItems="center">
            <Skeleton variant="circular" height={20} width={20} />
            <Skeleton variant="text" width={85} />
          </Box>

          <Box display="flex" flexDirection="column">
            <Box display="flex" gap="15px" width="100%">
              <Skeleton
                variant="rectangular"
                style={{ borderRadius: "10px" }}
                height={30}
                width={60}
              />
              <Skeleton
                variant="rectangular"
                height={30}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  borderRadius: "10px",
                }}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" gap="15px" width="100%">
              <Skeleton
                style={{ borderRadius: "10px" }}
                variant="rectangular"
                height={30}
                width={60}
              />
              <Skeleton
                variant="rectangular"
                height={30}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" gap="15px" width="100%">
              <Skeleton
                style={{ borderRadius: "10px" }}
                variant="rectangular"
                height={30}
                width={60}
              />
              <Skeleton
                variant="rectangular"
                height={30}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };
  const matches = useMediaQuery("(min-width: 801px)");
  console.log(parties.slice(0, 10), "Slice");
  return (
    <div className={`${classes.container}  `}>
      <Button variant="contained" size="large">
        LOL
      </Button>
      <Box display="flex" justifyContent="space-between">
        Pop Parties <button className={classes.btn_see}> See All</button>
      </Box>
      <motion.div
        className={` ${classes.party_container} ${
          darkMode ? classes.darkContainer : classes.lightContainer
        } ${!isToggled && matches ? classes.expand_panel : ""}`}
      >
        {loading && !isLoaded && (
          <>
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
            <HoolaSkels />
          </>
        )}
        {!loading && parties.length < 1 && (
          <Box>
            No parties for now
            <Button
              style={{ background: "#8800ff", borderRadius: "20px" }}
              onClick={() => router.push("/dashboard/parties/new")}
              variant="contained"
            >
              Create a party
            </Button>
          </Box>
        )}{" "}
        {parties.length === 0 && !loading && "No parties"}
        {parties.slice(0, 10).map((party, id) => {
          const address = `${party.location.street}, ${party.location.city} ${party.location.state}`;
          // if (address.length > 26) {
          //   address = address.slice(0, 26).concat("...");
          // }

          return (
            <motion.div
              // initial={{ opacity: 0 }}
              // whileInView={{ opacity: 1 }}
              // viewport={{ once: true }}
              // animate={{
              //   scale: 1,
              //   opacity: 1,
              // }}
              // transition={{ duration: 0.2, delay: id - 0.9 }}
              key={id}
              className={`${classes.party} ${
                darkMode ? classes.darkParty : ""
              }`}
              onClick={() => router.push("/dashboard/parties/" + party.id)}
            >
              <Box display="flex" justifyContent="space-between">
                {" "}
                <Box display="flex" gap="14px" alignItems="center">
                  <Avatar
                    src={party.creator.displayPics && party.creator.displayPics}
                    sx={{ width: 33, height: 33, fontSize: "14px" }}
                  >
                    {!party.creator.displayPics &&
                      party.creator.username.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box display="flex" flexDirection="column" gap="3px">
                    <span className={classes.partyName}>
                      {" "}
                      {party.partyName}
                    </span>
                    <span
                      className={` ${classes.location} ${
                        darkMode ? classes.darkLocation : ""
                      }`}
                    >
                      {`${party.location.city}, ${party.location.state}`}
                    </span>
                  </Box>
                </Box>
                {party.isStarted && !party.isEnded && (
                  <ActiveNotifier />
                  // <BsDot style={{ color: "green", fontSize: "39px" }} />
                )}
                {party.isEnded && (
                  <BsDot style={{ color: "red", fontSize: "39px" }} />
                )}
                {!party.isStarted && (
                  <BsDot style={{ color: "goldenrod", fontSize: "39px" }} />
                )}
              </Box>
              <div className={classes.cover_img}>
                <img
                  onLoad={() => setIsLoaded(true)}
                  src={party.cover_img}
                  alt={party.partyName}
                />
              </div>

              <Box
                display="flex"
                flexDirection="column"
                gap="5px"
                marginTop="10px"
              >
                <Box display="flex" gap="8px" alignItems="center">
                  <Box display="flex">
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        border: "solid 1px #8800ff",
                      }}
                    ></Avatar>
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        marginLeft: "-6px",
                        border: "solid 1px #8800ff",
                      }}
                    ></Avatar>
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        marginLeft: "-6px",
                        border: "solid 1px #8800ff",
                      }}
                    ></Avatar>
                  </Box>
                  <span
                    className={`${classes.people_number} ${
                      darkMode
                        ? classes.darkPeopleNumber
                        : "classes.people_number"
                    } `}
                  >
                    {party.isStarted && !party.isEnded
                      ? `${
                          Math.floor(Math.random() * 100) + 70
                        } people in party`
                      : party.isEnded
                      ? `${
                          Math.floor(Math.random() * 100) + 70
                        } people attended this party`
                      : `${
                          Math.floor(Math.random() * 100) + 70
                        } people attending`}
                  </span>
                </Box>
                <Box display="flex" gap="5px">
                  <Box
                    display="flex"
                    width="75%"
                    flexDirection="column"
                    gap="5px"
                  >
                    <Box display="flex" flexDirection="column">
                      <Box display="flex" gap="10px" width="100%">
                        <i
                          className={`${classes.party_list_icon} ${classes.icon1}`}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MdSpaceDashboard />
                        </i>{" "}
                        <div
                          style={{ fontWeight: "600" }}
                          className={classes.partyList}
                        >
                          {party.category.label}
                        </div>
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <Box display="flex" gap="10px" width="100%">
                        <i
                          className={`${classes.party_list_icon} ${classes.icon2}`}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <ImLocation2 />
                        </i>{" "}
                        <div
                          className={`${classes.partyList} ${classes.address}`}
                        >
                          {address}
                        </div>
                      </Box>
                    </Box>
                    {/* <Box display="flex" flexDirection="column">
                      <Box display="flex" gap="10px" width="100%">
                        <i
                          className={`${classes.party_list_icon} ${classes.icon3}`}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <BsFillCalendar2WeekFill />
                        </i>{" "}
                        <div className={classes.partyList}>
                          {moment(party.start_date.toDate()).format(
                            "ddd, MMM DD, YYYY @hh:mm a"
                          )}
                        </div>
                      </Box>
                    </Box> */}
                  </Box>
                  <Box
                    borderRadius="10px"
                    border={!party.isEnded ? "solid 1px #bababa" : "none"}
                    height="70px"
                    width="70px"
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                  >
                    {party.isStarted && !party.isEnded ? (
                      <div>
                        <BiCheck style={{ fontSize: "30px", color: "green" }} />
                      </div>
                    ) : party.isEnded ? (
                      <Box
                        style={{
                          padding: "4px",
                          color: "red",
                          border: "solid 1px red",
                          borderRadius: "10px",
                        }}
                      >
                        OVER
                      </Box>
                    ) : (
                      <Box
                        display="flex"
                        justifyContent="center"
                        flexDirection="column"
                        alignItems="center"
                        gap="4px"
                      >
                        <span
                          style={{
                            textTransform: "uppercase",
                            fontSize: "10px",
                          }}
                        >
                          {" "}
                          {moment(party.start_date.toDate()).format("MMM")}
                        </span>
                        <span style={{ fontWeight: "600", fontSize: "18px" }}>
                          {" "}
                          {moment(party.start_date.toDate()).format("DD")}
                        </span>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default PopParties;
