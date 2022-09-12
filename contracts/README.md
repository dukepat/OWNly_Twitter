# OWNly smart contracts
## Twitter NFTs

### Deployment
Twitter NFT must be deployed by content creator/owner to be able to mint. Content creator can deploy NFT with different parameters like (paying the deployment fee established once during creation of the contract):
- [x] TRANSFERABLE/NON_TRANSFERABLE 
- [x] LIMITED TO NUMBER OF TRANSACTIONS
- [x] FEE FOR MINTING - changeable after deployment ?
- [ ] TIME LIMITED

### Minting
After deployment, the followers can mint creator's tweet as a NFTs. In order to mint them they must pay certain amount of money (established by content creator during deployment). The part of money go to the protocol and the rest to the content creator. The URI with URL from IPFS will be inserted with other parameters into a NFT.

### Main storage
The main storage is a tweet ID mapping to the structure of parameters. Thanks to that from each tweet ID deployed, it is possible to get:
- contentCreator
- feature of token 
- transfer limit
- minted token IDs
- time limit

## Contract features
Contract withdrawal is only possible by contract owner and it withdraws all the funds.

## ToDo
- [x] All fees keep changeable by the owner, besides mintFee which will be set by the content creator
- [x] Remove time limited tokens
- [ ] Deployments scripts and testing
- [ ] Vault smart contract which keep user's balances and interact with other contracts on behalf of users
- [ ] Monthly plans e.g 1000 tweets per month type examples: silver / gold / platinum. Plans should be customizable by the owner.
- [ ] Add additional fee for every token transfer like openSea (https://docs.opensea.io/docs/10-setting-fees-on-secondary-sales)
- [ ] OwnerToTweetId mapping
