import useStore from '../store/useStore';
import { refreshTokenApi } from '../helper/index'

async function refreshToken() {
    try {
        const { user }: any = useStore.getState();
        const response = await refreshTokenApi({ refreshToken: user?.refreshToken })
        const { accessToken } = response.data?.response;
        useStore.setState({
            user: {
                ...user,
                accessToken,
            },
        });
        return accessToken;
    } catch (error) {
        console.error("Error while refreshing token: ", error);
    }
};

export default refreshToken;