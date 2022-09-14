# OWNly smart contracts

## Table of content

- [OWNly smart contracts](#ownly-smart-contracts)
  - [Table of content](#table-of-content)
  - [Twitter NFTs](#twitter-nfts)
    - [Deployment](#deployment)
    - [Minting](#minting)
    - [Main storage](#main-storage)
    - [Vault](#vault)
  - [Contract features](#contract-features)
    - [Interfaces for frontend](#interfaces-for-frontend)
  - [ToDo](#todo)
    - [Legend](#legend)
    - [Points that need clarification/improvement](#points-that-need-clarificationimprovement)

## Twitter NFTs

### Deployment
Twitter NFT must be deployed by content creator to be able to mint. Content creator can deploy NFT template with different parameters like:
- Fee charged during minting NFT
- Transfer posibilities:
  - [x] TRANSFERABLE/NON_TRANSFERABLE 
  - [x] LIMITED TO NUMBER OF TRANSACTIONS
  - [x] FEE FOR MINTING - changeable after deployment ?
  - [x] MAX SUPPLY
  
- Deployment costs ceratin amount of fee which is set by contract owner.

### Minting
After deployment, the followers can mint creator's tweet as a NFTs. In order to mint them they must pay certain amount of money (established by content creator during deployment). The part of money go to the protocol and the rest to the content creator. The URI with URL from IPFS will be inserted with other parameters into a NFT.

### Main storage
The main storage is a tweet ID mapping to the structure of parameters. Thanks to that from each tweet ID deployed, it is possible to get:
- contentCreator
- transferable (bool)
- transfer limit
- minted token IDs
- mint fee
- max mintable amount

### Vault
Vault is a mapping of the balance for each user who wants to deposit some funds into the vault. Vault allows to pay protocol fee internally without using wallet signature every time.

## Contract features
Contract withdrawal is only possible by contract owner and it withdraws all the funds.

### Interfaces for frontend
- deployNftParams(
        bool _transferable,
        uint256 _transferLimit,
        uint256 _tweetId,
        uint256 _mintFee,
        uint256 _maxMintableAmount
    ) -> allows content creator to deploy template of his social NFT (set features of NFT and mintFee)
- mintToken(uint256 _tweetId) -> allows to mint token by the follower (possibility to set URI here)
- setTokenURI(uint256 _tokenId, string memory _tokenUri)
- getMintFeeByTweetId(uint256 _tweetId) -> allows to get information what is the fee for minting particular tweet
- getDeployFee() -> allows to get information about current deployment fee
- getTokenIdsByTweetId(uint256 tweetId) -> allows to get all token IDs associated with certain tweet (can be used for statisctics)
- receive() -> allows to get transaction in native token of the blockchain, so the button shall send transaction
- fundVaultWithEth() -> allows to fund vault with ETH
- fundVaultWithErc20(uint256 _amount, address _token) -> allows to send ERC20 tokens to the smart contract vault - all tokens sent will be swapped to the blockchain native token !!
- withdrawFundsFromVault(uint256 _amount) -> allows to withdraw funds from user's vault

## ToDo
- [x] ERC721 standard with URI storage as a base (+++)
- [x] Main storage mapping for contact (+++)
- [x] Changeable deployment and minting fees (+++)
- [x] All fees keep changeable by the owner, besides mintFee which will be set by the content creator (+++)
- [x] Vault smart contract which keep user's balances and interact with other contracts on behalf of users (+++)
- [x] Swap functionality to keep only one (base) currency mapping in the Vault (the rest will be automatically swapped to the base currency) (+++)
- [x] ContentCreatorToTweetIds mapping (+++)
- [x] Getter tweetId and tokenId to follower (+++)
- [x] Events (+++)
- [x] IPFS scripts pinata (+++)
- [x] IPFS scripts NFT storage (+++)

- [x] Deployment on testnets (goerli, rinkeby) (+++)
- [x] Deployment on testnets (mumbai) (+++)
- [x] Open Sea metadata adjustemnts (+++)
- [ ] Deployments scripts and testing of Vault (+++) [in progress]
- [ ] Deployments scripts and testing of TwitterNft (+++) [in progress]
- [ ] Integration tests (+++) [in progress]
- [x] kindly add a parameter `maxMintableAmount` in the `tweetFeatures` Struct  to set the maximum amount of tokens that can be minted. This is to be set by the deployer. Do check for this condition before minting as well (+++)
- [x] Set another variable, a mapping this time, which can be mapped to tweetId but is somewhat global- `globalMaxMintableAmount`. This variable sets the global maximum amount of tokens that can be minted. The `maxMintableAmount` above must always be less this value. The setter for this must be Us- contract owner (+++)
- [x] Change the transferability to `bool`. Either it is transferable or not. The non-transferables are the NFTs from fundraisers. Since we have maximum mintable amount of tokens, we can allow for unlimited transfers (+++)
- [ ] Unique background id for each NFT minted (++)
- [ ] Parent contract for all social platforms which will be inherited (++)
- [ ] Security review (reentrancy attack etc.) (++)
- [ ] Monthly plans e.g 1000 tweets per month type examples: silver / gold / platinum. Plans should be customizable by the contract owner. Plans can be in a form of the NFT. (++)
- [ ] Lets add a functionality that ensures that if the price per NFT is more than $5, we set max mintable to be less by some factor. This way, the costlier, the more scarce. We can add this in the frontend logic to call the setterFunction to set the mintable amount. (++)
- [ ] Periodic swap of protocol earnings to the stablecoins and new possibility to withdraw stablecoin (++)
- [ ] Time based NFTs (+)
- [ ] Own token (+)
- [ ] Utilities for own token (discounts) (+)
- [ ] Add multi signature property to vault (+)
- [ ] [Manual Job on OpenSea] Add additional fee for every token transfer like openSea (https://docs.opensea.io/docs/10-setting-fees-on-secondary-sales) (+)
### Legend 
- (+++) - must have for hackathon
- (++) - good to have for hackathon
- (+) - optional for hackathon

### Points that need clarification/improvement
- You added an array  object `tokenIDs` to tweetFeatures Struct. Does this hold the onchain NFT tokenIDs of the minted NFTs of the deployed tweet? [X]
- Shall we create a another mint function that allows followers to mint an undeployed NFT? In that case, we get to deploy the tweet at first instance (yes, of course it eventually gets deployed now), and then mint. However, in this case, we map the handle (userID) of the tweet to their earnings in the contract. The good side of this fo us however, upon claim request, they only get 50% of the net to their balance and the remaining balance mapped to our company's EOA. [X]

- 
