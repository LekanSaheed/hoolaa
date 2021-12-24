import React, { useState } from "react";
import { Box } from "@mui/system";
import classes from "./PopParties.module.css";
import { Avatar, Button, Skeleton, useMediaQuery } from "@mui/material";
import { MdSpaceDashboard } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
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

const PopParties = () => {
  const { darkMode, isToggled } = useGlobalContext();
  // const parties = [
  //   {
  //     img: "Party 1",
  //     party_name: "My House Party",
  //     category: "House Party",
  //     address: "So so so",
  //     start_date: "Dec 25 2001",
  //     id: 1,
  //   },
  //   {
  //     img: "Party 1",
  //     party_name: "My House Party",
  //     category: "House Party",
  //     address: "So so so",
  //     start_date: "Dec 25 2001",
  //     id: 2,
  //   },
  //   {
  //     img: "Party 1",
  //     party_name: "My House Party",
  //     category: "House Party",
  //     address: "So so so",
  //     start_date: "Dec 25 2001",
  //     id: 3,
  //   },
  //   {
  //     img: "Party 1",
  //     party_name: "My House Party",
  //     category: "House Party",
  //     address: "So so so",
  //     start_date: "Dec 25 2001",
  //     id: 4,
  //   },
  //   {
  //     img: "Party 1",
  //     party_name: "My House Party",
  //     category: "House Party",
  //     address: "So so so",
  //     start_date: "Dec 25 2001",
  //     id: 5,
  //   },
  //   {
  //     img: "Party 1",
  //     party_name: "My House Party",
  //     category: "House Party",
  //     address: "So so so",
  //     start_date: "Dec 25 2001",
  //     id: 6,
  //   },
  //   {
  //     img: "Party 1",
  //     party_name: "My House Party",
  //     category: "House Party",
  //     address: "So so so",
  //     start_date: "Dec 25 2001",
  //     id: 7,
  //   },
  // ];
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const fetchParties = async () => {
      const myParties = [];
      const temp = [];
      const docRef = collection(db, "parties");
      const q = query(docRef, orderBy("created_At", "desc"), limit(10));
      onSnapshot(q, (snapshot) => {
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
        temp.forEach(async (t) => {
          const userDocRef = doc(db, "users", t.created_By);
          await getDoc(userDocRef).then(async (adoc) => {
            const newParty = myParties.map((p) => {
              return {
                ...p,
                creator: adoc.data(),
              };
            });
            setParties(newParty);
            setLoading(false);
            // console.log(newParty, "Py");
          });
        });
      });
    };
    fetchParties();
  }, []);

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
  return (
    <div className={`${classes.container}  `}>
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
        {parties.slice(0, 11).map((party, id) => {
          const address = `${party.location.street}, ${party.location.city} ${party.location.state}`;
          // if (address.length > 26) {
          //   address = address.slice(0, 26).concat("...");
          // }
          console.log(address.length);
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
              <Box display="flex" gap="14px" alignItems="center">
                <Avatar
                  src={party.creator.displayPics && party.creator.displayPics}
                  sx={{ width: 33, height: 33, fontSize: "14px" }}
                >
                  {!party.creator.displayPics &&
                    party.creator.username.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box display="flex" flexDirection="column" gap="3px">
                  <span className={classes.partyName}> {party.partyName}</span>
                  <span
                    className={` ${classes.location} ${
                      darkMode ? classes.darkLocation : ""
                    }`}
                  >
                    {`${party.location.city}, ${party.location.state}`}
                  </span>
                </Box>
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
                  <Avatar
                    sx={{ width: 20, height: 20, border: "solid 1px #8800ff" }}
                  ></Avatar>
                  <span
                    className={`${classes.people_number} ${
                      darkMode
                        ? classes.darkPeopleNumber
                        : "classes.people_number"
                    } `}
                  >
                    3 people attending
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
                    border="solid 1px #bababa"
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    alignItems="center"
                    gap="4px"
                    height="70px"
                    width="70px"
                  >
                    <span
                      style={{ textTransform: "uppercase", fontSize: "10px" }}
                    >
                      {" "}
                      {moment(party.start_date.toDate()).format("MMM")}
                    </span>
                    <span style={{ fontWeight: "600", fontSize: "18px" }}>
                      {" "}
                      {moment(party.start_date.toDate()).format("DD")}
                    </span>
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
