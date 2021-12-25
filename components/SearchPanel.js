import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useGlobalContext } from "../context/context";
import { Avatar } from "@mui/material";
import classes from "./Header.module.css";
import { useRouter } from "next/router";
import { FaUsers } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { makeStyles } from "@material-ui/core";
import { MdCategory } from "react-icons/md";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ all, parties, loading, users }) {
  const { setSearch, darkMode } = useGlobalContext();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const router = useRouter();
  const useStyles = makeStyles({
    root: {
      fontFamily: "lato !important",
      "& .css-aym9vq-MuiButtonBase-root-MuiTab-root.Mui-selected": {
        color: "#8800ff",
        textTransform: "capitalize",
      },
      "& .css-aym9vq-MuiButtonBase-root-MuiTab-root": {
        textTransform: "capitalize",
        fontFamily: "lato !important",
      },
      "& .css-1aquho2-MuiTabs-indicator": {
        backgroundColor: "#8800ff",
      },
      "& .css-aym9vq-MuiButtonBase-root-MuiTab-root>.MuiTab-iconWrapper": {
        fontSize: "20px",
      },
    },
  });
  const myclass = useStyles();
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          className={myclass.root}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="All" icon={<MdCategory />} {...a11yProps(0)} />
          <Tab label="Parties" icon={<GiPartyPopper />} {...a11yProps(1)} />
          <Tab icon={<FaUsers />} label="Buddies" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <div>
        <TabPanel
          className={`${classes.panel} ${darkMode ? classes.darkPanel : ""}`}
          value={value}
          index={0}
        >
          <div
            style={{
              display: "flex",
              flexDirection:
                all.parties.length < 1 && all.users.length > 0
                  ? "column-reverse"
                  : "column",
            }}
          >
            <div>
              Parties
              {all.parties.length > 0 ? (
                all.parties.map((r) => {
                  return (
                    <div
                      onClick={() => {
                        setSearch("");
                        router.push({ pathname: "/dashboard/parties/" + r.id });
                      }}
                      key={r.id}
                      className={`${classes.party} ${
                        darkMode ? classes.darkParty : ""
                      }`}
                    >
                      <Box display="flex" alignItems="center" gap="10px">
                        {" "}
                        <Avatar src={r.cover_img}>
                          {r.partyName.slice(0, 1).toUpperCase()}
                        </Avatar>
                        {r.partyName}
                      </Box>
                    </div>
                  );
                })
              ) : (
                <Box display="flex">
                  <div style={{ width: "400px" }}>
                    <img
                      src="/noresult.svg"
                      style={{ width: "100%", opacity: 0.2 }}
                    />
                  </div>
                  <div>No result</div>
                </Box>
              )}
            </div>
            <div>
              <Box> Buddies</Box>
              {all.users.length > 0
                ? all.users.map((r) => {
                    return (
                      <div
                        onClick={() => {
                          setSearch("");
                          router.push({
                            pathname: "/dashboard/parties/" + r.id,
                          });
                        }}
                        key={r.id}
                        className={`${classes.party} ${
                          darkMode ? classes.darkParty : ""
                        }`}
                      >
                        <Box display="flex" alignItems="center" gap="10px">
                          {" "}
                          <Avatar src={r.displayPics} />
                          <Box display="flex" flexDirection="column">
                            <span> {`${r.firstName} ${r.lastName}`}</span>
                            <span style={{ fontSize: "11px" }}>
                              {" "}
                              @{r.username}
                            </span>
                          </Box>
                        </Box>
                      </div>
                    );
                  })
                : "No result"}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {parties.length > 0
            ? parties.map((r) => {
                return (
                  <div
                    onClick={() => {
                      setSearch("");
                      router.push({ pathname: "/dashboard/parties/" + r.id });
                    }}
                    key={r.id}
                  >
                    {r.partyName}
                  </div>
                );
              })
            : "No Result"}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {users.length > 0
            ? users.map((r) => {
                return (
                  <div
                    onClick={() => {
                      setSearch("");
                      router.push({ pathname: "/dashboard/parties/" + r.id });
                    }}
                    key={r.id}
                  >
                    {r.partyName}
                  </div>
                );
              })
            : "No Result"}
        </TabPanel>
      </div>
    </Box>
  );
}
