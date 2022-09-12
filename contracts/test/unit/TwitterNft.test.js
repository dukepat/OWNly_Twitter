const { assert, expect } = require("chai")
const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("TwitterNft", function () {
        let twitterNft
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
            twitterNftFactory = await ethers.getContractFactory("TwitterNft")
            twitterNft = await twitterNftFactory.deploy()
        })

        describe("constructor", function () {
            it("deploys ERC721 correctly", async () => {
                expected = {
                    name: "Twitter Token",
                    symbol: "TT"
                }
                const tokenName = await twitterNft.name()
                const tokenSymbol = await twitterNft.symbol()
                assert.equal(tokenName.toString(), expected.name)
                assert.equal(tokenSymbol.toString(), expected.symbol)
            })
        })

        describe("deployToken", function () {
            it("deploys ERC721 parameters customized by the content creator once the deployFee is set", async () => {
                const deployFee = await ethers.utils.parseEther('0.001')
                const tokenFeature = 1
                const transferLimit = 1
                const tweetId = 2221
                const mintFee = await ethers.utils.parseEther('0.001')
                await twitterNft.setDeployFee(+deployFee)
                await twitterNft.deployToken(tokenFeature, transferLimit, tweetId, +mintFee, { value: deployFee }) //from: contentCreator,
                await twitterNft.mintToken("AAAA", tweetId, { value: mintFee }) //from: follower,
                const receivedDeployFee = await twitterNft.getDeployFee()
                const receivedFeature = await twitterNft.getFeatureOfToken(0)
                const receivedTransferLimit = await twitterNft.getTransferLimitOfToken(0)
                const receivedMintFee = await twitterNft.getMintFeeByTokenId(0)
                const receivedTweetId = await twitterNft.getTweeIdByTokenId(0)
                assert.equal(receivedTweetId.toString(), tweetId.toString())
                assert.equal(deployFee.toString(), receivedDeployFee.toString())
                assert.equal(tokenFeature.toString(), receivedFeature.toString())
                assert.equal(transferLimit.toString(), receivedTransferLimit.toString())
                assert.equal(mintFee.toString(), receivedMintFee.toString())

            })
        })

    })