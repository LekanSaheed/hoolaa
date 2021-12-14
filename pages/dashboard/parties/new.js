import React, { useState } from "react";
import Wrapper from "../../../components/Wrapper";
import { motion } from "framer-motion";
const NewParty = () => {
  const [partyName, setpartyName] = useState("");
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState("");
  const [start_date, setStartDate] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [misc, setMisc] = useState("");
  return (
    <Wrapper>
      Start PArty
      <motion.div
        animate={{
          x: 0,
          backgroundColor: "#000",
          boxShadow: "10px 10px 0 rgba(0, 0, 0, 0.2)",
          position: "fixed",
          transitionEnd: {
            display: "block",
          },
        }}
      >
        Select
      </motion.div>
      <motion.a
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        style={{ x: 100 }}
      >
        Tap me
      </motion.a>
    </Wrapper>
  );
};

export default NewParty;
