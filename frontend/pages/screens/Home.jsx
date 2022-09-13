// import { coming_soon,ConnectWallet,Footer2,tiktok,tweets } from './Desktop2'
import React from "react";
import Web3 from "web3";
import {
  ConnectWallet,
  Tweets,
  Tiktok,
  ComingSoon,
  UploadTweet,
} from "../../components/Desktop2";
import { contractABI, contractAddress } from "../../abi/TwitterNft";

const Home = () => {
  const web3 = new Web3(Web3.givenProvider);
  // contract address is rinkeby's
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  // contract interaction functions
  const getVaultBalance = async () => {
    let balance = await contract.methods.getVaultBalance().call();
    console.log(balance.toString());
  };
  // end of contract interaction functions
  return (
    <div className="desktop2">
      <div>
        <ConnectWallet />
        <UploadTweet />
        <Tweets />
        <Tiktok />
        <ComingSoon />
      </div>
    </div>
  );
};

export default Home;
