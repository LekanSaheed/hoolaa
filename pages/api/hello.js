// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require("express");
const app = express();
const port = 3001;

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
  if (req.headers.authorization === "lekansaheed@prodeveloperforlife") {
    const getUser = async () => {
      const db = getFirestore();

      const docRef = db.collection("parties");
      const parties = [];
      await docRef
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            const data = doc.data();
            parties.push(data);
          });
          res.status(200).json(parties);
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
