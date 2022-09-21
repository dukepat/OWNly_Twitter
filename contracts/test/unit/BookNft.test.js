const { assert, expect } = require("chai")
const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require("../../helper-hardhat-config")
const { storeBookNFT } = require("../../utils/uploadToNftStorage")
/* const { storeImage, storeTokenUriMetadata } = require("../../utils/uploadToPinata") */
const path = require("path")
const fs = require("fs")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BookNft", function () {
        let contractOwnerBookNft
        let contentCreatorBookNft
        let followerBookNft
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
            bookNftFactory = await ethers.getContractFactory("BookNft")
            contractOwnerBookNft = await BookNftFactory.deploy()
            contentCreatorBookNft = contractOwnerBookNft.connect(contentCreator)
            followerBookNft = contractOwnerBookNft.connect(follower)
            initialBalance = ethers.utils.parseEther('0.01')
            let tx = {
                to: contractOwnerBookNft.address,
                // Convert currency unit from ether to wei
                value: initialBalance
            }
            // Send a transaction
            let txObj = await contentCreator.sendTransaction(tx)
            console.log(txObj)
            txObj = await follower.sendTransaction(tx)
            console.log(txObj)
        })
    })
