import React from "react";
import classes from "./AParty.module.css";
// import {useGlobalContext} from '../../context/context'
import { motion } from "framer-motion";
import { Avatar } from "@mui/material";
import moment from "moment";
import { Box } from "@mui/system";
import { BsPeopleFill } from "react-icons/bs";

const AParty = ({ party }) => {
  console.log(party);
  const boxVariant = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        // staggerChildren: 0.3,
      },
    },
  };

  const childrenVariant = {
    hidden: {
      opacity: 0,
      x: 10,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };
  return (
    <div className={classes.flex_container}>
      {/* Main item */}
      <motion.div
        initial="hidden"
        whileInView={"visible"}
        viewPort={{ once: true }}
        variants={boxVariant}
      >
        <motion.div
          className={classes.img_container}
          variants={childrenVariant}
        >
          <img src={party.cover_img} />
        </motion.div>
        <motion.div
          className={classes.party_details}
          variants={childrenVariant}
        >
          <motion.div className={classes.creator}>
            <Avatar
              src={party.creator.displayPics && party.creator.displayPics}
            >
              {party.creator.firstName.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box display="flex" flexDirection="column" gap="5px">
              <span className={classes.party_name}>{party.partyName}</span>
              <span className={classes.party_category}>
                {party.category.label}
              </span>
            </Box>
          </motion.div>

          {/* Date Here */}
          <div className={classes.date_container}>
            <div className={classes.date_container_flex_1}>
              <Box
                display="flex"
                gap="3px"
                flexDirection={"column"}
                width="20%"
              >
                <span className={classes.date_month}>
                  {moment(party.start_date.toDate()).format("MMM")}
                </span>
                <span className={classes.date_day}>
                  {" "}
                  {moment(party.start_date.toDate()).format("DD")}
                </span>
              </Box>
              <Box width="80%">
                <div> {moment(party.start_date.toDate()).format("dddd")}</div>
                <div>
                  {moment(party.start_date.toDate()).format("hh.mm a")} - End
                </div>
              </Box>
            </div>
            <div>GG</div>
          </div>

          {/* Date ends here */}
        </motion.div>
      </motion.div>
      {/* Second item starts */}
      <motion.div className={classes.main_details}>
        {" "}
        <div className={classes.attendee_container}>
          <div>
            <span className={`${classes.main_details_icon} ${classes.icon1}`}>
              <BsPeopleFill />
            </span>
            <div>Flex1</div>
          </div>
          <div>
            {" "}
            <span className={`${classes.main_details_icon} ${classes.icon2}`}>
              <BsPeopleFill />
            </span>
            <div>Flex2</div>
          </div>
        </div>
        <div></div>
      </motion.div>
      <div className={classes.footer}>
        <div> MEnus</div>
        <button className={classes.btn_menu}>VIew Menu</button>
      </div>
    </div>
  );
};

export default AParty;
