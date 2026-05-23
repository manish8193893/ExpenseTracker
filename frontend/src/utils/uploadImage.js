import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData);
        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

export default uploadImage;