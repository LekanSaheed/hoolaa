import React, { useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../../../components/Wrapper";
import { db, getDoc, doc } from "../../../firebase/firebase";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import classes from "./party.module.css";
import moment from "moment";
import {
  BiCalendar,
  BiCalendarAlt,
  BiCalendarEvent,
  BiCategory,
  BiCategoryAlt,
} from "react-icons/bi";
import {
  HiLocationMarker,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineUsers,
  HiUsers,
} from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { BsCalendarWeek, BsCalendarWeekFill } from "react-icons/bs";
const Party = () => {
  const [party, setParty] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  React.useEffect(() => {
    const fetchParty = async () => {
      const docRef = doc(db, "parties", router.query.partyId);
      await getDoc(docRef)
        .then(async (doc_) => {
          if (doc_.exists) {
            const data = { ...doc_.data(), id: doc_.id };
            const docRef = doc(db, "users", data.created_By);
            await getDoc(docRef).then((_doc) => {
              // console.log(_doc.data());
              const newData = { ...data, creator: _doc.data() };
              console.log(newData);
              setParty(newData);
              setLoading(false);
            });
          } else {
            setLoading(false);
            console.log("Doesnt exist");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    };
    fetchParty();
  }, []);
  return (
    <Wrapper>
      <Box padding="7px">
        {Object.entries(party).length > 0 && (
          <>
            <div className={classes.partyGroup}>
              <img
                className={classes.cover_img}
                src={party.cover_img}
                // style={{ height: "200px", width: "50%", borderRadius: "6px" }}
              />

              <Box
                padding="10px 25px"
                gap="10px"
                display="flex"
                flexDirection="column"
              >
                <Box display="flex" gap="10px">
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    src={party.creator.displayPics && party.creator.displayPics}
                  >
                    {!party.creator.displayPics &&
                      party.creator.username.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box display="flex" flexDirection="column" gap="10px">
                    <span className={classes.party_name}>
                      {party.partyName}
                    </span>
                    <span className={classes.username}>
                      {" "}
                      @{party.creator.username}
                    </span>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    {" "}
                    <HiUsers />
                  </span>
                  {party.reservers ? party.reservers.length : "0"} People
                  attending
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  {" "}
                  <span className={classes.icon}>
                    <MdCategory />
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {party.category.label}
                  </span>
                </Box>

                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <BsCalendarWeekFill />
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {moment(party.start_date.toDate()).format(
                      "ddd, MMM DD YYYY hh:mm:a"
                    )}
                  </span>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <HiLocationMarker />
                  </span>
                  <span style={{ fontWeight: "600" }}>{party.location}</span>
                </Box>
              </Box>
            </div>
            <div className={classes.menuContainer}>
              <span
                style={{ fontWeight: "600" }}
                className={classes.menu_header}
              >
                Menu
              </span>
            </div>
          </>
        )}
      </Box>
    </Wrapper>
  );
};

export default Party;
