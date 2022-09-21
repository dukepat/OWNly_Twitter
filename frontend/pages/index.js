import Head from "next/head";
import styles from "../styles/Home.module.css";
import Homepage from "./screens/Homepage";

export default function Home() {
  return (
    <div>
      <Head>
        <title>OWNly App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Homepage />
      </main>
    </div>
  );
}
