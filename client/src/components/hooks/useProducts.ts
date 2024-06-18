import { addToCart, checkOut, getCart, getProductDetailsApi, getProducts, removeFromCartApi, updateProduct } from "@/helper";
import useStore from "@/store/useStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useProducts() {

    const { setProducts, setCart, setCurrentCartCount, setProductDetail } = useStore((state) => state)

    const navigate = useNavigate()

    const fetchProducts = async (): Promise<void> => {
        try {
            const response: { data: any } = await getProducts();
            if (response.data.success) {
                setProducts(response.data.response?.result)
            }
        } catch (error: any) {
            toast.error("Unable to fetch products at the moment");
            console.error('Error:', error);
        }
    };

    const fetchCart = async (): Promise<void> => {
        try {
            const response: { data: any } = await getCart();
            if (response.data.success) {
                setCart(response.data.response?.result)
                setCurrentCartCount(response.data.response?.result?.products?.reduce((acc: any, item: any) => acc + item?.quantity, 0));
            }
        } catch (error: any) {
            // toast.error(error?.message);
            console.error('Error:', error);
        }
    }

    const addProductToCart = async (data: any) => {
        try {
            const response: { data: any } = await addToCart({ productId: data?.productId, quantity: data?.quantity });
            if (response.data?.success) {
                setCart(response.data.response?.result)
            }
        } catch (error: any) {
            // toast.error(error?.message);
            console.error('Error adding products to cart:', error);
        }
    }

    const removeFromCart = async (id: any) => {
        try {
            const response: any = await removeFromCartApi({ productId: id, action: "delete" });
            if (response.data?.success) {
                fetchCart();
            }
        } catch (error: any) {
            toast.error("Remove from cart failed");
            console.error('Error:', error);
        }
    }

    const handleCheckOut = async (id: any) => {
        try {
            const response: any = await checkOut({ productId: id, action: "delete" });
            if (response.data?.success) {
                toast.success('Order placed successfully!');
                fetchCart();
                navigate('/');
            }
        } catch (error: any) {
            toast.error("Checkout failed, please try again");
            console.error('Error while checking out:', error);
        }
    }

    const fetchProductDetails = async (id: any) => {
        try {
            const response: any = await getProductDetailsApi(id);
            if (response.data?.success) {
                setProductDetail(response.data.response?.result);
            }
        } catch (error: any) {
            toast.error("Unable to fetch product details");
            console.error('Error:', error);
        }
    }

    const updatePoductDetails = async (id: string | number, data: any) => {
        try {
            const response: any = await updateProduct(id, data);
            if (response.data?.success) {
                setProductDetail(response.data.response?.result);
                toast.success('Product updated successfully!');
                navigate('/product')
            }
        } catch (error: any) {
            toast.error("Unable to update product details");
            console.error('Error:', error);
        }
    }

    return {
        updatePoductDetails,
        handleCheckOut,
        fetchProductDetails,
        addProductToCart,
        removeFromCart,
        fetchProducts,
        fetchCart,
        navigate
    }

}