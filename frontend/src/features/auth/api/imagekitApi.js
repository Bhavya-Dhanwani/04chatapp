// Importing the axios api instance with interceptors
import api from "../../../app/api";

// Reading ImageKit public credentials from env (safe to expose to the browser)
const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

// ImageKit upload endpoint
const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

// ImageKit API object for the signup profile picture flow
export const imagekitApi = {

    // Function to fetch presigned upload params from our backend
    getSignupUploadAuth: async () => {

        // Calling the public backend endpoint
        const { data } = await api.get("/auth/signup/upload-auth");

        // Returning the auth params { token, expire, signature }
        return data.data;
    },

    // Function to upload a file directly to ImageKit using presigned params
    uploadToImageKit: async (file, authParams, fileName) => {

        // Building the multipart form data expected by ImageKit
        const form = new FormData();
        form.append("file", file);
        form.append("fileName", fileName || file.name);
        form.append("publicKey", IMAGEKIT_PUBLIC_KEY);
        form.append("token", authParams.token);
        form.append("expire", String(authParams.expire));
        form.append("signature", authParams.signature);
        form.append("useUniqueFileName", "true");
        form.append("folder", "/profile-pics");

        // Posting directly to ImageKit (do NOT use our api instance, it has different baseURL/headers)
        const res = await fetch(IMAGEKIT_UPLOAD_URL, {
            method: "POST",
            body: form,
        });

        // Parsing the JSON response
        const json = await res.json();

        // Throwing if the upload failed
        if (!res.ok) {
            throw new Error(json?.message || "ImageKit upload failed");
        }

        // Returning both the hosted URL and the ImageKit fileId (needed to delete the file later)
        return { url: json.url, fileId: json.fileId };
    },

    // Function to run the full signup profile picture flow (presign + upload)
    uploadProfilePic: async (file) => {

        // Throwing early if public env vars are missing
        if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT) {
            throw new Error("ImageKit is not configured");
        }

        // Step 1: get presigned auth params from our backend
        const authParams = await imagekitApi.getSignupUploadAuth();

        // Step 2: upload the file directly to ImageKit and return the { url, fileId }
        return await imagekitApi.uploadToImageKit(file, authParams);
    },
};
