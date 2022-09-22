# OWNly Project - Moralis x Filecoin "1, 2, Web3" Hackathon
The OWNly project is an own and share NFT Copyright Platform. You can literally put a price on almost anything-U in the digital space.

## Project Repos:
### [UI/UX](https://github.com/dukepat/OWNly_Twitter/tree/main/UI-UX)
### [Smart Contract](https://github.com/dukepat/OWNly_Twitter/tree/main/contracts)
### [Frontend](https://github.com/dukepat/OWNly_Twitter/tree/main/frontend)

## Table of content
- [OWNly Project-MoralisxFilecoin Hackathon](#ownly-project---MoralisxFilecoin-"1,-2,-Web3"-Hackathon)
  - [Table of content](#table-of-content)
  - [Ideation](#ideation)
  - [UI](#ui)
  - [Frontend](#frontend)
  - [Contracts](#contracts)
    - [Overview](#overview)
    - [Tests](#tests)
    - [Deployed Contract](#deployed-contract)
    - [Deployed NFTs](#deployed-nfts)
- [Use Cases](#use-cases)
## Ideation

- What are you doing with your digital and social footprint? How much has blockchain benefitted you as you go along on your normal online social engagements? How about monetizing your digital footprints and other of your intellectual properties in the digital space?
- The OWNly project is an own and share NFT Copyright Platform. You can literally put a price on almost anything-U in the digital space. We categorise the digital space into two: the Social-U and the Non-Social-U. The Social-U comprise of post from all social media platforms like Twitter, Facebook, Instagram, TikTok etc. The Non-Social-U comprise of books, biography, video tutorials, whistleblower's account, blog, news, declassified and classified secrets etc. These digital items can be minted, shared and sold or even rented since they are intellectual digital footprints.
- The MVP for this HTM hackathon is the Social-U of Twitter NFT. Tweet owners can deploy their tweets and allow the general public, followers alike to mint their tweets. The usage of these NFTs are very important. We have two variants:
  - The Transferrable & the Non-transferrable. The transferrable are like the normal NFTs while the non-transferrable are specially designed for fundraising purposes. The NFT only serves as a receipt for participation in a fundraising that the deployer might have organized.

## UI
- The `Figma` design can be found [here](https://www.figma.com/proto/PE6sPsfpy62nlqpMGz9gy6/Hackathon?page-id=0%3A1&node-id=0%3A158&viewport=727%2C429%2C0.23&scaling=scale-down&starting-point-node-id=0%3A12).
- The landing page below projects the entire cycle of the product line up while we focus on the Twitter version.
<img src=./images/ui-ux/LandingPage.png alt="drawing" width="720" height="600"/>

- The Launch App button loads the `tweetNFT` page. Here users can input a tweet url and proceed to either deploy or mint. (Only deployed tweets can be minted and only tweet owners can deploy). Deploy simply means alerting the blockchain  and giving it the permission to mint your tweets.
<img src=./images/ui-ux/DeployNFT.png alt="drawing" width="720" height="850"/>

- Other Products highlighting.

<img src=./images/ui-ux/Product.png alt="drawing" width="600" height="1000"/>

###

## Frontend
- The frontend implementation of the UI has not been perfected. The work done shows minimal interaction with backend-smart contracts.

- LandingPage
<img src=./images/ui-ux/frontend1.png alt="drawing" width="720" height="450"/>

- App page

<img src=./images/ui-ux/AppPage.png alt="drawing" width="600" height="300"/>

- App page test

<img src=./images/ui-ux/AppPageTest.png alt="drawing" width="1000" height="600"/>

###

## Contracts

### Overview
Contract allows to mint ERC721 NFT with metadata from `NFT.storage` API. Content creator can easily deploy their valuable tweets with customizable fees and supply. Followers in order to support the creator can mint the NFT paying some fee (established by content creator). Users can use their personal balance in vault for paying for transactions without any signing of transaction. This abstraction allows for users to only send in some bulk amount to vault once in a while to prevent having to always sign transaction using a provider.

### Tests
The [integration test](https://github.com/dukepat/OWNly_Twitter/blob/main/contracts/test/integration/MintingTwitterNfts.test.js) imitates well, how the general flow looks like:
1. Contract owner can set some deploy fee
2. Tweet with certain ID is loaded to the website - this case ID 1844 is assumed
3. Content creator deploys his tweet with some certain parameters - pays minor fee from his vault or includes fee in transaction.
4. Follower mints deployed tweet with customizable image - pays fee established by content creator from his vault or includes fee in transaction.
5. Some basic metadata about tweet and customized image is stored in IPFS via `NFT.storage` API
6. URI to this metadata is stored in the blockchain 

<img src=./images/contracts/Tests.png alt="drawing" width="720" height="210"/>

### Deployed Contract
The contract is fully verified and visible on [Polygonscan](https://mumbai.polygonscan.com/address/0x4c629d4f72fc89cc2ca1650994429bcd91c3d99c). Once tests are performed [here](#tests), you can see some results in polygonscan:

<img src=./images/contracts/FunctionExampleOwnerOf.png alt="drawing" width="800" height="140"/>

<img src=./images/contracts/FunctionExampleTweetId.png alt="drawing" width="800" height="140"/>

<img src=./images/contracts/FunctionExampleURI.png alt="drawing" width="800" height="140"/>

### Deployed NFTs
The followers should see minted NFTs on OpenSea thanks to compatible URI and metadata:

<img src=./images/contracts/NFT.png alt="drawing" width="850" height="900"/>

## Use Cases
- Opportunity to convert usual social communications like tweets to NFTs for income generation.
- Opportunity to use tweets as a means of fundraiser. Followers are able to mint a fundraiser tweet to raise money for a just cause.
- Beyond the social NFTs, the other aspects of the project viz: book NFT, blog NFT, top secret NFTs, whistleblower, news NF, music and video NFTs, lectures & tutorial NFTs and other Non-social-Us, assures intellectual property owners and creators to earn from their works.
With 10% commission going for humanitarian courses, would contribute to solving food crises and for other emergency needs.

## Team Members
- [Ojo Patrick Duke - Team Lead and Smart Contract](https://github.com/dukepat)
- [Oghenefego Omujale - UI/UX ](https://github.com/Ofego)
- [Kamil Palenik - Smart Contract](https://github.com/xrave110)
- [Emeduduna Akerejola - Frontend](https://github.com/Emedudu)
- [Mudit Jain - Smart Contract](https://github.com/Sigma2345)
- [Yash Gupta - Frontend](https://github.com/knight-95)


## Market Strategy
With the different NFT products lineup, we are presenting our minimal implementation of a social-u which is the Twitter NFT. Individual tweeps would have to decide, upon seeing the opportunity our platform presents, whether to deploy their tweets to be minted by followers or not. However, for the fundraiser use case, this option is faster and more optimal when compared to existing fundraiser platforms. Moreso, the donor gets an NFT as a proof of donation.



