import { useEffect } from "react";
import {
  About,
  Description,
  Ecosystem,
  Features,
  Navbar,
} from "../../components/Desktop1";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import Footer from "../../components/Footer";

function LandingScreen(props) {
  const router = useRouter();
  const { isAuthenticated } = useMoralis();
  useEffect(() => {
    if (isAuthenticated) router.push("/screens/Home");
  }, [isAuthenticated]);
  return (
    <div className="Desktop1">
      <Navbar />
      <About />
      <Description />
      <Features />
      <Ecosystem />
      <Footer />
    </div>
  );
}

export default LandingScreen;
