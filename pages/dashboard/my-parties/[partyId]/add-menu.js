import { Button } from "@material-ui/core";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { BiDish, BiPlusCircle } from "react-icons/bi";
import Wrapper from "../../../../components/Wrapper";
import classes from "./add-menu.module.css";
import {
  uploadBytes,
  ref,
  getStorage,
  getDownloadURL,
  doc,
  getDoc,
  db,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "../../../../firebase/firebase";
import ThemedSelect from "../../../../components/ThemedSelect";
import { components } from "react-select";
import { IoFastFoodOutline, IoPizzaOutline } from "react-icons/io5";
import { GiWineBottle } from "react-icons/gi";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import HoolaLoader from "../../../../components/HoolaLoader";
import { BsStarFill } from "react-icons/bs";
import { RiVipCrown2Fill, RiVipDiamondFill } from "react-icons/ri";
import { useAuthState } from "../../../../context/AuthContext";

const AddNew = () => {
  const { user } = useAuthState();
  const [currImg, setCurrentImg] = useState(null);
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const [menu, setMenu] = useState({
    name: "",
    category: null,
    price: "",
    menu_img: null,
    type: "",
  });
  const [menuPic1, setMenuPic1] = useState(null);
  const types = [
    { label: "Regular", value: "regular", icon: <BsStarFill /> },
    { label: "Vip", value: "vip", icon: <RiVipCrown2Fill /> },
    { label: "VVIP", value: "vvip", icon: <RiVipDiamondFill /> },
  ];
  const router = useRouter();
  const checkAuth = async () => {
    const status = false;
    const docRef = doc(db, "parties", router.query.partyId);
    await getDoc(docRef)
      .then((_doc) => {
        if (_doc.exists()) {
          if (_doc.data().created_By !== user.user.uid) {
            toast.error("You are not authorized");
            router.push("/dashboard/my-parties");
            status = false;
          } else {
            status = true;
          }
        } else {
          toast.error("The party you are about to edit does not exist");
          setLoading(false);
          status = false;
        }
      })
      .catch((err) => {
        console.log(err);
        status = false;
      });
    return status;
  };
  React.useEffect(() => {
    checkAuth();
  }, []);

  const { Option } = components;
  const IconOption = (props) => (
    <Option {...props}>
      <Box display="flex" gap="10px">
        {" "}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          {props.data.icon}
        </span>{" "}
        {props.data.label}
      </Box>
    </Option>
  );
  const menuCategories = [
    { label: "Food", value: "food", icon: <IoFastFoodOutline /> },
    { label: "Drinks", value: "drink", icon: <GiWineBottle /> },
    { label: "Dessert", value: "dessert", icon: <IoPizzaOutline /> },
    { label: "Side Dishes", value: "side_dishes", icon: <BiDish /> },
  ];

  const handleMenuImages = () => {
    setLoading(true);
    checkAuth().then((status) => {
      const storage = getStorage();
      const metadata = {
        contentType: "image/jpeg",
        size: menu.menu_img.size,
      };
      const menuImgRef = ref(
        storage,
        "menu-images/" + menu.menu_img.name + new Date().getTime().toString()
      );
      const uploadTask = uploadBytes(menuImgRef, menu.menu_img, metadata);

      status
        ? uploadTask.then(() => {
            getDownloadURL(menuImgRef).then(async (url) => {
              const docRef = doc(db, "parties", router.query.partyId);
              console.log(url);
              await updateDoc(docRef, {
                menus: arrayUnion({
                  ...menu,
                  id: new Date().getTime().toString(),
                  menu_img: url,
                  created_At: Timestamp.fromDate(new Date()),
                }),
              })
                .then(() => {
                  setLoading(false);
                  setMenu({
                    name: "",
                    category: null,
                    price: "",
                    menu_img: null,
                    type: "",
                  });
                  setCurrentImg(null);
                  toast.success("Menu Added Successfully");
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          })
        : setLoading(false);
    });
  };
  const handleMenuChanges = (data) => {
    setMenu((state) => ({
      ...state,
      ...data,
    }));
  };
  console.log(menu);
  const handleImage = (e) => {
    const img = e.target.files[0];
    handleMenuChanges({ menu_img: img });
    setCurrentImg(URL.createObjectURL(img));
  };
  console.log(router);
  return (
    <Wrapper>
      {loading && <HoolaLoader />}
      <div className={classes.container}>
        <label className={classes.label}>Prepare Reservations</label>
        <Box className={classes.flex}>
          <Box
            className={classes.box1}
            display="flex"
            flexDirection="column"
            gap="10px"
          >
            <div
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0,.7), rgba(0,0,0,.7)), url(${currImg})`,

                borderRadius: "10px",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "230px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box>
                <label
                  style={{
                    backgroundImage: currImg
                      ? `linear-gradient(rgba(0, 0, 0,.1), rgba(0,0,0,.1)), url(${currImg})`
                      : "none",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className={classes.upload1}
                  htmlFor="upload_menu"
                >
                  <input
                    className={classes.custom_file_input}
                    type="file"
                    id="upload_menu"
                    onChange={handleImage}
                  />
                  <BiPlusCircle />
                </label>
              </Box>
            </div>

            <Box>
              <label className={classes.label}>Name</label>
              <input
                placeholder="Item Name"
                className={classes.input}
                value={menu.name}
                onChange={(e) => handleMenuChanges({ name: e.target.value })}
                disabled={!menu.menu_img}
              />
            </Box>
            <Box>
              <label className={classes.label}>Type</label>
              <ThemedSelect
                options={types}
                value={menu.type}
                placeholder="Select Type"
                onChange={(e) =>
                  handleMenuChanges({
                    type: { label: e.label, value: e.value },
                  })
                }
                components={{ Option: IconOption }}
                isDisabled={!menu.menu_img || !menu.name}
              />
            </Box>
            <Box>
              <label className={classes.label}>Category</label>
              <ThemedSelect
                options={menuCategories}
                value={menu.category}
                placeholder="Select Category"
                onChange={(e) =>
                  handleMenuChanges({
                    category: { label: e.label, value: e.value },
                  })
                }
                components={{ Option: IconOption }}
                isDisabled={!menu.menu_img || !menu.name}
              />
            </Box>

            <Box>
              <label className={classes.label}>Price</label>
              <input
                type="number"
                placeholder="$"
                className={classes.input}
                value={menu.price}
                disabled={!menu.menu_img || !menu.name || !menu.category}
                onChange={(e) => handleMenuChanges({ price: e.target.value })}
              />
            </Box>
            {/* <Box>
                      <label className={classes.label}>Quantity</label>
                      <TextField
                        type="number"
                        placeholder="quantity"
                        variant="outlined"
                        size="small"
                        value={menuQuantity}
                        onChange={(e) => setMenuQuantity(e.target.value)}
                      />
                    </Box> */}
            <Box display="flex" width="100%" marginTop="13px">
              {" "}
              <Button
                fullWidth
                disabled={
                  !menu.menu_img ||
                  !menu.name ||
                  !menu.price ||
                  !menu.category ||
                  !menu.type
                }
                variant="contained"
                color="primary"
                style={{
                  background:
                    !menu.menu_img ||
                    !menu.name ||
                    !menu.price ||
                    !menu.category ||
                    !menu.type
                      ? "#efefef"
                      : "#8800ff",
                }}
                onClick={() => {
                  handleMenuImages();
                }}
              >
                Add
              </Button>
              {/* <Button
                disabled={
                  !menu.menu_img ||
                  !menu.name ||
                  !menu.price ||
                  !menu.category ||
                  !menu.type
                }
                onClick={() => setPreview(true)}
                fullWidth
              >
                Preview
              </Button> */}
            </Box>
          </Box>

          <Box className={classes.box2}>
            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <span>{menu.name}</span>
                <span>{menu.category.label}</span>
                <span>{`$${menu.price}`}</span>
                <span>{`$${menu.type.label}`}</span>

                {/* <button onClick={() => increase(m.id)}>
                              Increase
                            </button>
                            <button onClick={() => decrease(m.id)}>
                              decrease
                            </button> */}
                <button
                  onClick={() => {
                    setCurrentImg(null);
                    setPreview(false);
                    setMenu({
                      name: "",
                      category: null,
                      price: "",
                      menu_img: null,
                      type: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </motion.div>
            )}
          </Box>
        </Box>
      </div>
    </Wrapper>
  );
};

export default AddNew;
