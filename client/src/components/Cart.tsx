import { useEffect, useState } from 'react';
import useStore from '@/store/useStore';
import { Button } from 'react-bootstrap';
import { MdDelete } from "react-icons/md";
import useProducts from './hooks/useProducts';


export default function Cart() {
    const [shippingAddress, setShippingAddress] = useState('');

    const { cart, products, setCurrentCart, setCurrentCartCount }: any = useStore((state) => state)

    const { removeFromCart, handleCheckOut } = useProducts()

    if (!cart) return <p>Your cart is empty</p>;

    function removeItemFromCart(productId: string) {
        removeFromCart(productId)
    };

    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        setCurrentCart({ products: [] })
        setCurrentCartCount(0)
    }, [])

    useEffect(() => {
        if (cart && cart.products && products) {
            const commonProducts = products.filter((product: any) =>
                cart.products.some((cartProduct: any) => cartProduct.productId === product._id)
            ).map((product: any) => {
                const cartProduct = cart.products.find((cartProduct: any) => cartProduct.productId === product._id);
                return {
                    ...product,
                    quantity: cartProduct ? cartProduct.quantity : 0
                };
            });

            if (commonProducts.length > 0) {
                setProduct(commonProducts);
            }
            setCurrentCartCount(cart?.products?.reduce((acc: any, item: any) => acc + item?.quantity, 0));
        }
    }, [cart, products]);


    const handleChange = (e: any) => {
        setShippingAddress(e.target.value);
    };

    return (
        <div className="cart-container">

            {cart?.products?.length === 0 ? (
                <p className='fs-2'>Your cart is empty.</p>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                    <div className="cart-item-container w-100 gap-4">
                        {product?.map((product: any) => (
                            <div key={product?._id} className='card-item border-2 border-gray-300'>
                                <h2 className="text-lg font-semibold">{product?.title}</h2>
                                <img src={product?.image} />
                                <p className="text-gray-600">{`Quantity: ${product?.quantity}`}</p>
                                <div className="price">
                                    <p className="text-gray-600">{`₹${(Number(product?.price) * Number(product?.quantity)).toFixed(2)}`}</p>
                                    <Button variant="outline-danger" className='w-15' onClick={() => removeItemFromCart(product?._id)}><MdDelete /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="shipping-add">
                        <input
                            type="text"
                            className="border border-gray-300 rounded px-3 py-2"
                            value={shippingAddress}
                            placeholder="Shipping address"
                            onChange={handleChange}
                        />
                        <Button variant="dark" className='w-30' disabled={cart?.products?.length === 0 || shippingAddress.trim() === ''} onClick={() => handleCheckOut(cart?._id)}>Checkout</Button>
                    </div>
                </>
            )
            }

        </div >
    );
};

