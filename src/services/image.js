
import axios from "axios";

const imgAPI = axios.create({
    baseURL: "http://localhost:8081/"
});
export const fetchFileImage = async (next_cursor = null, folder = 'critix_profile') => {
    try {
        const endpoint = next_cursor 
            ? `api/images?folder_name=${folder}&next_cursor=${next_cursor}` 
            : `api/images?folder_name=${folder}`;
        const response = await imgAPI.get(endpoint);
        console.log(folder)
        return response;
    } catch (error) {
        console.log(error);
    }
};
