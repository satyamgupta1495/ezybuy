import axios, { AxiosResponse, AxiosError } from 'axios';
import { URL } from '@/constants';
import useStore from '@/store/useStore';
import refreshToken from '../utils/refreshToken';

const createAxiosInstance = (baseURL: string) => {
    const axiosInstance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const { user }: any = useStore.getState();

    axiosInstance.interceptors.request.use(
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

    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: any) => {
            let message: { message: string; status: number | null } = {
                message: 'An unknown error occurred',
                status: null,
            };

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        try {
                            await refreshToken();
                        } catch (refreshError) {
                            console.error(refreshError);
                            window.location.href = '/login';
                        }
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

    return axiosInstance;
};

const axiosCoreInstance = createAxiosInstance(URL);

export { axiosCoreInstance };
