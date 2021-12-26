import React from "react";
import { useAuthState } from "../../context/AuthContext";
import {
  db,
  collection,
  doc,
  where,
  query,
  onSnapshot,
  updateDoc,
} from "../../firebase/firebase";
import Wrapper from "../../components/Wrapper";
import { Box } from "@mui/system";
import classes from "./notifications.module.css";
import { useGlobalContext } from "../../context/context";
import { Avatar, Divider, useMediaQuery } from "@mui/material";
import moment from "moment";
import { BsCalendarCheckFill, BsCalendarXFill } from "react-icons/bs";
import { MdNotifications } from "react-icons/md";
import { toast } from "react-toastify";
const Notifications = () => {
  const { user } = useAuthState();
  const { darkMode } = useGlobalContext();
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const fetchNotifications = async () => {
    const docRef = query(
      collection(db, "notifications"),
      where("userId", "==", user.user.uid)
    );
    const _notification = [];
    onSnapshot(docRef, async (snaps) => {
      snaps.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          await _notification.push({
            ...change.doc.data(),
            id: change.doc.id,
          });
          setNotifications(
            _notification.sort(function (a, b) {
              return (
                new Date(b.created_At.toDate().getTime()) -
                new Date(a.created_At.toDate().getTime())
              );
            })
          );
          console.log(_notification);
          setLoading(false);
        }
        if (change.type === "modified") {
          const data = { ...change.doc.data(), id: change.doc.id };

          let ind = notifications.findIndex((t) => t.id === data.id);
          notifications[ind] = data;
          console.log(data, "Modified");
          setLoading(false);
        }
        if (change.type === "removed") {
          const data = { ...change.doc.data(), id: change.doc.id };
          notifications.filter((n) => n.id !== data.id);
          setLoading(false);
        }
      });
      setLoading(false);
    });
  };
  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const updateNotification = (id) => {
    const docRef = doc(db, "notifications", id);
    updateDoc(docRef, {
      read: true,
    })
      .then((status) => {
        console.log(status);
        toast.success("Notification Read");
      })
      .catch((err) => [console.log(err)]);
  };
  const matches = useMediaQuery("(max-width: 450px)");
  return (
    <Wrapper>
      {loading && "Loading"}
      <Box padding="15px" display="flex" gap="15px" flexDirection="column">
        {notifications.length > 0 &&
          notifications.map((instance) => {
            const notificationTime = new Date(instance.created_At.toDate());
            const currentTime = new Date();

            const when = moment(notificationTime).format("hh:mm");

            const diffs = currentTime - notificationTime;
            var getDays = Math.floor(diffs / 86400000); // days
            var getHrs = Math.floor((diffs % 86400000) / 3600000);
            const getMin = Math.round(((diffs % 86400000) % 3600000) / 60000);
            const correct = () => {
              if (getDays === 0 && getHrs === 0 && getMin < 1) {
                return `now`;
              }
              if (getDays === 0 && getHrs === 0) {
                return `${getMin}m ago`;
              }
              if (getDays === 0 && getHrs > 1) {
                return `${getHrs}h ago`;
              }
              if (getDays === 0 && getHrs > 0) {
                return `${getHrs}h ${getMin}m ago`;
              }

              if (getDays > 0) {
                return `${getDays}d ago`;
              }
            };
            console.log(`${getHrs}h ${getMin}m ago`);
            const time = correct();
            return (
              <div key={instance.id}>
                <Box
                  className={`${classes.notification}`}
                  display="flex"
                  gap="8px"
                  padding="10px"
                  paddingRight="0"
                  onClick={() => updateNotification(instance.id)}
                >
                  {" "}
                  <Box display="flex" gap="8px" width="100%">
                    <Avatar
                      sx={{
                        backgroundColor:
                          instance.type === "event_start" ? "green" : "#A52A2A",
                        color: "white",
                      }}
                      src={
                        instance.type && instance.type === "buddy_request"
                          ? instance.notification.attachment.cover_img
                          : ""
                      }
                    >
                      {instance.type === "event_start" ? (
                        <BsCalendarCheckFill />
                      ) : instance.type === "event_end" ? (
                        <BsCalendarXFill />
                      ) : (
                        <MdNotifications />
                      )}
                    </Avatar>
                    <Box display="flex" gap="4px" flexDirection="column">
                      {" "}
                      <span
                        style={{
                          fontWeight: instance.read ? "600" : "800",
                          fontSize: instance.read ? "13px" : "normal",
                          color: instance.read ? "#a3a3a3" : "inherit",
                        }}
                      >
                        {instance.notification.header}
                      </span>
                      <span
                        className={classes.note}
                        style={{
                          fontSize: instance.read ? "13px" : "15px",
                          fontWeight: instance.read ? "normal" : "600",
                          color: "#a3a3a3",
                        }}
                      >
                        {matches
                          ? instance.notification.body
                              .slice(0, 40)
                              .concat("...")
                          : instance.notification.body
                              .slice(0, 86)
                              .concat("...")}
                      </span>
                    </Box>
                  </Box>
                  <Box
                    width="20%"
                    fontSize="12px"
                    fontWeight="600"
                    color="#bababa"
                  >
                    {time}
                  </Box>
                </Box>
                <Divider />
              </div>
            );
          })}
      </Box>
      {!loading &&
        notifications.length < 1 &&
        "Your noitifications will appear here"}
    </Wrapper>
  );
};

export default Notifications;
