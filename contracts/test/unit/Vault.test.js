const { assert, expect } = require("chai")
const { network, provider, deployments, ethers } = require('hardhat')
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Vault", function () {
        const IERC20_SOURCE = "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20";
        let deployerVault
        let contentCreatorVault
        let followerVault
        let deployer
        let contentCreator
        let follower
        let iWeth
        let initialBalance
        beforeEach(async () => {
            const accounts = await ethers.getSigners()
            deployer = accounts[0]
            contentCreator = accounts[1]
            follower = accounts[2]
            // Deploy all contracts tagged with phrase 'all'
            //await deployments.fixture(['all'])
            vaultFactory = await ethers.getContractFactory("Vault")
            deployerVault = await vaultFactory.deploy()
            contentCreatorVault = deployerVault.connect(contentCreator)
            followerVault = deployerVault.connect(follower)
            iWeth = await ethers.getContractAt("IWETH", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", follower)
            initialBalance = ethers.utils.parseEther('0.01')
            let tx = {
                to: deployerVault.address,
                // Convert currency unit from ether to wei
                value: initialBalance
            }
            // Send a transaction
            let txObj = await deployer.sendTransaction(tx)
        })

        describe("Vault", function () {
            it("receives eth deposit and inreasing balance", async function () {
                let amount = ethers.utils.parseEther('0.01')
                let tx = {
                    to: deployerVault.address,
                    // Convert currency unit from ether to wei
                    value: amount
                }
                // Send a transaction
                let txObj = await follower.sendTransaction(tx)
                console.log('txHash', txObj.hash)
                const followerBalance = await followerVault.getBalanceOfOwner(follower.address)
                const contractBalance = await followerVault.getVaultBalance()
                assert.equal(amount.toString(), followerBalance.toString())
                assert.equal((amount.add(initialBalance)).toString(), contractBalance.toString())
            })
            it("receives erc20 deposit and inreasing balance", async function () {
                const routerAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
                let iUniswapV2Router = await ethers.getContractAt("IUniswapV2Router02", routerAddress, follower)
                const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
                let usdcContract = await ethers.getContractAt(IERC20_SOURCE, USDC, follower)
                let ethAmount = ethers.utils.parseEther('0.6')
                await iWeth.deposit({ value: ethAmount })
                await iWeth.approve(routerAddress, ethAmount)
                const path = [iWeth.address.toString(), USDC]
                const blockNumber = await ethers.provider.getBlockNumber()
                const timestamp = await (await ethers.provider.getBlock(blockNumber)).timestamp + 120
                console.log("Swapping... %s (%s)", ethAmount, +ethAmount)
                let tx = await iUniswapV2Router.swapExactTokensForTokens(ethAmount, 0, path, follower.address, timestamp)
                transactionReceipt = await tx.wait()
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const gasCost = gasUsed.mul(effectiveGasPrice)
                console.log("Succesfully swapped")
                let usdcFollowerBalance = await usdcContract.balanceOf(follower.address)
                console.log("Balance of the follower: %s", usdcFollowerBalance)
                const followerBalanceBeforeFund = await followerVault.getBalanceOfOwner(follower.address)
                const contractBalanceBeforeFund = await followerVault.getVaultBalance()
                await usdcContract.approve(followerVault.address, usdcFollowerBalance)
                tx = await followerVault.fundVaultWithErc20(usdcFollowerBalance, USDC)

                const expectedAmountOfEth = await iUniswapV2Router.getAmountsOut(usdcFollowerBalance, [USDC, iWeth.address.toString()])
                const followerBalanceAfterFund = await followerVault.getBalanceOfOwner(follower.address)
                const contractBalanceAfterFund = await followerVault.getVaultBalance()
                console.log("Follower Balance: %s  Contract balance: %s", followerBalanceAfterFund, contractBalanceAfterFund)
                assert.isAbove(parseInt(followerBalanceBeforeFund.add(expectedAmountOfEth[1]).add(gasCost)), parseInt(followerBalanceAfterFund))
                assert.isAbove(parseInt(contractBalanceBeforeFund.add(expectedAmountOfEth[1]).add(gasCost)), parseInt(contractBalanceAfterFund))
                assert.isBelow(parseInt(followerBalanceBeforeFund.add(expectedAmountOfEth[1])), parseInt(followerBalanceAfterFund))
                assert.isBelow(parseInt(contractBalanceBeforeFund.add(expectedAmountOfEth[1])), parseInt(contractBalanceAfterFund))
            })
            it("allows for withdrawals funds", async () => {
                let amount = ethers.utils.parseEther('0.01')
                let tx = {
                    to: deployerVault.address,
                    // Convert currency unit from ether to wei
                    value: amount
                }
                // Send a transaction
                let txObj = await follower.sendTransaction(tx)
                console.log('txHash', txObj.hash)
                const followerBalanceBeforeWithdrawal = await followerVault.getBalanceOfOwner(follower.address)
                const contractBalanceBeforeWithdrawal = await followerVault.getVaultBalance()
                await followerVault.withdrawFundsFromVault(amount)
                const followerBalanceAfterWithdrawal = await followerVault.getBalanceOfOwner(follower.address)
                const contractBalanceAfterWithdrawal = await followerVault.getVaultBalance()
                assert.equal(parseInt(followerBalanceBeforeWithdrawal), parseInt(followerBalanceAfterWithdrawal.add(amount)))
                assert.equal(parseInt(contractBalanceBeforeWithdrawal), parseInt(contractBalanceAfterWithdrawal.add(amount)))
            })
        })
    })