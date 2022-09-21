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
        let contractOwnerTwitterNft
        let contentCreatorTwitterNft
        let followerTwitterNft
        let contractOwner
        let contentCreator
        let follower
        beforeEach(async () => {
            const accounts = await ethers.getSigners()
            contractOwner = accounts[0]
            contentCreator = accounts[1]
            follower = accounts[2]
            // Deploy all contracts tagged with phrase 'all'
            //await deployments.fixture(['all'])
            contractOwnerTwitterNft = await ethers.getContract("TwitterNft", contractOwner)
            contentCreatorTwitterNft = contractOwnerTwitterNft.connect(contentCreator)
            followerTwitterNft = contractOwnerTwitterNft.connect(follower)
            initialBalance = ethers.utils.parseEther('0.002')
            let tx = {
                to: contractOwnerTwitterNft.address,
                // Convert currency unit from ether to wei
                value: initialBalance
            }
            // Send a transaction
            let balanceOfContentCreator = await contentCreatorTwitterNft.getBalanceOfOwner(contentCreator.address)
            let balanceOfFollower = await followerTwitterNft.getBalanceOfOwner(follower.address)
            console.log("Balance of contentCreator %s", balanceOfContentCreator)
            if (balanceOfContentCreator < initialBalance) {
                let txObj = await contentCreator.sendTransaction(tx)
                txObj.wait()
            }

            console.log("Balance of follower %s", balanceOfFollower)
            if (balanceOfFollower < initialBalance) {
                txObj = await follower.sendTransaction(tx)
                txObj.wait()
            }

            balanceOfContentCreator = await contentCreatorTwitterNft.getBalanceOfOwner(contentCreator.address)
            balanceOfFollower = await followerTwitterNft.getBalanceOfOwner(follower.address)
            contractBalance = await followerTwitterNft.getVaultBalance()
            console.log("Balances after:\nContentCreator: %s,\nFollower: %s,\nContract: %s", balanceOfContentCreator, balanceOfFollower, contractBalance)
        })
        describe("Integration ERC721 URI", function () {
            it("mint NFT with proper token URI", async () => {
                //Arrange
                const NR_OF_LIKES = 32
                const NR_OF_SHARES = 12
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
                let tokenId = undefined
                const nftDescription = `Tweet deployed by ${contentCreator.address} and minted by ${follower.address}`

                /* NFT Storage */
                console.log("Storing metadata in NFT.storage...")
                const result = await storeNFT(
                    fullImagesPath + "/" + files[0],
                    tweetId,
                    nftDescription,
                    url,
                    NR_OF_LIKES,
                    NR_OF_SHARES)
                console.log("Metadata stored in: %s", result.url)
                const tokenUri = result.url

                //Act
                console.log("[ContractOwner] Setting deploymentFee to %s", +deployFee)
                let tx = await contractOwnerTwitterNft.setDeployFee(+deployFee)
                await tx.wait(1)
                console.log("[ContentCreator] Deploying tweet %s", tweetId)
                tx = await contentCreatorTwitterNft.deployNftParams(transferable,
                    transferLimit,
                    tweetId,
                    +mintFee,
                    maxMintableAmount)
                await tx.wait(1)

                tweetDeployed = await followerTwitterNft.getIfTweetIsDeployed(tweetId)
                //console.log("Tweet deployed ? %s", tweetDeployed)
                console.log("[Follower] Minting token from tweet: %s", tweetId)
                tokenId = await followerTwitterNft.getTokenCounter()
                tx = await followerTwitterNft.mintToken(
                    tweetId
                )
                await tx.wait(1)

                let balance = await followerTwitterNft.balanceOf(follower.address)
                //console.log("Follower balance: %s", balance)
                console.log("[Follower] Setting URI with token Id: %s and URI: %s", tokenId.toNumber(), tokenUri) //JSON.stringify(
                tx = await followerTwitterNft.setTokenURI(tokenId.toNumber(), tokenUri) // JSON.stringify(
                await tx.wait(1)
                let nftTokenUri = await followerTwitterNft.tokenURI(tokenId.toNumber())
                //console.log("Token URI: %s", nftTokenUri)
                assert.equal(tokenUri, nftTokenUri.toString())

            })
        })
    })