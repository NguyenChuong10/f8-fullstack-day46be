import axios from "axios";

const httpRequest = axios.create({
    baseURL:"http://localhost:3000/api"
})

httpRequest.interceptors.response.use((response) => {
    return response.data
})

export default httpRequest;