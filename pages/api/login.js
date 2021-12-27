const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

export default function handler(req, res) {
  const body = req.body;

  if (req.method === "POST") {
    console.log(req.body);
    res.status(200).json({ success: true, data: req.body });
    // if (req.headers.Authorizaion === "MYSQL") {
    //   res.status(200).json({ success: true });
    // } else {
    //   res.status(401).end("Not Authoriced");
    // }
  } else {
    res.setHeader("Allow", ["POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
