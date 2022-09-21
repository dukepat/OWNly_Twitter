const { network, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const result = await storeBookNFT(fullImagesPath + "/" + files[0])

    log("--------------------")
    console.log(`Main uri: ${result.url}`)
    const args = [result.url]
    const basicNft = await deploy("BookNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, args)

    }
    log("---------------------------------")

}

module.exports.tags = ["all", "book"]

