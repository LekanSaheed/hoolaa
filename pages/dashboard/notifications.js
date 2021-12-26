import React from "react";
import { useAuthState } from "../../context/AuthContext";
import { db, collection, getDocs, where, query } from "../../firebase/firebase";
import Wrapper from "../../components/Wrapper";
import { Box } from "@mui/system";
import classes from "./notifications.module.css";
import { useGlobalContext } from "../../context/context";
import { Avatar, Divider } from "@mui/material";
import moment from "moment";
import { BsCalendarCheckFill } from "react-icons/bs";
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
    await getDocs(docRef)
      .then((snaps) => {
        if (!snaps.empty) {
          snaps.forEach(async (doc) => {
            await _notification.push({ ...doc.data(), id: doc.id });
            setNotifications(_notification);
            console.log(_notification);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  React.useEffect(() => {
    fetchNotifications();
  }, []);
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
                >
                  {" "}
                  <Box display="flex" gap="8px" width="100%">
                    <Avatar
                      sx={{
                        backgroundColor:
                          instance.type === "event_start" ? "green" : "red",
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
                      ) : (
                        <BsCalendarCheckFill />
                      )}
                    </Avatar>
                    <Box display="flex" gap="4px" flexDirection="column">
                      {" "}
                      <span style={{ fontWeight: "600" }}>
                        {instance.notification.header}
                      </span>
                      <div style={{ fontSize: "13px", color: "#a3a3a3" }}>
                        {instance.notification.body}
                      </div>
                    </Box>
                  </Box>
                  <Box width="20%" fontSize="12px" color="#bababa">
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
