import ImageKit from "imagekit";

import dotenv from "dotenv";
dotenv.config();

const imagekit = new ImageKit({
    publicKey  : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadFile = async (file,fileName)=>{
    const result = await imagekit.upload({file,fileName})
    return result
}
export {uploadFile}