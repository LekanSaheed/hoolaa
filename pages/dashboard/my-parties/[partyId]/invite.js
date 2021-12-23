import { Button, Skeleton } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";
import { MdFileCopy } from "react-icons/md";
import { toast } from "react-toastify";
import Wrapper from "../../../../components/Wrapper";
import { useAuthState } from "../../../../context/AuthContext";
import { doc, db, getDoc } from "../../../../firebase/firebase";

const invite = () => {
  const { user } = useAuthState();
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchCode = async () => {
      const docRef = doc(db, "parties", router.query.partyId);
      await getDoc(docRef)
        .then((doc_) => {
          if (doc_.exists()) {
            if (doc_.data().created_By === user.user.uid) {
              if (doc_.data().inviteCode) {
                setCode(doc_.data().inviteCode);
              } else {
                setCode("NO CODE FOUND");
              }
            } else {
              toast.error("Not party creator");
            }

            setLoading(false);
          } else {
            setLoading(false);
            toast.error("Party Not found");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchCode();
  }, []);

  const copyToClip = () => {
    /* Get the text field */

    /* Select the text field */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(code);

    /* Alert the copied text */
    toast.success("Copied to clipboard");
  };
  const shareCode = () => {
    navigator.share({
      title: "Follow to join my party",
      url: "/dashboard/parties/thi",
    });
  };
  return (
    <Wrapper>
      <div style={{ background: "#f9f9f9", height: "100vh" }}>
        <div style={{ width: "100%", padding: "50px" }}>
          {" "}
          <img style={{ width: "100%" }} src="/invite.svg" />
        </div>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="15px"
          padding="13px"
          paddingBottom="18px"
          textAlign="center"
          borderRadius="10px"
          border="solid 1px #bababa"
          margin="0px 13px"
          marginTop="-50px"
          backgroundColor="#fff"
        >
          <span
            style={{
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "10px",
              color: "#8800ff",
            }}
          >
            {" "}
            share your invite code{" "}
          </span>
          <Box display="flex" gap="10px">
            {loading && <Skeleton width={70} />}
            <span id="code">{code}</span>
            <span
              onClick={copyToClip}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                color: "#8800ff",
              }}
            >
              <MdFileCopy />
            </span>
          </Box>
          <span style={{ color: "grey", fontSize: "11px" }}>
            This code is valid while party lasts
          </span>
          <Button
            variant="contained"
            size="large"
            fullWidth
            color="primary"
            style={{
              margin: "0px 15px",
              backgroundColor: "#8800ff",
              borderRadius: "40px",
              lineHeight: "2.5",
            }}
          >
            Invite A friend
          </Button>
          <span
            onClick={shareCode}
            style={{
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "13px",
              color: "#8800ff",
            }}
          >
            Share
          </span>
        </Box>
      </div>
    </Wrapper>
  );
};

export default invite;
