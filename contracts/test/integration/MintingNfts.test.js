const { assert, expect } = require("chai")
const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require("../../helper-hardhat-config")
const { storeImage, storeTokenUriMetadata } = require("../../utils/uploadToPinata")
const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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
            // try {
            //     let contractAddress
            //     const fullPath = path.resolve("./deployedContracts/contracts.json") // absolute path 
            //     fs.readFile(fullPath, 'utf8', function readFileCallback(err, data) {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             obj = JSON.parse(data);
            //             contractAddress = obj[network.name]
            //         }
            //     })

            // } catch {
            //     deployerTwitterNft = await twitterNftFactory.deploy()
            //     let jsonObj = {}
            //     jsonObj[`${network.name}`] = `${deployerTwitterNft.address}`
            //     fs.writeFile('./deployedContracts/contracts.json', JSON.stringify(jsonObj), function (err) {
            //         if (err) throw err;
            //         console.log('complete');
            //     });
            // }
            // deployerTwitterNft = await twitterNftFactory.deploy() //temporary deployment happens every time
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
                const tokenFeature = 2
                const transferLimit = 2
                const tweetId = getRandomInt(3000)
                const mintFee = await ethers.utils.parseEther('0.001')
                const imagesFilePath = "./images"
                const fullImagesPath = path.resolve(imagesFilePath) // absolute path 
                const files = fs.readdirSync(fullImagesPath)
                let metadata = {
                    title: "",
                    type: "",
                    properties: {
                        tweetId: "",
                        contentCreator: "",
                        image: "",
                        timestamp: "",
                        attributes: [
                            {
                                numberOfLikes: 0,
                                numberOfShares: 0,
                            }
                        ]
                    }
                }
                let response = await storeImage(fullImagesPath + "/" + files[0])
                console.log("Response: %s", response)

                metadata.title = files[0].replace(".png", "")
                metadata.tweetId = tweetId
                metadata.contentCreator = `twitter user name`
                metadata.image = `ipfs://${response.IpfsHash}`
                metadata.timestamp = response.Timestamp
                const metadataUploadResponse = await storeTokenUriMetadata(metadata)
                console.log("Upload response: %s", metadataUploadResponse)
                const pinataTokenUri = `ipfs://${metadataUploadResponse.IpfsHash}`

                //Act
                // await new Promise(async (resolve, reject) => {
                //     followerTwitterNft.once("ParamsDeployed", async () => {
                //         try {
                //             console.log("ParamsDeployed")
                //             tweetDeployed = await followerTwitterNft.getIfTweetIsDeployed(tweetId)
                //             console.log("Tweet deployed ? %s", tweetDeployed)
                //             resolve() // if try passes, resolves the promise 
                //         } catch (e) {
                //             reject(e) // if try fails, rejects the promise
                //         }
                //     })
                //     followerTwitterNft.once("Transfer", async () => {
                //         try {
                //             console.log("Transfer")
                //             let balance = followerTwitterNft.balanceOf(follower.address)
                //             console.log("Follower balance: %s", balance)
                //             resolve() // if try passes, resolves the promise 
                //         } catch (e) {
                //             reject(e) // if try fails, rejects the promise
                //         }
                //     })
                //     followerTwitterNft.once("TokenUriSet", async () => {
                //         try {
                //             console.log("TokenUriSet")
                //             let nftTokenUri = await followerTwitterNft.tokenURI(0)
                //             console.log("Token URI: %s", nftTokenUri)
                //             resolve() // if try passes, resolves the promise 
                //         } catch (e) {
                //             reject(e) // if try fails, rejects the promise
                //         }
                //     })


                //     console.log("Setting deploymentFee to %s", +deployFee)
                //     let tx = await deployerTwitterNft.setDeployFee(+deployFee)
                //     await tx.wait(1)
                //     console.log("Deploying tweet %s", tweetId)
                //     tx = await contentCreatorTwitterNft.deployNftParams(tokenFeature,
                //         transferLimit,
                //         tweetId,
                //         +mintFee)
                //     await tx.wait(1)

                //     console.log(metadata)
                //     //console.log("Tweet deployed ? %s", tweetDeployed)
                //     console.log(JSON.stringify(metadata))
                //     tweetDeployed = await followerTwitterNft.getIfTweetIsDeployed(tweetId)
                //     console.log("Tweet deployed ? %s", tweetDeployed)
                //     console.log("Minting token from tweet: %s", tweetId)
                //     tx = await followerTwitterNft.mintToken(
                //         tweetId
                //     )
                //     await tx.wait(1)
                //     let balance = followerTwitterNft.balanceOf(follower.address)
                //     console.log("Follower balance: %s", balance)
                //     tx = await followerTwitterNft.setTokenURI(0, JSON.stringify(pinataTokenUri))
                //     await tx.wait(1)
                //     let nftTokenUri = await followerTwitterNft.tokenURI(0)
                //     console.log("Token URI: %s", nftTokenUri)

                //     assert.equal(JSON.stringify(pinataTokenUri), nftTokenUri.toString())
                // })
                console.log("Setting deploymentFee to %s", +deployFee)
                let tx = await deployerTwitterNft.setDeployFee(+deployFee)
                await tx.wait(1)
                console.log("Deploying tweet %s", tweetId)
                tx = await contentCreatorTwitterNft.deployNftParams(tokenFeature,
                    transferLimit,
                    tweetId,
                    +mintFee)
                await tx.wait(1)

                console.log(metadata)
                //console.log("Tweet deployed ? %s", tweetDeployed)
                console.log(JSON.stringify(metadata))
                tweetDeployed = await followerTwitterNft.getIfTweetIsDeployed(tweetId)
                console.log("Tweet deployed ? %s", tweetDeployed)
                console.log("Minting token from tweet: %s", tweetId)
                tx = await followerTwitterNft.mintToken(
                    tweetId
                )
                await tx.wait(1)
                let balance = await followerTwitterNft.balanceOf(follower.address)
                console.log("Follower balance: %s", balance)
                tx = await followerTwitterNft.setTokenURI(0, JSON.stringify(pinataTokenUri))
                await tx.wait(1)
                let nftTokenUri = await followerTwitterNft.tokenURI(0)
                console.log("Token URI: %s", nftTokenUri)

                assert.equal(JSON.stringify(pinataTokenUri), nftTokenUri.toString())

            })
        })
    })