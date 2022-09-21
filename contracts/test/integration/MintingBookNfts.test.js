const { assert, expect } = require("chai")
const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require("../../helper-hardhat-config")
//const { storeImage, storeTokenUriMetadata } = require("../../utils/uploadToPinata")
const { storeBookNFT } = require("../../utils/uploadToNftStorage")
const path = require("path")
const fs = require("fs")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("BookNft", function () {
        let contractOwnerBookNft
        let contentCreatorBookNft
        let followerBookNft
        let contractOwner
        let contentCreator
        let follower
        const imagesFilePath = "./images"
        beforeEach(async () => {
            const accounts = await ethers.getSigners()
            const fullImagesPath = path.resolve(imagesFilePath) // absolute path 
            const files = fs.readdirSync(fullImagesPath)
            contractOwner = accounts[0]
            contentCreator = accounts[1]
            follower = accounts[2]
            // Deploy all contracts tagged with phrase 'all'
            //await deployments.fixture(['all'])
            contractOwnerBookNft = await ethers.getContract("BookNft", contractOwner)
            contentCreatorBookNft = contractOwnerBookNft.connect(contentCreator)
            followerBookNft = contractOwnerBookNft.connect(follower)
            initialBalance = ethers.utils.parseEther('0.002')
            let tx = {
                to: contractOwnerBookNft.address,
                // Convert currency unit from ether to wei
                value: initialBalance
            }
            // Send a transaction
            let balanceOfContentCreator = await contentCreatorBookNft.getBalanceOfOwner(contentCreator.address)
            let balanceOfFollower = await followerBookNft.getBalanceOfOwner(follower.address)
            console.log("Balance of contentCreator %s", balanceOfContentCreator)
            if (balanceOfContentCreator < initialBalance) {
                let txObj = await contentCreator.sendTransaction(tx)
                await txObj.wait()
            }

            console.log("Balance of follower %s", balanceOfFollower)
            if (balanceOfFollower < initialBalance) {
                txObj = await follower.sendTransaction(tx)
                await txObj.wait()
            }
            balanceOfContentCreator = await contentCreatorBookNft.getBalanceOfOwner(contentCreator.address)
            balanceOfFollower = await followerBookNft.getBalanceOfOwner(follower.address)
            contractBalance = await followerBookNft.getVaultBalance()
            console.log("Balances after:\nContentCreator: %s,\nFollower: %s,\nContract: %s", balanceOfContentCreator, balanceOfFollower, contractBalance)

        })
        describe("Integration ERC1155 URI", function () {
            it("mint NFT with proper token URI", async () => {
                //Arrange
                // const deployFee = await ethers.utils.parseEther('0.001')
                // const mintFee = await ethers.utils.parseEther('0.001')
                const fullImagesPath = path.resolve(imagesFilePath) // absolute path 
                const files = fs.readdirSync(fullImagesPath)
                const url = "https://github.com/OWNly-Finance" // path to the book content
                let tokenId = undefined
                const nftDescription = `Book about technical aspect of web3...`
                const name = `Master of web3`
                const amount = 20

                /* NFT Storage */
                console.log("Storing metadata in NFT.storage...")
                const result = await storeBookNFT(
                    fullImagesPath + "/" + files[0],
                    name,
                    nftDescription,
                    url,
                    [{ trait_type: "Technical", value: 10 },
                    { trait_type: "Opinions", value: 7 }])
                console.log("Metadata stored in: %s", result.url)
                const tokenUri = result.url

                //Act
                //console.log("[ContractOwner] Setting deploymentFee to %s", +deployFee)
                //await tx.wait(1)
                console.log("[ContentCreator] Deploying book %s", name)
                tx = await contentCreatorBookNft.deployBook(amount, tokenUri)
                await tx.wait(1)

                let nftTokenUri = await followerBookNft.uri(tokenId.toNumber())
                //console.log("Token URI: %s", nftTokenUri)
                assert.equal(tokenUri, nftTokenUri.toString())

            })
        })
    })
