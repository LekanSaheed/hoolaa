import React, { useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../../../components/Wrapper";
import { db, getDoc, doc } from "../../../firebase/firebase";
import { Box } from "@mui/system";
import { Avatar } from "@mui/material";
import classes from "./party.module.css";
const Party = () => {
  const [party, setParty] = useState({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  React.useEffect(() => {
    const fetchParty = async () => {
      const docRef = doc(db, "parties", router.query.partyId);
      await getDoc(docRef)
        .then((doc) => {
          if (doc.exists) {
            setParty(doc.data());
            console.log(doc.data());
            setLoading(false);
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
        {router.query.partyId}
        {loading ? "Loading" : "Fetched"}
        {Object.entries(party).length > 0 && (
          <Box>
            <img
              className={classes.cover_img}
              src={party.cover_img}
              style={{ height: "200px", width: "100%", borderRadius: "6px" }}
            />
            <Avatar
              sx={{
                width: 100,
                height: 100,
                marginTop: "-50px",
                marginLeft: "6%",
                border: "solid 1px #8800ff",
              }}
            >
              H
            </Avatar>
          </Box>
        )}
      </Box>
    </Wrapper>
  );
};

export default Party;
