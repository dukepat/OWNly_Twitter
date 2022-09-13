import "../styles/globals.css";
import "../styles/App.css";
import "../styles/main.css";
import { MoralisProvider } from "react-moralis";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  console.log(
    process.env.NEXT_PUBLIC_APP_ID,
    process.env.NEXT_PUBLIC_SERVER_URL
  );
  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_APP_ID}
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL}
    >
      <ChakraProvider resetCSS>
        <Component {...pageProps} />
      </ChakraProvider>
    </MoralisProvider>
  );
}

export default MyApp;
