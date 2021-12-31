import { async } from "@firebase/util";
import { Avatar } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Wrapper from "../../../components/Wrapper";
import {
  onSnapshot,
  collection,
  db,
  getDoc,
  doc,
} from "../../../firebase/firebase";
const Parties = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onGoingParties, setOngoingParties] = useState([]);
  useEffect(() => {
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
          setParties(res);
          setOngoingParties(
            res.filter((t) => t.isStarted && t.isEnded === false)
          );
        };
        setTimeout(() => {
          setItems();
          setLoading(false);
        }, 600);
      });
    };
    fetchParties();
  }, []);
  // const fetchUser = async (id) => {
  //   let data = {};
  //   const docRef = doc(db, "users", id);
  //   await getDoc(docRef).then(async (m) => {
  //     // console.log(m.data());
  //     // console.log(doc.data());
  //     data = {
  //       ...m.data(),
  //       id: m.data().id,
  //     };
  //   });
  //   // console.log(data);
  //   return data;
  // };

  return (
    <Wrapper>
      Ongoing Parties.
      <Box display="flex" gap="10px" flexWrap="nowrap" overflow="scroll">
        {onGoingParties.length > 0 &&
          onGoingParties.map((party) => {
            return (
              <Box
                key={party.id}
                display="flex"
                flexDirection="column"
                gap="5px"
              >
                <Avatar
                  variant="rounded"
                  sx={{ width: 100, height: 100, border: "solid 1px " }}
                  src={party.cover_img}
                />
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {party.partyName}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  @{party.creator.username}
                </span>
              </Box>
            );
          })}
      </Box>
      <Box display="flex" flexDirection="column" gap="13px" padding="13px">
        {parties.length > 0 &&
          parties.map((party) => {
            let data = {};

            return (
              <Box key={party.id}>
                <Box display="flex" gap="10px" alignItems="center">
                  <Avatar variant="rounded" src={party.cover_img} />
                  <Box display="flex" flexDirection="column" gap="3px">
                    <span>{party.partyName}</span>
                    <span style={{ fontWeight: "400", fontSize: "13px" }}>
                      @{party.creator.username}
                    </span>
                    <span style={{ fontWeight: "400", fontSize: "12px" }}>
                      3k
                    </span>
                  </Box>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Wrapper>
  );
};

export default Parties;
