const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath) // absolute path 
    const files = fs.readdirSync(fullImagesPath)
    console.log(files)
    let responses = []
    console.log("Uploading to IPFS!")
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`) // read all from the file
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile)
            console.log("response from pinata %s", response)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return { responses, files }
}

async function storeImage(fullImagePath) {
    console.log(fullImagePath)
    let response = ''
    console.log("Uploading to IPFS!")
    const readableStreamForFile = fs.createReadStream(`${fullImagePath}`) // read all from the file
    try {
        response = await pinata.pinFileToIPFS(readableStreamForFile)
        console.log(response)
    } catch (error) {
        console.log(error)
    }
    return response
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}

module.exports = { storeImages, storeImage, storeTokenUriMetadata }