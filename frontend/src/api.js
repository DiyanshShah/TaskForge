import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

//interceptor

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if(token) {

            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,

    async(error) => {
        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
        

            try{
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`, {
                    refresh: refreshToken,
                });
                const newAuthToken = response.data.access;
                localStorage.setItem('authToken', newAuthToken);
                originalRequest.headers.Authorization = `Bearer ${newAuthToken}`;
                return apiClient(originalRequest)
            }catch(error){
                console.error("Token refresh failed:", error);
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login'; // Force a redirect
                    return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)

export default apiClient;