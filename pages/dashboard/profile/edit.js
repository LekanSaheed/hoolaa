import { Button, TextField } from "@mui/material";
import { display } from "@mui/system";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Wrapper from "../../../components/Wrapper";
import { useAuthState } from "../../../context/AuthContext";
import {
  ref,
  getStorage,
  getDownloadURL,
  updateDoc,
  doc,
  db,
  uploadBytes,
} from "../../../firebase/firebase";

const Edit = () => {
  const { user } = useAuthState();
  const [currImg, setCurrImg] = useState(
    user.profile ? user.profile.displayPics : ""
  );
  const [displayPics, setDisplayPics] = useState(null);
  const [profile, setProfile] = useState(user.profile ? user.profile : {});

  const handleProfileChange = (data) => {
    setProfile((state) => {
      return {
        ...state,
        ...data,
      };
    });
  };
  const editProfile = () => {
    const storage = getStorage();
    const metadata = {
      contentType: "image/jpeg",
      size: displayPics.size,
    };
    const menuImgRef = ref(
      storage,
      "profile-images/" + displayPics.name + new Date().getTime().toString()
    );
    const uploadTask = uploadBytes(menuImgRef, displayPics, metadata);
    uploadTask
      .then(() => {
        getDownloadURL(menuImgRef).then((url) => {
          const docRef = doc(db, "users", user.user.uid);
          updateDoc(docRef, {
            displayPics: url,
          })
            .then(() => {
              toast.success("Profile UPdate");
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleImg = (e) => {
    setDisplayPics(e.target.files[0]);
  };
  console.log(profile);
  return (
    <Wrapper>
      <input type="file" onChange={handleImg} />
      <Button variant="outlined" onClick={() => editProfile()}>
        Edit Profile
      </Button>
      <TextField
        placeholder="First Name"
        fullWidth
        value={profile.firstName}
        onChange={(e) => handleProfileChange({ firstName: e.target.value })}
      />
      <TextField
        placeholder="Last Name"
        fullWidth
        value={profile.lastName}
        onChange={(e) => handleProfileChange({ lastName: e.target.value })}
      />
      <TextField fullWidth />
    </Wrapper>
  );
};

export default Edit;
