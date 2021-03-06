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
  deleteDoc,
} from "../../firebase/firebase";
import Wrapper from "../../components/Wrapper";
import { Box } from "@mui/system";
import classes from "./notifications.module.css";
import { useGlobalContext } from "../../context/context";
import { Avatar, Checkbox, Divider, useMediaQuery } from "@mui/material";
import { IconButton } from "@material-ui/core";
import moment from "moment";
import {
  BsCalendarCheckFill,
  BsCalendarXFill,
  BsTrashFill,
} from "react-icons/bs";
import { MdCancel, MdNotifications } from "react-icons/md";
import { toast } from "react-toastify";
import { Modal, Dialog, DialogContent } from "@mui/material";
import { BiTrash } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
const Notifications = () => {
  const { user } = useAuthState();
  const { darkMode } = useGlobalContext();
  const [notifications, setNotifications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState(false);
  const [notification, setNotification] = React.useState(null);
  const singleNote = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };
  const notifContainer = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };
  const listNotif = {
    hidden: {
      opacity: 0,
      x: 10,
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  };
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
          console.log(notifications[ind], "before Change");

          notifications.splice(ind, 1, data);
          console.log(notifications.splice(ind, 1, data));
          console.log(notifications[ind], "after Change");
          console.log(data, "Modified");

          setLoading(false);
        }
        if (change.type === "removed") {
          const data = { ...change.doc.data(), id: change.doc.id };
          notifications.filter((n) => n.id !== data.id);
          setLoading(false);
          console.log("removed");
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
      .then(() => {
        console.log("Read");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteeNotification = (id) => {
    const docRef = doc(db, "notifications", id);
    deleteDoc(docRef)
      .then(() => {
        toast.success("Notification Deleted");
        setModal(false);
        setNotification(null);
      })

      .catch((err) => toast.error(err.message));
  };
  const matches = useMediaQuery("(max-width: 450px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  return (
    <Wrapper>
      {loading && "Loading"}
      {!isLg && (
        <Modal open={modal}>
          <div>
            <Dialog open={modal} fullWidth>
              <DialogContent>
                <Box display="flex" justifyContent="space-between">
                  <IconButton
                    onClick={() => {
                      setModal(false);
                      setNotification(null);
                    }}
                  >
                    <MdCancel />
                  </IconButton>
                  <IconButton
                    onClick={() => deleteeNotification(notification.id)}
                  >
                    <BsTrashFill />
                  </IconButton>
                </Box>
                {notification && (
                  <Box display="flex" flexDirection="column" gap="7px">
                    <Box fontWeight="600">
                      {" "}
                      {notification.notification.header}
                    </Box>
                    {notification.notification.body}
                  </Box>
                )}
              </DialogContent>
            </Dialog>{" "}
          </div>
        </Modal>
      )}
      <div className={classes.note_flex}>
        <motion.div
          className={classes.notification_container}
          initial="hidden"
          animate="visible"
          variants={notifContainer}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            padding="3px 13px 0px 13px"
          >
            <Checkbox />{" "}
            <span>
              {"Read "}
              {notifications.length > 0 &&
                notifications.filter((n) => n.read).length +
                  "/" +
                  notifications.length}
            </span>
          </Box>

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

              const time = correct();
              return (
                <motion.div
                  animate="visible"
                  initial="hidden"
                  variants={listNotif}
                  key={instance.id}
                  className={classes.notifMain}
                >
                  <div
                    style={{
                      borderLeft: !instance.read ? "solid 3px #8800ff" : "none",
                    }}
                    className={`${classes.notification}`}
                    onClick={async () => {
                      if (!instance.read) {
                        await updateNotification(instance.id);
                        console.log("Unread");
                      }
                      if (notification) {
                        setNotification(null);
                        setTimeout(() => {
                          setNotification(instance);
                        }, 100);
                      } else {
                        await setNotification(instance);
                      }

                      setModal(true);
                    }}
                  >
                    {" "}
                    <Box
                      display="flex"
                      gap="8px"
                      width="100%"
                      alignItems="center"
                    >
                      <Avatar
                        sx={{
                          backgroundColor:
                            instance.type === "event_start"
                              ? "#5cb85c"
                              : instance.type === "event_add"
                              ? "#4a90e2"
                              : "#e23636",
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
                            fontWeight: instance.read ? "600" : "700",
                            fontSize: instance.read ? "13px" : "normal",
                            color: instance.read ? "#a3a3a3" : "#8800ff",
                          }}
                        >
                          {instance.notification.header}
                        </span>
                        <span
                          className={classes.note}
                          style={{
                            fontSize: instance.read ? "13px" : "14px",
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
                  </div>

                  <Divider />
                </motion.div>
              );
            })}
        </motion.div>

        {isLg && (
          <div className={classes.opened_notif}>
            {!notification && <div className={classes.notif_2}></div>}
            {notification && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={singleNote}
                className={classes.notif_2}
              >
                <div>
                  {" "}
                  <div className={classes.notif_header}>
                    {" "}
                    {notification.notification.header}
                  </div>
                  <br />
                  <div className={classes.notif_body}>
                    {" "}
                    {notification.notification.body}
                  </div>
                </div>
                <div>
                  {" "}
                  <IconButton
                    size="small"
                    color="#8800ff"
                    onClick={() => deleteeNotification(notification.id)}
                  >
                    <BsTrashFill />
                  </IconButton>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {!loading &&
        notifications.length < 1 &&
        "Your noitifications will appear here"}
    </Wrapper>
  );
};

export default Notifications;
