import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Product {
    productId: number | string;
    quantity: number;
}

interface StoreState {
    user: Record<string, any>;
    setUser: (userData: Record<string, any>) => void;
    products: any[];
    setProducts: (products: any[]) => void;
    cart: any[];
    setCart: (cart: any[]) => void;
    currentCartCount: number;
    setCurrentCartCount: (currentCartCount: number) => void;
    currentCart: {
        products: Product[];
    };
    setCurrentCart: (currentCart: { products: Product[] }) => void;
    productDetail: any;
    setProductDetail: (currentCartCount: number) => void;
    logout: () => void;
}

const useStore = create<StoreState>()(
    devtools(
        persist(
            (set) => ({
                user: {},
                setUser: (userData) => set({ user: userData }),
                products: [],
                setProducts: (products) => set({ products }),
                cart: [],
                setCart: (cart) => set({ cart }),
                currentCartCount: 0,
                setCurrentCartCount: (currentCartCount) => set({ currentCartCount }),
                currentCart: { products: [] },
                setCurrentCart: (currentCart) => set({ currentCart }),
                logout: () => set({ user: {}, currentCart: { products: [] }, cart: [], currentCartCount: 0 }),
                productDetail: {},
                setProductDetail: (productDetail) => set({ productDetail })
            }),
            { name: "store-state" }
        )
    )
);

export default useStore;