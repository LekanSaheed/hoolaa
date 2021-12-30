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
  useEffect(() => {
    const fetchAll = async () => {
      const ref = collection(db, "parties");
      const _parties = [];
      onSnapshot(ref, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const data = { ...change.doc.data(), id: change.doc.id };
            const newParty = [];
            await _parties.push(data);
            _parties.forEach((party) => {
              const fetchUser = async () => {
                const docRef = doc(db, "users", party.created_By);
                await getDoc(docRef)
                  .then((d) => {
                    // console.log({ ...d.data(), id: d.data.id });
                    newParty.push({ ...data, creator: d });
                  })
                  .catch((err) => console.log(err));
                // return data;
              };
              fetchUser().then(() => {
                setParties(newParty);
              });
            });
            // setParties(_parties);
            // console.log(parties);
          }
        });
      });
    };
    fetchAll();
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
      Parties
      <Box display="flex" flexDirection="column" gap="13px" padding="13px">
        {parties.length > 0 &&
          parties.map((party) => {
            let data = {};

            return (
              <Box key={party.id}>
                <Box display="flex" gap="10px">
                  <Avatar variant="rounded" src={party.cover_img} />
                  <span>{party.partyName}</span>
                  <span>{party.creator.username}</span>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Wrapper>
  );
};

export default Parties;
