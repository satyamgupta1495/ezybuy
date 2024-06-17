import axios, { AxiosResponse, AxiosError } from 'axios';
import { URL } from '@/constants';
import useStore from '@/store/useStore';


const createAxiosInstance = (baseURL: string) => {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.baseURL = baseURL;

    const { user }: any = useStore.getState(); // Directly access the store state
    console.log("Token:", user?.accessToken);
    
    axios.interceptors.request.use(
        (config: any) => {
            if (user?.accessToken) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${user.accessToken}`,
                };
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );


    axios.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => {
            let message: { message: string; status: number | null } = {
                message: 'An unknown error occurred',
                status: null,
            };

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        message = {
                            message: 'Invalid credentials',
                            status: error.response.status,
                        };
                        break;
                    case 403:
                        window.location.href = '/access-denied';
                        return;
                    case 404:
                        message = {
                            message: 'Sorry! The data you are looking for could not be found',
                            status: error.response.status,
                        };
                        break;
                    default:
                        message = {
                            message: error.response.data?.errorMsg || error.message || 'An unknown error occurred',
                            status: error.response.status,
                        };
                }
            }

            return Promise.reject(message);
        }
    );

    return axios;
};

const axiosCoreInstance = createAxiosInstance(URL);

export { axiosCoreInstance };
