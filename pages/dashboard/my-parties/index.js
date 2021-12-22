import React, { useState } from "react";
import {
  db,
  collection,
  query,
  where,
  limit,
  orderBy,
  onSnapshot,
} from "../../../firebase/firebase";
import classes from "./myParties.module.css";
import { useAuthState } from "../../../context/AuthContext";
import Wrapper from "../../../components/Wrapper";
import { async } from "@firebase/util";
import { Box } from "@mui/system";
import { Avatar, Skeleton } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";

const MyParties = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();
  React.useEffect(() => {
    const docRef = collection(db, "parties");
    const q = query(
      docRef,
      where("created_By", "==", user.user.uid)
      //   orderBy("created_At", "desc")
    );
    const _parties = [];
    onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = { ...change.doc.data(), id: change.doc.id };

            await _parties.push(data);
            setParties(_parties);
            console.log(parties);
            setLoading(false);
          }
        });
      },
      (err) => {
        console.log(err.message);
      }
    );
  }, []);

  const router = useRouter();
  const HoolaaSkels = () => {
    return (
      <Box display="flex" padding="20px 10px">
        <Box width="40%" display="flex" gap="15px" alignItems="center">
          <Box>
            {" "}
            <Skeleton
              style={{ borderRadius: "4px" }}
              variant="rectangular"
              height={51}
              width={51}
            />
          </Box>
          <Box width="100%" display="flex" flexDirection="column" gap="6px">
            <Skeleton width={Math.floor(Math.random() * 120) + 65} />
            <Skeleton width={Math.floor(Math.random() * 70) + 50} />
          </Box>
        </Box>
        <Box
          width="60%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box width="50%">
            <Skeleton width={20} />
          </Box>
          <Box width="50%">
            <Skeleton width={20} />
          </Box>

          <Box width="50%">
            {" "}
            <Skeleton width={Math.floor(Math.random() * 100) + 30} />
          </Box>
        </Box>
      </Box>
    );
  };
  const SkelHeader = () => {
    return (
      <Box display="flex" padding="20px 0" fontWeight="600">
        <Box width="40%">
          <Skeleton width={60} />
        </Box>
        <Box display="flex" width="60%">
          <Box width="50%">
            <Skeleton width={60} />
          </Box>
          <Box width="50%">
            <Skeleton width={70} />
          </Box>
          <Box width="50%">
            <Skeleton width={50} />
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <Wrapper>
      <div className={classes.container}>
        {!loading && (
          <Box display="flex" padding="20px 0" fontWeight="600">
            <Box width="40%">Party</Box>
            <Box display="flex" width="60%">
              <Box width="50%">Menus</Box>
              <Box width="50%">No of People</Box>
              <Box width="50%">Date</Box>
            </Box>
          </Box>
        )}
        <div className={classes.flex1}>
          {loading && (
            <>
              <SkelHeader />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
              <HoolaaSkels />
            </>
          )}
          {parties.length > 0 &&
            parties.map((party) => {
              return (
                <Box
                  key={party.id}
                  display="flex"
                  padding="20px 10px"
                  className={classes.party}
                  onClick={() => router.push(`${router.pathname}/${party.id}`)}
                >
                  <Box
                    width="40%"
                    key={party.id}
                    display="flex"
                    gap="15px"
                    alignItems="center"
                  >
                    <Avatar
                      src={party.cover_img}
                      sx={{ height: 50, width: 50, borderRadius: "6px" }}
                    />{" "}
                    <Box
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      gap="6px"
                    >
                      <span
                        style={{ fontWeight: "bold", color: "rgba(0,0,0,.8)" }}
                      >
                        {" "}
                        {party.partyName}
                      </span>
                      <span style={{ color: "#636467", fontSize: "13px" }}>
                        {" "}
                        {party.category.label}
                      </span>
                      {/* <span> {party.location}</span>
                    <span>
                      {" "}
                      {moment(party.start_date.toDate()).format(
                        "ddd, MMM DD, YYYY "
                      )}
                    </span> */}
                    </Box>
                  </Box>
                  <Box
                    width="60%"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box width="50%">
                      {party.menus ? party.menus.length : "-"}
                    </Box>
                    <Box width="50%">
                      {party.reservers ? party.reservers.length : "0"}
                    </Box>

                    <Box width="50%">
                      {" "}
                      {moment(party.start_date.toDate()).format(
                        "ddd, MMM DD, YYYY "
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
        </div>
      </div>
    </Wrapper>
  );
};

export default MyParties;
