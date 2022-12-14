import React, { useRef, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import { contractABI, contractAddress } from "../../abi/TwitterNft";
import DeployTweet from "../../components/molecules/DeployTweet";
import Navigation from "../../components/atoms/Navigation";

const App = () => {
  const web3ModalRef = useRef();
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  let myProvider;
  // contract address is rinkeby's
  const getProviderOrSigner = async (needSigner = false) => {
    // We need to gain access to the provider/signer from metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If the user is not connected to Mumbai, tell to switch to Mumbai

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Please switch to the Mumbai network");
      throw new Error("Incorrect network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };
  const getContract = async (withSigner = false) => {
    const provider = await getProviderOrSigner(withSigner);
    setContract(new ethers.Contract(contractAddress, contractABI, provider));
  };
  const getAccounts = async () => {
    myProvider = await getProviderOrSigner(false);
    let accounts = await myProvider.send("eth_requestAccounts", []);
    setAddress(accounts[0]);
  };
  myProvider &&
    myProvider.on("accountsChanged", function (accounts) {
      setAddress(accounts[0]);
    });
  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "mumbai",
      providerOptions: {},
      disableInjectedProvider: false,
    });
    getContract(true);
    getAccounts();
  }, []);
  return (
    <>
      <Navigation contract={contract} address={address} />
      <DeployTweet contract={contract} />
    </>
  );
};

export default App;
