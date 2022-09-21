// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// To be removed import "hardhat/console.sol";

/* Errors */
error BookContract__NotAllowedToAddContent(uint256 tokenId);
error BookContract__NotAllowedToComplete(uint256 tokenId);
error BookContract__BookNotExists(uint256 tokenId);
error BookContract__BookAlreadyCompleted(uint256 tokenId);
error BookContract__NotCreator(uint256 tokenId);
error BookContract__BookAlreadyExist();
error BookContract__InvalidInput();

/* Data structures and enums */
struct Book {
    uint256 tokenId;
    address creator;
    string uri;
    bool isCompleted;
    uint256 createdAt;
    uint256 updatedAt;
}

/**@title Book contract which allow to issue books in safe and decentralised way
 * @author Kamil Palenik (xRave110)
 * @dev Based on ERC1155, implements its own URI mapping, Pausable
 */
contract BookContract is ERC1155, Ownable {
    /* Events */
    event BookCreated(uint256 indexed tokenId, string uri);
    event BookCompleted(uint256 indexed tokenId);
    event ContentAdded(uint256 indexed tokenId);

    /**IPFS storage
     * Name : book title
     * Description: summary
     * Image: ipfs link
     * External_url: website which will have book content restricted to the NFT owners
     */

    /**Centralized server storage (temporary solution - must be visible only for ERC1155 owners)
     * Main content
     */

    /* Blockchain storage */
    mapping(address => uint256[]) private creatorToTokenIds;
    Book[] private books;
    mapping(uint256 => string) uris;
    uint256 transferFee = 0;

    /* Modifiers */
    modifier onlyCreator(uint256 _tokenId) {
        uint256 idx;
        bool found = false;
        for (idx = 0; idx < creatorToTokenIds[msg.sender].length; idx++) {
            if (creatorToTokenIds[msg.sender][idx] == _tokenId) {
                found = true;
            }
        }
        if (!found) {
            revert BookContract__NotCreator(_tokenId);
        }
        _;
    }

    // modifier bookExists(uint256 _tokenId) {
    //     uint256[] memory tokenIds = bookHashToTokenIds[_tokenId];
    //     if (tokenIds.length == 0) {
    //         revert BookContract__BookNotExists(_bookId);
    //     }
    //     _;
    // }

    modifier isNotEmpty(string memory input) {
        if (bytes(input).length == 0) {
            revert BookContract__InvalidInput();
        }
        _;
    }

    modifier bookNotCompleted(uint256 _tokenId) {
        if (books[_tokenId].isCompleted) {
            revert BookContract__BookAlreadyCompleted(_tokenId);
        }
        _;
    }

    constructor(string memory _uri) ERC1155(_uri) {}

    /**
     *
     */
    function setTransferFee(uint256 _fee) public onlyOwner {}

    /**
     *
     */
    function deployBook(uint256 _amount, string memory _uri)
        external
        isNotEmpty(_uri)
    {
        uint256 tokenId = books.length;
        // bytes32 bookHash = keccak256(
        //     abi.encodePacked(msg.sender, _amount, tokenId)
        // );
        books.push(
            Book({
                tokenId: tokenId, //books.length
                creator: msg.sender,
                uri: _uri,
                isCompleted: false,
                createdAt: block.timestamp,
                updatedAt: block.timestamp
            })
        );
        _mint(msg.sender, tokenId, _amount, "");
        emit BookCreated(tokenId, _uri);
    }

    // function safeTransferFrom(
    //     address from,
    //     address to,
    //     uint256 id,
    //     uint256 amount,
    //     bytes memory data
    // ) public virtual override {}

    function modifyBookContent(uint256 _tokenId, string memory _uri)
        external
        onlyCreator(_tokenId)
        bookNotCompleted(_tokenId)
    {
        Book storage bookToModify = books[_tokenId];
        //How to update metadata ?
        bookToModify.uri = _uri;
        bookToModify.updatedAt = block.timestamp;
        _setBookUri(_tokenId, _uri);

        emit ContentAdded(_tokenId);
    }

    function completeBook(uint256 _tokenId)
        external
        onlyCreator(_tokenId)
        bookNotCompleted(_tokenId)
    {
        books[_tokenId].isCompleted = true;
        emit BookCompleted(_tokenId);
    }

    /**
     *
     */
    function _setBookUri(uint256 _tokenId, string memory _uri) private {
        Book storage book = books[_tokenId];
        book.uri = _uri;
    }

    function isTokenOwner(address _account, uint256 _tokenId)
        private
        view
        returns (bool)
    {
        return balanceOf(_account, _tokenId) > 0 ? true : false;
    }

    function getAllBooks() external view returns (Book[] memory) {
        Book[] memory _books = books;
        return _books;
    }

    function uri(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return uris[_tokenId];
    }

    function getBookIdsByCreator(address _creator)
        external
        view
        returns (uint256[] memory)
    {
        return creatorToTokenIds[_creator];
    }
}
