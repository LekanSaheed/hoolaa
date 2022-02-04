import { useRouter } from "next/router";
import React from "react";

const Tx = () => {
  const router = useRouter();
  React.useEffect(() => {
    console.log(router);
  }, []);
  return (
    <div>
      {JSON.stringify(router)}
      Transaction success will show here
    </div>
  );
};

export default Tx;
