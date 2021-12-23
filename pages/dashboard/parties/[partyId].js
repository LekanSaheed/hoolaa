import React, { useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../../../components/Wrapper";
import { db, getDoc, doc } from "../../../firebase/firebase";
import { Box, display } from "@mui/system";
import { Avatar, Button, TextField } from "@mui/material";
import classes from "./party.module.css";
import moment from "moment";
import { motion } from "framer-motion";
import {
  BiCalendar,
  BiCalendarAlt,
  BiCalendarEvent,
  BiCategory,
  BiCategoryAlt,
} from "react-icons/bi";
import {
  HiLocationMarker,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineUsers,
  HiUsers,
} from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { BsCalendarWeek, BsCalendarWeekFill, BsStarFill } from "react-icons/bs";
import { RiVipCrown2Fill, RiVipDiamondFill } from "react-icons/ri";
import { toast } from "react-toastify";
const Party = () => {
  const [party, setParty] = useState({});
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [current, setCurrent] = useState("");
  const [search, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reserved, setReserved] = useState([]);

  const router = useRouter();
  React.useEffect(() => {
    setCurrent("all");
    const fetchParty = async () => {
      const docRef = doc(db, "parties", router.query.partyId);
      await getDoc(docRef)
        .then(async (doc_) => {
          if (doc_.exists()) {
            const data = { ...doc_.data(), id: doc_.id };

            const docRef = doc(db, "users", data.created_By);
            await getDoc(docRef).then((_doc) => {
              // console.log(_doc.data());

              const newData = {
                ...data,
                creator: _doc.data(),
                menus: data.menus
                  ? data.menus.map((m) => {
                      return {
                        ...m,
                        quantity: 1,
                      };
                    })
                  : [],
              };
              newData.menus ? setMenus(newData.menus) : setMenus([]);

              setParty(newData);

              console.log(menus);
              setLoading(false);
            });
          } else {
            setLoading(false);
            setNotFound(true);
            toast.error("Party Not found");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    };
    fetchParty();
  }, []);
  const filterMenu = (category) => {
    const newCategory = party.menus
      ? party.menus.filter((menu) => menu.category.value === category)
      : [];
    setMenus(newCategory);
  };
  const categories = [
    { label: "All", params: "all" },
    { label: "Foods", params: "food" },
    { label: "Drinks", params: "drink" },
    { label: "Desserts", params: "dessert" },
    { label: "Side Dishes", params: "side_dishes" },
  ];

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
  return (
    <Wrapper>
      <Box padding="10px" backgroundColor="#fcfcfc">
        {notFound && (
          <div className={classes.notFound}>
            <Box padding="10px" textAlign="center">
              Party might have been deleted or does not exist.
            </Box>
            <img src="/notfound.png" />
          </div>
        )}
        {Object.entries(party).length > 0 && (
          <>
            <div className={classes.partyGroup}>
              <img
                className={classes.cover_img}
                src={party.cover_img}
                // style={{ height: "200px", width: "50%", borderRadius: "6px" }}
              />

              <Box
                padding="10px 25px"
                gap="10px"
                display="flex"
                flexDirection="column"
              >
                <Box display="flex" gap="10px">
                  <Avatar
                    sx={{ width: 60, height: 60 }}
                    src={party.creator.displayPics && party.creator.displayPics}
                  >
                    {!party.creator.displayPics &&
                      party.creator.username.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box display="flex" flexDirection="column" gap="10px">
                    <span className={classes.party_name}>
                      {party.partyName}
                    </span>
                    <span className={classes.username}>
                      {" "}
                      @{party.creator.username}
                    </span>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    {" "}
                    <HiUsers />
                  </span>
                  {party.reservers ? party.reservers.length : "0"} People
                  attending
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  {" "}
                  <span className={classes.icon}>
                    <MdCategory />
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {" "}
                    {party.category.label}
                  </span>
                </Box>

                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <BsCalendarWeekFill />
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {moment(party.start_date.toDate()).format(
                      "ddd, MMM DD YYYY hh:mm:a"
                    )}
                  </span>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <HiLocationMarker />
                  </span>
                  <span style={{ fontWeight: "600" }}>{party.location}</span>
                </Box>
              </Box>
            </div>
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
                            key={cg.id}
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
                {party.menus && party.menus.length > 0 && menus.length > 0 ? (
                  <div className={classes._container}>
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
                              <span
                                style={
                                  menu.name.length > 9
                                    ? {
                                        fontSize: "10px",
                                      }
                                    : { fontWeight: "600" }
                                }
                                className={classes.menu_name}
                              >
                                {menu.name}
                              </span>
                              <span className={classes.menu_price}>
                                {menu.price}
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
                            <Box
                              display="flex"
                              gap="10px"
                              flexDirection="column"
                            >
                              <Box display="flex" gap="4px">
                                <button
                                  onClick={() => {
                                    const update = menus.map((item) =>
                                      item.id === menu.id
                                        ? {
                                            ...item,
                                            quantity:
                                              item.quantity > 1
                                                ? parseInt(item.quantity) - 1
                                                : (item.quantity = 1),
                                          }
                                        : item
                                    );
                                    const alert = menus.find(
                                      (m) => m.id === menu.id
                                    );
                                    setMenus(update);
                                    if (alert.quantity === 1) {
                                      toast.info(
                                        "Minimum quantity for current menu is 1"
                                      );
                                    }
                                  }}
                                >
                                  &lt;
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  className={classes.q_input}
                                  value={menu.quantity}
                                  onChange={(e) => {
                                    const update = menus.map((item) =>
                                      item.id === menu.id
                                        ? {
                                            ...item,
                                            quantity: e.target.value,
                                          }
                                        : item
                                    );

                                    if (
                                      e.target.value === "0" ||
                                      parseInt(e.target.value) < 1
                                    ) {
                                      toast.info(
                                        "Minimum quantity for current menu is 1"
                                      );
                                      menus.map((item) =>
                                        item.id === menu.id
                                          ? {
                                              ...item,
                                              quantity: 0,
                                            }
                                          : item
                                      );
                                    } else {
                                      setMenus(update);
                                    }
                                    // console.log(parseInt("000099"));
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    const update = menus.map((item) =>
                                      item.id === menu.id
                                        ? {
                                            ...item,
                                            quantity:
                                              parseInt(item.quantity) + 1,
                                          }
                                        : item
                                    );

                                    setMenus(update);
                                  }}
                                >
                                  &gt;
                                </button>
                              </Box>
                              <Button
                                onClick={() => {
                                  const find = reserved.find(
                                    (r) => r.id === menu.id
                                  );
                                  if (find) {
                                    const update = reserved.map((item) =>
                                      item.id === menu.id
                                        ? {
                                            ...item,
                                            quantity: menu.quantity,
                                          }
                                        : item
                                    );
                                    setReserved(update);
                                  } else {
                                    setReserved([...reserved, menu]);
                                  }

                                  toast.success(
                                    `${menu.quantity} ${menu.name} added to reservation`
                                  );
                                }}
                                variant="contained"
                                color="primary"
                                style={{
                                  padding: "10px 20px !important",
                                  fontSize: "0.9rem",
                                  lineHeight: "3",
                                  minWidth: "30px",
                                }}
                                disabled={
                                  menu.quantity === "0" ||
                                  menu.quantity === 0 ||
                                  !menu.quantity
                                }
                                size="small"
                              >
                                Add
                              </Button>
                            </Box>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={classes.no_menu}>
                    <img src="/add.png" />
                  </div>
                )}
              </div>
              <div className={classes.reserved}>
                Reserved Menu
                <Box>
                  {reserved.length > 0 &&
                    reserved.map((r) => {
                      return (
                        <motion.div
                          key={r.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Box>
                            {r.name}
                            {r.quantity}
                          </Box>
                          <Button
                            onClick={() =>
                              setReserved(
                                reserved.filter((rs) => rs.id !== r.id)
                              )
                            }
                          >
                            Remove
                          </Button>
                        </motion.div>
                      );
                    })}
                </Box>
              </div>
            </div>
          </>
        )}
      </Box>
    </Wrapper>
  );
};

export default Party;
