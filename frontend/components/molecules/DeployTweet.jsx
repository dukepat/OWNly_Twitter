import Head from "next/head";
import { useState, useRef, useEffect } from "react";

import axios from "axios";
import domtoimage from "dom-to-image";
import { File, NFTStorage } from "nft.storage";
import mime from "mime";
import { saveAs } from "file-saver";
import Header from "../atoms/Header";
import Main from "../atoms/Main";
import Settings from "../atoms/Settings";

import { Text, Box, Flex, Input, Select, Button } from "@chakra-ui/react";
import { BigNumber } from "ethers";

function DeployTweet({ contract }) {
  const [bg, setBg] = useState(
    "linear-gradient(106.8deg, rgb(117, 255, 220) 6%, rgb(163, 216, 255) 47.6%, rgb(248, 215, 251) 87.8%)"
  );

  const tweetRef = useRef(null);

  const [tweetData, setTweetData] = useState(null);
  const [tweetIsDeployed, setTweetIsDeployed] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showSource, setShowSource] = useState(true);

  const [scale, setScale] = useState(0.9);

  const [hint, setHint] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // form props
  const [tweetId, setTweetId] = useState(0);
  const [mintFee, setMintFee] = useState(0);
  const [transferLimit, setTransferLimit] = useState(0);
  const [mintLimit, setMintLimit] = useState(0);
  const [tweetImageURL, setTweetImageURL] = useState("");

  const checkIfDeployed = async (id) => {
    try {
      const response = await contract.getIfTweetIsDeployed(id);
      setTweetIsDeployed(response);
    } catch (error) {
      console.log(error);
    }
  };
  const convert = async (format) => {
    const node = tweetRef.current;
    const scale = 2;

    let dataUrl;

    const style = {
      transform: "scale(2)",
      transformOrigin: "top left",
    };

    const param = {
      height: node.offsetHeight * scale,
      width: node.offsetWidth * scale,
      quality: 1,
      style,
    };

    switch (format) {
      case "png": {
        dataUrl = await domtoimage.toPng(node, param);
        setTweetImageURL(dataUrl);
        return;
      }

      case "jpeg": {
        dataUrl = await domtoimage.toJpeg(node, param);
        setTweetImageURL(dataUrl);
        return;
      }

      case "svg": {
        dataUrl = await domtoimage.toSvg(node, param);
        setTweetImageURL(dataUrl);
        return;
      }
    }
  };
  const bringTweet = async (e) => {
    try {
      e.preventDefault();
      setHint(false);
      setLoading(true);
      
      const url = e.target.elements.tweetURL.value;
      const id = url.split("/")[5];
      setTweetId(id);
      const { data, status } = await axios.get(`/api/tweet/${id}`);
      if (data.message) {
        setError(true);
        setLoading(false);
        setTweetData(null);
      } else {
        setLoading(false);
        setTweetData(data.data);
        checkIfDeployed(id);
        setError(false);
      }
    } catch (e) {
      setError(true);
      setLoading(false);
      setTweetData(null);
    }
  };
//<<<<<<< HEAD

  // const convert = async (format) => {
  //   const node = tweetRef.current;
  //   const scale = 2;

  //   let dataUrl;

  //   const style = {
  //     transform: "scale(2)",
  //     transformOrigin: "top left",
  //   };

  //   const param = {
  //     height: node.offsetHeight * scale,
  //     width: node.offsetWidth * scale,
  //     quality: 1,
  //     style,
  //   };

  //   switch (format) {
  //     case "png": {
  //       dataUrl = await domtoimage.toPng(node, param);
  //       let savedItem = saveAs(dataUrl, `${new Date().toJSON()}.${format}`);
  //       return savedItem;
  //     }

  //     case "jpeg": {
  //       dataUrl = await domtoimage.toJpeg(node, param);
  //       let savedItem = saveAs(dataUrl, `${new Date().toJSON()}.${format}`);
  //       return savedItem;
  //     }

  //     case "svg": {
  //       dataUrl = await domtoimage.toSvg(node, param);
  //       let savedItem = saveAs(dataUrl, `${new Date().toJSON()}.${format}`);
  //        return savedItem;
  //     }
      
  const fileFromURL = async (tweetImageURL) => {
    const type = mime.getType("png");
    return new File([tweetImageURL], "tweetImage", { type });
  };
  const storeTweetImage = async (
    file,
    name = "",
    description = "",
    external_url = "",
    listOfAttributes = undefined
  ) => {
    try {
      const image = await fileFromURL(file);
      const nftStorage = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY,
      });
      const response = await nftStorage.store({
        image,
        name,
        description,
        external_url,
        attributes: listOfAttributes,
      });
      console.log(response);
      return response;
    } catch (error) {
      throw error;
    }
  };
  const deployTweet = async () => {
    console.log(transferLimit, tweetId, mintFee, mintLimit);
    try {
      const nftResponse = await storeTweetImage(tweetImageURL);
      const chainResponse = await contract.deployNftParams(
        transferLimit > 0 ? true : false,
        parseInt(transferLimit),
        BigNumber.from(tweetId),
        parseInt(mintFee),
        parseInt(mintLimit)
      );
      console.log(nftResponse, chainResponse);
    } catch (error) {
      console.log(error);
    }
  };
  const propsForSettings = {
    showTime,
    setShowTime,
    showMetrics,
    setShowMetrics,
    showSource,
    setShowSource,
    scale,
    setScale,
    convert,
    bg,
    setBg,
    tweetIsDeployed,
    deployTweet,
    setMintLimit,
    setMintFee,
    setTransferLimit,
  };

  const flex = { base: "column", lg: "row" };

  return (
    <Box>
      <Header bringTweet={bringTweet} />

      <Flex my="16" direction={flex} p="4">
        <Main
          tweetRef={tweetRef}
          bg={bg}
          scale={scale}
          hint={hint}
          loading={loading}
          error={error}
          tweetData={tweetData}
          showTime={showTime}
          showMetrics={showMetrics}
          showSource={showSource}
        />
        {!hint && <Settings props={propsForSettings} />}
      </Flex>
    </Box>
  );
}
export default DeployTweet;
