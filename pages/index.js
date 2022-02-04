import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/dashboard");
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Hoolaa || Biggest party and reservation app in africa</title>
        <meta
          name="description"
          content="Hoolaa || Biggest party and reservation app in africa"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
