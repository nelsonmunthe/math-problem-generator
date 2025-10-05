import axios from "axios";

const axiosInstance = axios.create()

axiosInstance?.interceptors.request.use(
    async (config) => {
        return config
    },
    async (error) => {
        return Promise.reject(error)
    }
)

axiosInstance?.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      return Promise.reject(error)
    }
)

export default axiosInstance