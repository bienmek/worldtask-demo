import '../styles/globals.css'
import Head from "next/head";
import Navbar from "../components/Navbar";
import {NotificationProvider} from "@web3uikit/core";

function MyApp({ Component, pageProps }) {
  return (
      <div>
          <Head>
              <title>World Task</title>
              <meta name="description" content="NFT Marketplace" />
          </Head>
          <Navbar />
          <NotificationProvider>
              <Component {...pageProps} />
          </NotificationProvider>
      </div>

  )
}

export default MyApp
