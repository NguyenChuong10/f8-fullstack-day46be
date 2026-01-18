import axios from "axios";

const httpRequest = axios.create({
    baseURL:"https://backend46.onrender.com/api"
})

httpRequest.interceptors.response.use((response) => {
    return response.data
})

export default httpRequest;