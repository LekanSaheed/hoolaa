import { toast } from "react-toastify";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require("express");
const app = express();
const port = 3001;
const moment = require("moment");
// app.get("/", (req, res) => {
// res.send("Hello World!");
var admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const serviceAccount = require("../../firebase/hoolaa-1-firebase-adminsdk-xrwsv-33a03c1156.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
// .on("connection", () => {

// });

export default function handler(req, res) {
  if (req.method === "GET") {
    const getUser = async () => {
      const db = getFirestore();

      const docRef = db.collection("parties");
      const toUpdate = [];
      await docRef
        .get()
        .then((snap) => {
          snap.forEach(async (doc) => {
            const data = { ...doc.data(), id: doc.id };
            // if(moment(data.start_date.toDate()).format() <= )
            const currentDate = new Date().getTime();
            const startdate = moment(data.start_date.toDate());
            const start_date = new Date(startdate).getTime();
            if (data.isStarted === false && start_date <= currentDate) {
              toUpdate.push(data);
              await docRef
                .doc(data.id)
                .update({
                  isStarted: true,
                })
                .then(() => {
                  toast.success("A party Has started");
                })
                .catch((err) => {
                  console.log(err);
                  res
                    .status(400)
                    .json({ success: false, message: err.message });
                });
            }

            // toUpdate.push();
            // toUpdate.push(moment(data.start_date.toDate()));
          });

          res.status(200).json(toUpdate);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ success: false, message: err.message });
        });
    };
    getUser();
  } else {
    res.status(401).json({ success: false, message: "Unauthorised" });
  }

  // if (req.headers.authorization === "saheed") {
  //   res.status(200).json({ name: "John Doe" });
  // } else {
  //   res.status(401).json({ success: false, message: "Not Authorized" });
  // }
}
