// Importing modules
import ImageKit from "@imagekit/nodejs";
import { IMAGEKIT_PRIVATE_KEY } from "./env.config.js";

// Initializing the ImageKit client (only private key is required in the latest SDK)
const imagekit = new ImageKit({
    privateKey: IMAGEKIT_PRIVATE_KEY
});

export default imagekit;
