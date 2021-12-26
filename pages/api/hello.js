import { toast } from "react-toastify";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require("express");
const app = express();
const port = 3001;
const moment = require("moment");
const nodemailer = require("nodemailer");
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
const auth = require("../../firebase/mailauth.json");

export default function handler(req, res) {
  const user = "lknsaheed@gmail.com";

  async function sendAlertMail(client) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lknsaheed@gmail.com",
        pass: "Horlameelekan1",
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Hoolaa notifier👻" <lknsaheed@gmail.com>', // sender address
      to: client.email, // list of receivers
      subject: "Notification of party" + client.status, // Subject line
      html: client.body, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  }

  if (req.method === "GET") {
    const db = getFirestore();
    const fetchAndStart = async () => {
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
                  isEnded: false,
                })
                .then(() => {
                  db.collection("users")
                    .doc(data.created_By)
                    .get()
                    .then((doc) => {
                      if (doc.exists) {
                        db.collection("notifications")
                          .doc()
                          .set({
                            userId: data.created_By,
                            type: "event_start",
                            notification: {
                              header: `${data.category.label} has started`,
                              body: `Your ${data.category.label} (${
                                data.partyName
                              }) scheduled to hold at: ${startdate.format(
                                "ddd, MMM DD, YYYY hh:mm:a"
                              )} has started `,
                              attachment: null,
                            },
                            created_At: Timestamp.fromDate(new Date()),
                          })
                          .catch((err) => console.log(err.message));
                        sendAlertMail({
                          email: doc.data().email,
                          name: doc.data().firstName,
                          body: `<div>
                          <div style='fontSize: 17px'> <b> Hello ${
                            doc.data().firstName
                          }</b>, </div>
                          your ${data.category.label} with name
                          <div style='padding: 10px'>
                            ${data.partyName} 
                          </div>
                        <b>Which started at:</b> ${startdate.format(
                          "hh:mm:a on ddd, MMM DD, YYYY "
                        )} has Ended
                            </div>`,
                          status: "end",
                        }).catch(console.error);
                      }
                    });
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
    const fetchAndEnd = async () => {
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
            const diffs = currentDate - start_date;

            const endDate = Math.floor(diffs / 86400000); // days
            console.log(endDate);
            if (endDate >= 1 && !data.isEnded) {
              toUpdate.push(data);
              await docRef
                .doc(data.id)
                .update({
                  isEnded: true,
                })
                .then(() => {
                  db.collection("users")
                    .doc(data.created_By)
                    .get()
                    .then((doc) => {
                      if (doc.exists) {
                        db.collection("notifications")
                          .doc()
                          .set({
                            userId: data.created_By,
                            type: "event_end",
                            notification: {
                              header: `${data.category.label} has ended`,
                              body: `Your ${data.category.label} (${
                                data.partyName
                              }) which started at: ${startdate.format(
                                "hh:mm:a on ddd, MMM DD, YYYY "
                              )} has ended `,
                              attachment: null,
                            },
                            created_At: Timestamp.fromDate(new Date()),
                          })
                          .catch((err) => console.log(err.message));
                        sendAlertMail({
                          email: doc.data().email,
                          name: doc.data().firstName,
                          body: `<div>
                          <div style='fontSize: 17px'> <b> Hello ${
                            doc.data().firstName
                          }</b>, </div>
                          your ${data.category.label} with name
                          <div style='padding: 10px'>
                            ${data.partyName} 
                          </div>
                        <b>Which started at:</b> ${startdate.format(
                          "hh:mm:a on ddd, MMM DD, YYYY "
                        )} has Ended
                            </div>`,
                          status: "bend",
                        }).catch(console.error);
                      }
                    });
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
    fetchAndStart();
    fetchAndEnd();
  } else {
    res.status(401).json({ success: false, message: "Unauthorised" });
  }

  // if (req.headers.authorization === "saheed") {
  //   res.status(200).json({ name: "John Doe" });
  // } else {
  //   res.status(401).json({ success: false, message: "Not Authorized" });
  // }
}
