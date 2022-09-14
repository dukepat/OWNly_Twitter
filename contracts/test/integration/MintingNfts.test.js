const { assert, expect } = require("chai")
const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require("../../helper-hardhat-config")
//const { storeImage, storeTokenUriMetadata } = require("../../utils/uploadToPinata")
const { storeNFT } = require("../../utils/uploadToNftStorage")
const path = require("path")
const fs = require("fs")

async function getRandomInt(max, followerTwitterNft) {
    let tweetAlreadyDeployed
    let tweetId
    do {
        tweetId = Math.floor(Math.random() * max)
        tweetAlreadyDeployed = await followerTwitterNft.getIfTweetIsDeployed(tweetId)
        console.log("Tweet %s -> deployed ?: %s", tweetId, tweetAlreadyDeployed)
    } while (tweetAlreadyDeployed)
    return tweetId;
}

developmentChains.includes(network.name)
    ? describe.skip
    : describe("TwitterNft", function () {
        let deployerTwitterNft
        let contentCreatorTwitterNft
        let followerTwitterNft
        let deployer
        let contentCreator
        let follower
        beforeEach(async () => {
            const accounts = await ethers.getSigners()
            deployer = accounts[0]
            contentCreator = accounts[1]
            follower = accounts[2]
            // Deploy all contracts tagged with phrase 'all'
            //await deployments.fixture(['all'])
            deployerTwitterNft = await ethers.getContract("TwitterNft", deployer)
            contentCreatorTwitterNft = deployerTwitterNft.connect(contentCreator)
            followerTwitterNft = deployerTwitterNft.connect(follower)
            initialBalance = ethers.utils.parseEther('0.002')
            let tx = {
                to: deployerTwitterNft.address,
                // Convert currency unit from ether to wei
                value: initialBalance
            }
            // Send a transaction
            let balanceOfContentCreator = await contentCreatorTwitterNft.getBalanceOfOwner(contentCreator.address)
            let balanceOfFollower = await followerTwitterNft.getBalanceOfOwner(follower.address)
            if (balanceOfContentCreator < initialBalance) {
                let txObj = await contentCreator.sendTransaction(tx)
                txObj.wait()
                console.log(txObj)
            }
            console.log("Balance of contentCreator %s", balanceOfContentCreator)

            if (balanceOfFollower < initialBalance) {
                txObj = await follower.sendTransaction(tx)
                txObj.wait()
                console.log(txObj)
            }
            console.log("Balance of follower %s", balanceOfFollower)
            balanceOfContentCreator = await contentCreatorTwitterNft.getBalanceOfOwner(contentCreator.address)
            balanceOfFollower = await followerTwitterNft.getBalanceOfOwner(follower.address)
            contractBalance = await followerTwitterNft.getVaultBalance()
            console.log("Balances after: %s, %s, %s", balanceOfContentCreator, balanceOfFollower, contractBalance)
        })
        describe("Integration ERC721 URI", function () {
            it("mint NFT with proper token URI", async () => {
                //Arrange
                const deployFee = await ethers.utils.parseEther('0.001')
                const transferable = true
                const transferLimit = 2
                const maxMintableAmount = 10
                const tweetId = await getRandomInt(3000, followerTwitterNft)

                const mintFee = await ethers.utils.parseEther('0.001')
                const imagesFilePath = "./images"
                const fullImagesPath = path.resolve(imagesFilePath) // absolute path 
                const files = fs.readdirSync(fullImagesPath)
                const url = "https://github.com/OWNly-Finance"
                let tokenId
                const nftDescription = `Tweet deployed by ${contentCreator.address} and minted by ${follower.address}`
                /* Piniata */
                // let response = await storeImage(fullImagesPath + "/" + files[0])
                // console.log("Response: %s", response)
                // metadata.name = `Ownly tweet ${tweetId}`
                // metadata.description = nftDescription

                // metadata.name = files[0].replace(".png", "")
                // metadata.attributes[0].tweetId = tweetId
                // metadata.attributes[0].contentCreator = `twitter user name`
                // metadata.attributes[0].timestamp = response.Timestamp
                // metadata.image = `ipfs://${response.IpfsHash}`
                // const result = await storeTokenUriMetadata(metadata)
                // console.log("Upload response: %s", result)
                // const tokenUri = `ipfs://${result.IpfsHash}`

                /* NFT Storage */
                const result = await storeNFT(
                    fullImagesPath + "/" + files[0],
                    tweetId,
                    nftDescription,
                    url,
                    contentCreator.address,
                    follower.address,
                    34,
                    12)
                console.log("Upload response: %s", result)
                console.log(result.url)
                const tokenUri = result.url

                //Act
                console.log("Setting deploymentFee to %s", +deployFee)
                let tx = await deployerTwitterNft.setDeployFee(+deployFee)
                await tx.wait(1)
                console.log("Deploying tweet %s", tweetId)
                tx = await contentCreatorTwitterNft.deployNftParams(transferable,
                    transferLimit,
                    tweetId,
                    +mintFee,
                    maxMintableAmount)
                await tx.wait(1)

                tweetDeployed = await followerTwitterNft.getIfTweetIsDeployed(tweetId)
                console.log("Tweet deployed ? %s", tweetDeployed)
                console.log("Minting token from tweet: %s", tweetId)
                tokenId = await followerTwitterNft.getTokenCounter()
                tx = await followerTwitterNft.mintToken(
                    tweetId
                )
                await tx.wait(1)

                console.log(tokenId)
                console.log(tokenId.toNumber())
                let balance = await followerTwitterNft.balanceOf(follower.address)
                console.log("Follower balance: %s", balance)
                console.log("Setting URI with token Id: %s and URI: %s", tokenId.toNumber(), tokenUri) //JSON.stringify(
                tx = await followerTwitterNft.setTokenURI(tokenId.toNumber(), tokenUri) // JSON.stringify(
                await tx.wait(1)
                let nftTokenUri = await followerTwitterNft.tokenURI(tokenId.toNumber())
                console.log("Token URI: %s", nftTokenUri)
                assert.equal(tokenUri, nftTokenUri.toString())

            })
        })
    })