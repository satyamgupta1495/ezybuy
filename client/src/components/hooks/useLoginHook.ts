import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login, register } from "@/helper";
import useStore from "../../store/useStore"


export default function useLoginHook() {

    const setUser = useStore((state) => state.setUser)

    const navigate = useNavigate()

    const loginUser = async (data: any): Promise<void> => {
        try {
            const response: { data: any } = await login(data);
            if (response.data.success) {
                setUser(response.data.response?.result)
                toast.success(`Hello ${response.data.response?.result?.loggedInUser?.email}!`);
                navigate('/')
            }
        } catch (error: any) {
            toast.error("Loing failed");
            console.error('Login error:', error);
        }
    };

    const registerUser = async (data: any): Promise<void> => {
        try {
            const response: any = await register({
                email: data?.email,
                password: data?.password,
                role: "user"
            })
            if (response?.data?.success) {
                toast.success("Registered successfully! Please login to continue.");
                navigate("/login")
            }
        } catch (error) {
            toast.error("Wrong credentials!")
            console.error('Error creating user:', error);
        }
    };

    return {
        loginUser,
        registerUser,
        navigate
    }
}