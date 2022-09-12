// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

//Imports
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Errors (gas optimalization) Q5: Do we need it ?
// error TwitterNft__NeedMoreETHSent();
error TwitterNft__TransferNotPossible();

// Q1: Contract per social or all socials in one contract ?
contract TwitterNft is ERC721URIStorage, Ownable {
    // Types
    enum Feature {
        NON_TRANSFERABLE,
        TRANSFERABLE,
        TRANSFERABLE_N_TIMES
    }

    // Structs
    struct tweetFeatures {
        Feature feature;
        address contentCreator;
        uint256 transferLimit;
        uint256[] tokenIDs;
        bool isDeployed;
        uint256 mintFee;
    }

    // Modifiers
    // modifier onlyContentOwner() {
    //     require(
    //         s_tweetIdToFeatures[_tweetId].owner == msg.sender,
    //         "You are not a content owner!"
    //     );
    //     _;
    // }

    // Variables
    uint256 private deployFee = 0;
    uint256 private creatorShare = 80;
    uint256 internal s_tokenCounter;
    mapping(uint256 => tweetFeatures) internal s_tweetIdToFeatures;
    mapping(uint256 => uint256) internal s_tokenIdToTransferCounter;
    mapping(uint256 => uint256) internal s_tokenIdToTweetId;

    // Q7: Do we need additional mapping mintersToContentCreator in the contract ? Yes
    // It would allow us to easier share of revenue with owners

    // Events

    // Q2: What should be naming convention for tokens ?
    constructor() ERC721("Twitter Token", "TT") {}

    // Setters
    function setDeployFee(uint256 _deployFee) public onlyOwner {
        //Value in wei
        deployFee = _deployFee;
    }

    function setCreatorShare(uint256 _creatorShare) public onlyOwner {
        require(
            _creatorShare > 0 && _creatorShare <= 100,
            "Not proper value of share"
        );
        creatorShare = _creatorShare;
    }

    // Can be called only by the content creator - name to be changed
    function deployToken(
        uint256 _tokenFeature,
        uint256 _transferLimit,
        uint256 _tweetId,
        uint256 _mintFee
    ) public payable {
        require(_tokenFeature < 3, "Wrong value");
        require(msg.value >= deployFee, "Need more ETH");
        require(
            !s_tweetIdToFeatures[_tweetId].isDeployed,
            "This tweet is already deployed"
        );
        s_tweetIdToFeatures[_tweetId].feature = Feature(_tokenFeature);
        s_tweetIdToFeatures[_tweetId].transferLimit = _transferLimit;
        s_tweetIdToFeatures[_tweetId].contentCreator = msg.sender; //Q9: How we get guarancy that it is a true owner ? Verification process done on server is enough ?
        s_tweetIdToFeatures[_tweetId].isDeployed = true;
        s_tweetIdToFeatures[_tweetId].mintFee = _mintFee;
    }

    function mintToken(string memory _tokenUri, uint256 _tweetId)
        public
        payable
        returns (uint256)
    {
        uint256 newTokenId = s_tokenCounter;
        require(
            s_tweetIdToFeatures[_tweetId].isDeployed,
            "This NFT is not deployed by content creator!"
        );
        require(
            msg.value >= s_tweetIdToFeatures[_tweetId].mintFee,
            "Need more ETH"
        );
        s_tokenCounter += 1;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenUri);
        s_tweetIdToFeatures[_tweetId].tokenIDs.push(newTokenId);
        s_tokenIdToTransferCounter[newTokenId] = 0;
        s_tokenIdToTweetId[newTokenId] = _tweetId;
        uint256 feeToCreator = (msg.value * creatorShare) / 100;
        // Here can be created some kind of tracking to accumulate creators fees in the contract and allow to withdraw when te amount will be higher than X
        (bool success, ) = payable(s_tweetIdToFeatures[_tweetId].contentCreator)
            .call{value: feeToCreator}("");
        require(success, "Transfer Failed");
        return newTokenId;
    }

    function withdraw() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: contractBalance}("");
        require(success, "Transfer Failed");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        uint256 tweetId = s_tokenIdToTweetId[tokenId];
        Feature tokenFeature = s_tweetIdToFeatures[tweetId].feature;
        //uint256 tokenTimeLimit = s_tweetIdToFeatures[tweetId].timeLimit;
        uint256 tokenTransferLimit = s_tweetIdToFeatures[tweetId].transferLimit;

        if (tokenFeature == Feature.NON_TRANSFERABLE) {
            // if (
            //     tokenFeature == Feature.NON_TRANSFERABLE_TIME_LIMITED &&
            //     tokenTimeLimit <= block.timestamp
            // ) {
            //     super._burn(tokenId); // time limitation will not be possible because NFT owner must to approve the burning
            // }
            // token not transferable - prevent transfer
            revert TwitterNft__TransferNotPossible();
            // } else if (
            //     (tokenFeature.feature ==
            //         Feature.TRANSFERABLE_N_TIMES_TIME_LIMITED ||
            //         tokenFeature.feature == Feature.TRANSFERABLE_N_TIMES) &&
            //     tokenFeature.timeLimit <= block.timestamp
            // ) {
            //     super._burn(tokenId); // time limitation will not be possible because NFT owner must to approve the burning
            //     revert TwitterNft__TransferNotPossible();
        } else if (tokenFeature == Feature.TRANSFERABLE_N_TIMES) {
            if (s_tokenIdToTransferCounter[tokenId] >= tokenTransferLimit) {
                revert TwitterNft__TransferNotPossible();
            } else {
                // prevent transfer
                super.transferFrom(from, to, tokenId);
                s_tokenIdToTransferCounter[tokenId]++;
            }
        }
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public virtual override {
        uint256 tweetId = s_tokenIdToTweetId[tokenId];
        Feature tokenFeature = s_tweetIdToFeatures[tweetId].feature;
        //uint256 tokenTimeLimit = s_tweetIdToFeatures[tweetId].timeLimit;
        uint256 tokenTransferLimit = s_tweetIdToFeatures[tweetId].transferLimit;

        if (tokenFeature == Feature.NON_TRANSFERABLE) {
            // if (
            //     tokenFeature == Feature.NON_TRANSFERABLE_TIME_LIMITED &&
            //     tokenTimeLimit <= block.timestamp
            // ) {
            //     super._burn(tokenId); // time limitation will not be possible because NFT owner must to approve the burning
            // }
            // token not transferable - prevent transfer
            revert TwitterNft__TransferNotPossible();
            // } else if (
            //     (tokenFeature.feature ==
            //         Feature.TRANSFERABLE_N_TIMES_TIME_LIMITED ||
            //         tokenFeature.feature == Feature.TRANSFERABLE_N_TIMES) &&
            //     tokenFeature.timeLimit <= block.timestamp
            // ) {
            //     super._burn(tokenId); // time limitation will not be possible because NFT owner must to approve the burning
            //     revert TwitterNft__TransferNotPossible();
        } else if (tokenFeature == Feature.TRANSFERABLE_N_TIMES) {
            if (s_tokenIdToTransferCounter[tokenId] >= tokenTransferLimit) {
                revert TwitterNft__TransferNotPossible();
            } else {
                // prevent transfer
                super.safeTransferFrom(from, to, tokenId, data);
                s_tokenIdToTransferCounter[tokenId]++;
            }
        }
    }

    // Getters of internal/private variables (gas optimalization)
    // function getContentOwner() public view returns (address) {
    //     // Q8: call external interface to get the owner ?
    //     return
    // }

    function getContentCreatorShareOfMintFee() public view returns (uint256) {
        return creatorShare;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getDeployFee() public view returns (uint256) {
        return deployFee;
    }

    function getFeatureOfToken(uint256 _tokenId) public view returns (Feature) {
        return s_tweetIdToFeatures[_tokenId].feature;
    }

    function getTransferLimitOfToken(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return s_tweetIdToFeatures[s_tokenIdToTweetId[_tokenId]].transferLimit;
    }

    function getTransferCounterOfToken(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return s_tokenIdToTransferCounter[_tokenId];
    }

    function getMintFeeByTokenId(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return s_tweetIdToFeatures[s_tokenIdToTweetId[_tokenId]].mintFee;
    }

    function getTweeIdByTokenId(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return s_tokenIdToTweetId[_tokenId];
    }

    function getTokenIdsByTweetId(uint256 tweetId)
        public
        view
        returns (uint256[] memory)
    {
        return s_tweetIdToFeatures[tweetId].tokenIDs;
    }

    // function getTweetIdsByContentOwner(address contentOwner)
    //     public
    //     view
    //     returns (uint256[] memory)
    // {

    // }
}
