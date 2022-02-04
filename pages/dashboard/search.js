import { useRouter } from "next/router";
import React from "react";
import Wrapper from "../../components/Wrapper";

const Search = () => {
  const router = useRouter();
  return <Wrapper>{router.query.q}</Wrapper>;
};

export default Search;
