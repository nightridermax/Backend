import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:  process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFileStorage) => {
  try {
    if (!localFileStorage) return null
    //upload on cloudinary
    const response = await cloudinary.uploader.upload
    (localFileStorage, {
      resource_type: "auto"
    })
    //file has been upload succefully
    fs.unlinkSync(localFileStorage)
    return response;
  } catch (error) {
    fs.unlinkSync(localFileStorage)
    return null;
  }
}


export {uploadOnCloudinary}