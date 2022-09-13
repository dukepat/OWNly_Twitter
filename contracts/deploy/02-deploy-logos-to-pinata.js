const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")


const imagesLocation = "./images"

const metadataTemplate = {
    tweetId: "",
    contentCreator: "",
    image: "",
    attributes: [
        {
            numberOfLikes: 0,
            numberOfShares: 0,
        }
    ]
}

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let tokenUris

    // get IPFS hashes of our images 
    tokenUris = await handleTokenUris()

    // temporary commented out
    //await storeImages(imagesLocation)
    const args = []

    const TwitterNft = await deploy("TwitterNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("--------------------------------")
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(TwitterNft.address, args)

    }
}

async function handleTokenUris() {
    tokenUris = []
    // store the image in IPFS
    // store metadata in IPFS

    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponsesIdx in imageUploadResponses) {

        //create metadata
        //upload metadata
        let tokenUriMetadata = { ...metadataTemplate } // copy, unpacking syntax
        tokenUriMetadata.tweetId = files[imageUploadResponsesIdx].replace(".png", "")
        tokenUriMetadata.contentCreator = `twitter user name`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIdx].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.tweetId}...`)
        //store the JSON to pinata / IPFS
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs Uploaded! They are:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "ipfs", "main"]