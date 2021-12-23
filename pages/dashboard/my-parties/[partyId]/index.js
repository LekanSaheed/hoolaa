import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Wrapper from "../../../../components/Wrapper";
import { db, getDoc, doc } from "../../../../firebase/firebase";
import { Avatar, Button, TextField, useMediaQuery } from "@mui/material";
import classes from "./party.module.css";
import moment from "moment";
import { HiLocationMarker, HiUsers } from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { BsCalendarWeekFill, BsStarFill } from "react-icons/bs";
import { RiVipCrown2Fill, RiVipDiamondFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useAuthState } from "../../../../context/AuthContext";
const Party = () => {
  const [party, setParty] = useState({});
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [current, setCurrent] = useState("");
  const [search, setSearch] = useState("");

  const router = useRouter();
  const { user } = useAuthState();
  useEffect(() => {
    setCurrent("all");
    const checkAuth = async () => {
      const stat = false;
      const docRef = doc(db, "parties", router.query.partyId);
      await getDoc(docRef)
        .then((_doc) => {
          if (_doc.exists()) {
            console.log(_doc.data());
            if (_doc.data().created_By !== user.user.uid) {
              toast.error("You are not authorized");
              router.push("/dashboard/my-parties");
              stat = false;
            } else {
              console.log(_doc.data().created_By);
              stat = true;
            }
          } else {
            toast.error("The party does not exist or may have been deleted");
            // setLoading(false);
            stat = false;
          }
        })
        .catch((err) => {
          console.log(err);
          stat = false;
        });
      return stat;
    };
    const fetchParty = async () => {
      const docRef = doc(db, "parties", router.query.partyId);

      await getDoc(docRef)
        .then((doc_) => {
          if (doc_.exists) {
            const data = { ...doc_.data(), id: doc_.id };

            setParty(data);
            data.menus ? setMenus(data.menus) : setMenus([]);
            console.log(data);
            setLoading(false);
          } else {
            setLoading(false);
            console.log("Doesnt exist");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    };
    checkAuth().then((status) => {
      console.log(status);
      if (status) {
        fetchParty();
      }
    });
  }, []);

  const filterMenu = (category) => {
    const newCategory = party.menus
      ? party.menus.filter((menu) => menu.category.value === category)
      : [];
    setMenus(newCategory);
  };

  const searchFilter = (e) => {
    const match = party.menus.filter((menu) => {
      if (current === "all") {
        return menu.name.toLowerCase().includes(e.toLowerCase());
      } else {
        return (
          menu.name.toLowerCase().includes(e.toLowerCase()) &&
          menu.category.value === current
        );
      }
      console.log(current);
    });

    console.log(match);
    setMenus(match);
    if (current !== "all" && !e && party.menus) {
      const filterCurrentCategory = party.menus.filter(
        (menu) => menu.category.value === current
      );
      setMenus(filterCurrentCategory);
    }
    if (current === "all" && !e && party.menus) {
      setMenus(party.menus);
    }
  };
  const categories = [
    { label: "All", params: "all" },
    { label: "Foods", params: "food" },
    { label: "Drinks", params: "drink" },
    { label: "Desserts", params: "dessert" },
    { label: "Side Dishes", params: "side_dishes" },
  ];
  const media = useMediaQuery("(max-width:767px)");
  console.log(media);
  return (
    <Wrapper>
      {" "}
      <Box padding="10px" backgroundColor="#fcfcfc">
        {Object.entries(party).length > 0 && (
          <>
            <div className={classes.partyGroup}>
              <div className={classes.img_con}>
                <img
                  className={classes.cover_img}
                  src={party.cover_img}
                  // style={{ height: "200px", width: "50%", borderRadius: "6px" }}
                />
              </div>
              <Box
                backgroundColor="#fff"
                marginTop="20px"
                width="100%"
                padding="10px 25px"
                gap="14px"
                display="flex"
                flexDirection="column"
              >
                <Box display="flex" gap="10px" alignItems="center">
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    src={party.cover_img}
                  ></Avatar>
                  <Box display="flex" flexDirection="column" gap="10px">
                    <span className={classes.party_name}>
                      {party.partyName}
                    </span>
                    <span className={classes.username}>
                      {" "}
                      {party.category.label}
                    </span>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={`${classes.icon} ${classes.icon1}`}>
                    {" "}
                    <HiUsers />
                  </span>
                  {party.reservers ? party.reservers.length : "0"} People
                  attending
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  {" "}
                  <span className={`${classes.icon} ${classes.icon2}`}>
                    <MdCategory />
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {party.category.label}
                  </span>
                </Box>

                <Box display="flex" alignItems="center" gap="10px">
                  <span className={`${classes.icon} ${classes.icon3}`}>
                    <BsCalendarWeekFill />
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {moment(party.start_date.toDate()).format(
                      "ddd, MMM DD YYYY hh:mm:a"
                    )}
                  </span>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={`${classes.icon} ${classes.icon4}`}>
                    <HiLocationMarker />
                  </span>
                  <span style={{ fontWeight: "600" }}>{party.location}</span>
                </Box>
                <Button variant="outlined">Edit</Button>
              </Box>
            </div>

            {media ? (
              <Box
                padding="15px"
                onClick={() =>
                  router.push({
                    pathname: router.pathname + "/invite",
                    query: { ...router.query },
                  })
                }
              >
                Invite
              </Box>
            ) : (
              <Box padding="20px">Invite</Box>
            )}

            {/* Menus */}
            <div className={classes.flex_list}>
              <div className={classes.menuContainer}>
                <span
                  style={{ fontWeight: "600" }}
                  className={classes.menu_header}
                >
                  Menu
                </span>
                {party.menus && (
                  <>
                    <div className={classes.cat_flex}>
                      {categories.map((cg) => {
                        return (
                          <div
                            className={
                              current === cg.params ? classes.active : ""
                            }
                            onClick={() => {
                              setCurrent(cg.params);
                              if (cg.params === "all") setMenus(party.menus);
                              else {
                                filterMenu(cg.params);
                              }
                            }}
                          >
                            {cg.label}
                          </div>
                        );
                      })}
                    </div>
                    <div className={classes.search}>
                      <TextField
                        disabled={
                          party.menus &&
                          party.menus.length < 1 &&
                          menus.length < 1
                        }
                        value={search}
                        onChange={async (e) => {
                          await setSearch(e.target.value);
                          searchFilter(e.target.value);
                        }}
                        type="search"
                        placeholder="Search Menu"
                        fullWidth
                        size="small"
                      />
                    </div>
                  </>
                )}
                {/* <div>Total {menus.length}</div> */}

                {party.menus && party.menus.length > 0 && menus.length > 0 ? (
                  <Box>
                    {menus.map((menu) => {
                      return (
                        <div className={classes.menu} key={menu.id}>
                          <Avatar
                            src={menu.menu_img}
                            sx={{
                              height: 100,
                              width: 100,
                              borderRadius: "6px",
                              boxShadow: "0 0 15px rgb(0 0 0 /2%)",
                            }}
                          />
                          <div className={classes.menu_details}>
                            <div className={classes.detail_flex}>
                              <span className={classes.menu_name}>
                                {menu.name}
                              </span>

                              {/* <span className={classes.menu_category}>
                            {menu.category.label}
                          </span> */}
                              {menu.type && (
                                <span
                                  className={`${classes.menu_type} ${
                                    menu.type.value === "regular"
                                      ? classes.regular
                                      : menu.type.value === "vip"
                                      ? classes.vip
                                      : classes.vvip
                                  }`}
                                >
                                  <div className={classes.type_icon}>
                                    {menu.type.value === "regular" ? (
                                      <BsStarFill />
                                    ) : menu.type.value === "vip" ? (
                                      <RiVipCrown2Fill />
                                    ) : (
                                      <RiVipDiamondFill />
                                    )}
                                  </div>
                                  {menu.type.label}
                                </span>
                              )}
                            </div>
                            <span className={classes.menu_price}>
                              {menu.price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div className={classes.float_btn}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{
                          backgroundColor: "#8800ff",
                          borderRadius: "30px",
                          fontSize: "15px",
                          fontWeight: "600",
                        }}
                        onClick={() =>
                          router.push({
                            pathname: router.pathname + "/add-menu",
                            query: { ...router.query },
                          })
                        }
                      >
                        Add Menu
                      </Button>
                    </div>
                  </Box>
                ) : (
                  <div className={classes.no_menu}>
                    <img src="/add.png" />
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      style={{
                        backgroundColor: "#8800ff",
                        borderRadius: "30px",
                        fontSize: "15px",
                        fontWeight: "600",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: router.pathname + "/add-menu",
                          query: { ...router.query },
                        })
                      }
                    >
                      Add Menu
                    </Button>
                  </div>
                )}
              </div>
              <div>People List</div>
            </div>
          </>
        )}
      </Box>
    </Wrapper>
  );
};

export default Party;
