import httpRequest from "@/utils/httpRequest";


const baseQuery = async(args) => {
    console.log("api request" , args);

    const isObject = typeof args === "object";
    const config = {
        url:isObject ? args.url : args,
        method: isObject ? args.method : "GET",
    };
    if(isObject && args.body) {
        config.data  = args.body;
    }
    try {
        const data = await httpRequest(config);
        console.log(" API Response " , data)
        return {data};
    } catch (error) {
        console.error("api error" , error);
        console.error("Error Response" , error.response?.data)

        return {
            error:{
                status: error.response?.status || 500,
                data: error.response?.data || {message:error.message}
            }
        }
    }
}

export default baseQuery