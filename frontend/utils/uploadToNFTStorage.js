import { File, NFTStorage } from "nft.storage";
import mime from "mime";

const fileFromURL = async (tweetImageURL) => {
  const type = mime.getType("png");
  return new File([tweetImageURL], "tweetImage", { type });
};
export const storeTweetImage = async (
  file,
  name = "",
  description = "",
  external_url = "",
  listOfAttributes = undefined
) => {
  console.log(process.env.NEXT_APP_NFT_STORAGE_KEY);
  try {
    const image = await fileFromURL(file);
    const nftStorage = new NFTStorage({
      token: process.env.NEXT_APP_NFT_STORAGE_KEY,
    });
    const response = await nftStorage.store({
      image,
      name,
      description,
      external_url,
      attributes: listOfAttributes,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
