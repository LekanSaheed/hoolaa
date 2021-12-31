import React, { useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../../../../components/Wrapper";
import {
  db,
  getDoc,
  doc,
  collection,
  setDoc,
  Timestamp,
  addDoc,
} from "../../../../firebase/firebase";
import { Box, display } from "@mui/system";
import { Avatar, Button, TextField } from "@mui/material";
import classes from "./party.module.css";
import moment from "moment";
import { motion } from "framer-motion";
import Select from "react-select";
import {
  HiLocationMarker,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineUsers,
  HiTrash,
  HiUsers,
} from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { BsCalendarWeek, BsCalendarWeekFill, BsStarFill } from "react-icons/bs";
import { RiVipCrown2Fill, RiVipDiamondFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../../../context/context";
import { useAuthState } from "../../../../context/AuthContext";

const Party = () => {
  const [party, setParty] = useState({});
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [current, setCurrent] = useState("");
  const [search, setSearch] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [reserved, setReserved] = useState([]);
  const [defaultMenus, setDefaultMenus] = useState([]);
  const [typeMenu, setTypeMenu] = useState([]);

  const { user } = useAuthState();
  const [selected, setSelected] = useState({
    label: "REGULAR",
    value: "regular",
  });
  const { darkMode, isToggled } = useGlobalContext();
  const setSearch_ = useGlobalContext().setSearch;

  const router = useRouter();

  const options = [
    { label: "REGULAR", value: "regular" },
    { label: "VIP", value: "vip" },
    { label: "VVIP", value: "vvip" },
  ];
  const handleCategorySelect = (newVal) => {
    setSelected(newVal);
    const currentMenu = menus.filter((m) => m.type.value === newVal.value);
    if (current === "all") {
      setDefaultMenus(currentMenu);
    } else {
      setDefaultMenus(currentMenu.filter((m) => m.category.value === current));
    }
    setTypeMenu(currentMenu);
    setSearch("");
  };
  React.useEffect(() => {
    setCurrent("all");
    const fetchParty = async () => {
      console.log(router.query.partyId);
      const docRef = doc(db, "parties", router.query.partyId);
      await getDoc(docRef)
        .then(async (doc_) => {
          if (doc_.exists()) {
            const data = { ...doc_.data(), id: doc_.id };

            const docRef = doc(db, "users", data.created_By);
            await getDoc(docRef).then(async (_doc) => {
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
              console.log(menus);
              const _defaultMenus = newData.menus.filter(
                (m) => m.type.value === "regular"
              );
              console.log(_defaultMenus, "default");
              await setDefaultMenus(_defaultMenus);
              await setParty(newData);
              await setTypeMenu(_defaultMenus);
              console.log(defaultMenus, "defs");
              setNotFound(false);
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
  }, [router.query.q]);
  const filterMenu = (category) => {
    const newCategory = typeMenu.filter(
      (menu) => menu.category.value === category
    );

    setDefaultMenus(newCategory);
    setSearch("");
  };
  const categories = [
    { label: "All", params: "all" },
    { label: "Foods", params: "food" },
    { label: "Drinks", params: "drink" },
    { label: "Desserts", params: "dessert" },
    { label: "Side Dishes", params: "side_dishes" },
  ];

  const searchFilter = (e) => {
    const match = typeMenu.filter((menu) => {
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
    setDefaultMenus(match);
    if (current !== "all" && !e && typeMenu) {
      const filterCurrentCategory = typeMenu.filter(
        (menu) => menu.category.value === current
      );
      setDefaultMenus(filterCurrentCategory);
    }
    if (current === "all" && !e && typeMenu) {
      setDefaultMenus(typeMenu);
    }
  };
  const makeReservation = async () => {
    const p = "FLWSECK_TEST-0259b4239de114629f49f6408b882f48-X";
    await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${p}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },

      body: JSON.stringify({
        tx_ref: "hoolaa-rt-tx-" + new Date().getTime().toString(),
        amount: "100",
        currency: "NGN",
        redirect_url: "https://hoolaa.vercel.app/dashboard/tx",
        payment_options: "card",
        meta: {
          consumer_id: 23,
          consumer_mac: "92a3-912ba-1192a",
        },
        customer: {
          email: "user@gmail.com",
          phonenumber: "080****4528",
          name: "Yemi Desola",
        },
        customizations: {
          title: "Hoolaa reservations payment",
          description: "Reservaation isn't free. Pay the price",
          logo: "https://assets.piedpiper.com/logo.png",
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.status === "success") {
          window.open(res.data.link, "_blank");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const reserve = async () => {
    console.log(reserved.filter((r) => r.type.value === selected.value));
    const docRef = collection(db, "reservations");
    const _reserved = reserved.filter((r) => r.type.value === selected.value);
    await addDoc(docRef, {
      reservations: _reserved,
      reserved_By: user.user.uid,
      partyId: party.id,
      created_At: Timestamp.fromDate(new Date()),
    })
      .then(() => {
        toast.success("Reservation Made");
      })
      .catch((err) => toast.error(err.message));
  };
  return (
    <Wrapper>
      <Box
        padding="10px"
        className={`${classes.container} ${darkMode ? classes.darkCont : ""}`}
      >
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
                padding="10px"
                gap="20px"
                display="flex"
                marginTop="-60px"
                flexDirection="column"
                className={`${classes.party_details} ${
                  darkMode ? classes.dark_party_details : ""
                }`}
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
                <div className={classes.date_time}>
                  <div className={classes.date_time_container}>
                    <div className={classes._date}>
                      {" "}
                      <span className={classes.month}>
                        {moment(party.start_date.toDate()).format("MMM")}
                      </span>
                      <span className={classes.day}>
                        {moment(party.start_date.toDate()).format("DD")}
                      </span>
                    </div>
                    <div className={classes._time}>
                      <span className={classes.titular_day}>
                        {" "}
                        {moment(party.start_date.toDate()).format("dddd")}
                      </span>
                      <span style={{ fontSize: "11px", color: "#fff1ff97" }}>
                        {" "}
                        {moment(party.start_date.toDate()).format("hh:mm a")} -
                        End
                      </span>
                    </div>
                  </div>
                  <div className={classes.date_action}>Add</div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    padding: "20px 15px",
                    borderRadius: "20px",
                  }}
                >
                  <span
                    style={{
                      color: "#f68b64",
                      fontWeight: "600",
                    }}
                  >
                    Who is coming
                  </span>
                  <Box
                    padding="20px 0px"
                    display="flex"
                    gap="10px"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                    <Avatar />
                  </Box>
                </div>
                <Box display="flex" gap="20px">
                  <div className={classes._people_box}>
                    <span>Total attending</span>
                    <span>249</span>
                  </div>
                  <div className={classes._people_box}></div>
                </Box>
                <Box display="flex" alignItems="center" gap="0px">
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
                  <span
                    className={classes.details}
                    style={{ fontWeight: "600" }}
                  >
                    {" "}
                    {party.category.label}
                  </span>
                </Box>

                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <BsCalendarWeekFill />
                  </span>
                  <span
                    className={classes.details}
                    style={{ fontWeight: "600" }}
                  >
                    {moment(party.start_date.toDate()).format(
                      "ddd, MMM DD YYYY hh:mm:a"
                    )}
                  </span>
                </Box>
                <Box display="flex" alignItems="center" gap="10px">
                  <span className={classes.icon}>
                    <HiLocationMarker />
                  </span>
                  <span
                    style={{ fontWeight: "600" }}
                  >{`${party.location.street}, ${party.location.city} ${party.location.state}`}</span>
                </Box>
              </Box>
            </div>
            {party.isStarted && !party.isEnded ? (
              <Box
                onClick={() =>
                  router.push({
                    pathname: router.pathname + "/party-space",
                    query: { ...router.query },
                  })
                }
              >
                CHECK IN
              </Box>
            ) : party.isStarted && party.isEnded ? (
              "This party has ended"
            ) : (
              <div>
                <div
                  className={`${classes.proposed_modal} ${
                    isToggled ? classes.expandModal : classes.shrinkModal
                  }`}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    className={classes.menu_layout}
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Box fontSize="28px" fontWeight="800">
                        Menus
                      </Box>{" "}
                      <Box fontSize="18px" fontWeight="600">
                        {reserved
                          .filter((r) => {
                            console.log(r);
                            return r.type.value === selected.value;
                          })
                          .reduce((a, b) => a + b.quantity, 0) + " items"}
                      </Box>
                    </Box>

                    <Box display="flex" flexDirection="column">
                      <label>Select a category</label>
                      <Select
                        options={options}
                        value={selected}
                        onChange={handleCategorySelect}
                      />{" "}
                      {selected && (
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
                                <div
                                  className={`${classes.cat_flex} ${
                                    darkMode ? classes.darkCatFlex : ""
                                  }`}
                                >
                                  {categories.map((cg) => {
                                    return (
                                      <div
                                        key={cg.id}
                                        className={
                                          current === cg.params
                                            ? classes.active
                                            : ""
                                        }
                                        onClick={() => {
                                          setCurrent(cg.params);
                                          if (cg.params === "all") {
                                            setDefaultMenus(typeMenu);
                                          } else {
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
                                      defaultMenus.length < 1
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
                            {party.menus &&
                            party.menus.length > 0 &&
                            defaultMenus.length > 0 ? (
                              <div
                                className={`${classes._container} ${
                                  darkMode ? classes.darkContainer : ""
                                }`}
                              >
                                {defaultMenus.map((menu) => {
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
                                              className={`${
                                                classes.menu_type
                                              } ${
                                                menu.type.value === "regular"
                                                  ? classes.regular
                                                  : menu.type.value === "vip"
                                                  ? classes.vip
                                                  : classes.vvip
                                              }`}
                                            >
                                              <div
                                                className={classes.type_icon}
                                              >
                                                {menu.type.value ===
                                                "regular" ? (
                                                  <BsStarFill />
                                                ) : menu.type.value ===
                                                  "vip" ? (
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
                                                const update = defaultMenus.map(
                                                  (item) =>
                                                    item.id === menu.id
                                                      ? {
                                                          ...item,
                                                          quantity:
                                                            item.quantity > 1
                                                              ? parseInt(
                                                                  item.quantity
                                                                ) - 1
                                                              : (item.quantity = 1),
                                                        }
                                                      : item
                                                );
                                                const alert = defaultMenus.find(
                                                  (m) => m.id === menu.id
                                                );
                                                setDefaultMenus(update);
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
                                                const update = defaultMenus.map(
                                                  (item) =>
                                                    item.id === menu.id
                                                      ? {
                                                          ...item,
                                                          quantity:
                                                            e.target.value,
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
                                                  defaultMenus.map((item) =>
                                                    item.id === menu.id
                                                      ? {
                                                          ...item,
                                                          quantity: 0,
                                                        }
                                                      : item
                                                  );
                                                } else {
                                                  setDefaultMenus(update);
                                                }
                                                // console.log(parseInt("000099"));
                                              }}
                                            />
                                            <button
                                              onClick={() => {
                                                console.log(reserved);
                                                const update = defaultMenus.map(
                                                  (item) =>
                                                    item.id === menu.id
                                                      ? {
                                                          ...item,
                                                          quantity:
                                                            parseInt(
                                                              item.quantity
                                                            ) + 1,
                                                        }
                                                      : item
                                                );

                                                setDefaultMenus(update);
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
                                                const update = reserved.map(
                                                  (item) =>
                                                    item.id === menu.id
                                                      ? {
                                                          ...item,
                                                          quantity:
                                                            menu.quantity,
                                                        }
                                                      : item
                                                );
                                                setReserved(update);
                                              } else {
                                                setReserved([
                                                  ...reserved,
                                                  menu,
                                                ]);
                                              }

                                              toast.success(
                                                `${menu.quantity} ${menu.name} added to ${menu.type.label} reservation`
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
                          {/* Reserved Menus */}
                        </div>
                      )}
                    </Box>
                  </Box>
                  <div className={classes.reserved}>
                    {/* Reserved Menu */}
                    <Box
                      textAlign="center"
                      fontWeight="600"
                      borderBottom="solid 1px #bababa"
                      paddingBottom="10px"
                    >
                      {" "}
                      {selected.label}
                    </Box>
                    <Box
                      paddingTop="10px"
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="100%"
                    >
                      <Box display="flex" flexDirection="column" gap="15px">
                        {reserved.length > 0 &&
                          reserved
                            .filter((r) => r.type.value === selected.value)
                            .map((r) => {
                              return (
                                <motion.div
                                  key={r.id}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <Avatar
                                    variant="rounded"
                                    sx={{ height: 30, width: 30 }}
                                    src={r.menu_img}
                                  />
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
                                    <HiTrash />
                                  </Button>
                                </motion.div>
                              );
                            })}
                      </Box>
                      <Box>
                        <Box display="flex" justifyContent="space-between">
                          <span>Total</span> <span>{2000}</span>
                        </Box>
                        <Button
                          fullWidth
                          color="primary"
                          variant="contained"
                          style={{
                            background: "#8800ff",
                            // position: "absolute",
                            // bottom: "3px",
                            padding: "10px",
                          }}
                          onClick={() => {
                            reserve();
                            // makeReservation();
                          }}
                        >
                          Make Reservation
                        </Button>
                      </Box>
                    </Box>
                  </div>
                </div>
                Proposed Modal Ui
              </div>
            )}
          </>
        )}
      </Box>
    </Wrapper>
  );
};

export default Party;
