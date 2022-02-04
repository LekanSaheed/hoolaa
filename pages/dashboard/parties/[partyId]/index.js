import React, { useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../../../../components/Wrapper";
import AParty from "../../../../components/SelectedParty/AParty";
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
              console.log(newData, "Party at index");
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
      Party here
      {loading && "loading"}
      {!loading && <AParty party={party} />}
    </Wrapper>
  );
};

export default Party;
