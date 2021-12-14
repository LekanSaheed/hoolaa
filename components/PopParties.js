import React from "react";
import { Box } from "@mui/system";
import classes from "./PopParties.module.css";
import { Avatar } from "@mui/material";
import { MdSpaceDashboard } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { BsFillCalendar2WeekFill } from "react-icons/bs";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
const PopParties = () => {
  const parties = [
    {
      img: "Party 1",
      party_name: "My House Party",
      category: "House Party",
      address: "So so so",
      start_date: "Dec 25 2001",
      id: 1,
    },
    {
      img: "Party 1",
      party_name: "My House Party",
      category: "House Party",
      address: "So so so",
      start_date: "Dec 25 2001",
      id: 2,
    },
    {
      img: "Party 1",
      party_name: "My House Party",
      category: "House Party",
      address: "So so so",
      start_date: "Dec 25 2001",
      id: 3,
    },
    {
      img: "Party 1",
      party_name: "My House Party",
      category: "House Party",
      address: "So so so",
      start_date: "Dec 25 2001",
      id: 4,
    },
    {
      img: "Party 1",
      party_name: "My House Party",
      category: "House Party",
      address: "So so so",
      start_date: "Dec 25 2001",
      id: 5,
    },
    {
      img: "Party 1",
      party_name: "My House Party",
      category: "House Party",
      address: "So so so",
      start_date: "Dec 25 2001",
      id: 6,
    },
    {
      img: "Party 1",
      party_name: "My House Party",
      category: "House Party",
      address: "So so so",
      start_date: "Dec 25 2001",
      id: 7,
    },
  ];
  const router = useRouter();
  return (
    <div className={classes.container}>
      <Box display="flex" justifyContent="space-between">
        Pop Parties <button className={classes.btn_see}> See All</button>
      </Box>
      <motion.div className={classes.party_container}>
        {parties.map((party, id) => {
          return (
            <motion.div
              initial={{ opacity: 0.5, scale: 0 }}
               whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
              animate={{
                x: 0,
                scale: 1,
                opacity: 1,
                transitionEnd: {
                  display: "block",
                },
              }}
              transition={{ duration: 0.3, delay: id - 0.7 }}
              key={id}
              className={classes.party}
              onClick={() => router.push("/dashboard/parties/" + party.id)}
            >
              <div style={{ height: "200px" }}>{party.img + party.id}</div>
              <Box display="flex" flexDirection="column" gap="16px">
                <Box display="flex" gap="15px" alignItems="center">
                  <Avatar sx={{ width: 40, height: 40 }}>P</Avatar>
                  {party.party_name}
                </Box>
                <Box display="flex" gap="8px" alignItems="center">
                  <Avatar sx={{ width: 20, height: 20 }}></Avatar>
                  <span className={classes.people_number}>
                    0 people in party
                  </span>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" gap="15px" width="100%">
                    <i
                      className={classes.party_list_icon}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MdSpaceDashboard />
                    </i>{" "}
                    <div className={classes.partyList}>{party.category}</div>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" gap="15px" width="100%">
                    <i
                      className={classes.party_list_icon}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ImLocation2 />
                    </i>{" "}
                    <div className={classes.partyList}>{party.address}</div>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" gap="15px" width="100%">
                    <i
                      className={classes.party_list_icon}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <BsFillCalendar2WeekFill />
                    </i>{" "}
                    <div className={classes.partyList}>{party.address}</div>
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
