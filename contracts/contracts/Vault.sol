// SPDX-License-Identifier
pragma solidity ^0.8.8;

import "hardhat/console.sol"; // To be removed!
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IWETH.sol";

/**@title Novel contract which allow to issue novels in safe and decentralised way
 * @author Kamil Palenik (xRave110)
 * @dev Based on ERC1155, implements its own URI mapping, Pausable
 */
contract Vault is Ownable {
    mapping(address => uint256) internal s_ownerToFunds;
    uint256 internal s_fundsDeposited; // counter which keeps track of amount of funds deposited
    address private s_routerAddress =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; // Uniswap router address for ETH mainnet
    address private s_wethAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    bool private s_processing = false;

    event depositDone(uint256 amount, address indexed depositedTo);

    modifier nonReentrant() {
        require(s_processing == false, "Already processing");
        s_processing = true;
        _;
        s_processing = false;
    }

    constructor() {}

    function setRouter(address _router) public onlyOwner {
        s_routerAddress = _router;
    }

    function setWethAddress(address _wethAddress) public onlyOwner {
        s_wethAddress = _wethAddress;
    }

    receive() external payable {
        if (msg.sender == s_wethAddress) {
            return;
        }
        s_ownerToFunds[msg.sender] += msg.value;
        s_fundsDeposited += msg.value;
        emit depositDone(msg.value, msg.sender);
    }

    function fundVaultWithEth() public payable {
        s_ownerToFunds[msg.sender] += msg.value;
        s_fundsDeposited += msg.value;
        emit depositDone(msg.value, msg.sender);
    }

    function fundVaultWithErc20(uint256 _amount, address _token)
        public
        returns (uint256)
    {
        IERC20 token = IERC20(_token);
        uint256 ethBought = 0;
        uint256 balance = 0;
        require(
            token.allowance(msg.sender, address(this)) >= _amount,
            "There is no amount approved to spend"
        );
        token.transferFrom(msg.sender, address(this), _amount);
        uint256 wethBalanceSender = IWETH(s_wethAddress).balanceOf(msg.sender);
        swapErc20Tokens(_token, s_wethAddress, _amount, address(this));
        uint256 wethBalance = IWETH(s_wethAddress).balanceOf(address(this));
        wethBalanceSender = IWETH(s_wethAddress).balanceOf(msg.sender);
        balance = address(this).balance;
        IWETH(s_wethAddress).withdraw(wethBalance);
        ethBought = address(this).balance - balance; // it considers fee for exchange
        s_ownerToFunds[msg.sender] += ethBought;
        s_fundsDeposited += ethBought;
        //require(wethBalance == ethBought, "Balances wrong");
        wethBalance = IWETH(s_wethAddress).balanceOf(address(this));
        //require(wethBalance == 0, "Balances wrong");
        return ethBought;
    }

    function swapErc20Tokens(
        address _addressFromToken,
        address _addressToToken,
        uint256 _amount,
        address _to
    ) private nonReentrant returns (uint256) {
        IERC20(_addressFromToken).approve(s_routerAddress, _amount);
        address[] memory path;
        path = new address[](2);
        path[0] = _addressFromToken;
        path[1] = _addressToToken;
        uint256 deadline = block.timestamp + 120;
        IUniswapV2Router02 routerContract = IUniswapV2Router02(s_routerAddress);
        require(
            uint256(
                IERC20(_addressFromToken).allowance(
                    address(this),
                    s_routerAddress
                )
            ) >= _amount,
            "Not enough allowance"
        );
        uint256 tokenBalance = IERC20(_addressFromToken).balanceOf(_to);
        uint256 wethBalance = IWETH(_addressToToken).balanceOf(_to);
        uint256[] memory tokenBought = routerContract.swapExactTokensForTokens(
            _amount,
            0,
            path,
            _to,
            deadline
        );
        wethBalance = IWETH(_addressToToken).balanceOf(_to);
        tokenBalance = IERC20(_addressFromToken).balanceOf(_to);
        return tokenBought[1];
    }

    function withdrawFundsFromVault(uint256 _amount) public nonReentrant {
        require(
            s_ownerToFunds[msg.sender] >= _amount,
            "There is not enough funds"
        );
        s_ownerToFunds[msg.sender] -= _amount;
        s_fundsDeposited -= _amount;
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
    }

    function getBalanceOfOwner(address _owner) public view returns (uint256) {
        return s_ownerToFunds[_owner];
    }

    function getVaultBalance() public view returns (uint256) {
        return s_fundsDeposited;
    }
}
