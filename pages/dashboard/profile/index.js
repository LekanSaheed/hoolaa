import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Wrapper from "../../../components/Wrapper";
import { useAuthState } from "../../../context/AuthContext";

const Profile = () => {
  const router = useRouter();
  const { user } = useAuthState();
  return (
    <Wrapper>
      {user.profile ? user.profile.username : "loading"}{" "}
      <Button onClick={() => router.push(router.pathname + "/edit")}>
        Edit
      </Button>
    </Wrapper>
  );
};

export default Profile;
