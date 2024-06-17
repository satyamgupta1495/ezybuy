import useStore from '@/store/useStore';
import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import toast from 'react-hot-toast';
import { FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { MdEdit } from "react-icons/md";

interface ProductCardProps {
    product: {
        _id: number | string;
        title: string;
        description: string;
        image: string;
        price: number;
    }
}

function ProductCard({ product }: ProductCardProps) {
    const [quantity, setQuantity] = useState<number>(0);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

    const { user, currentCartCount, setCurrentCartCount, currentCart, setCurrentCart }: any = useStore((state) => state)
    const navigate = useNavigate()

    const maxLength = 70;

    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const truncatedDescription = truncateText(product?.description, maxLength);

    const handleDecrement = () => {
        if (quantity > 0) {
            setQuantity((prev) => prev - 1);
        } else {
            toast.error("Quantity cannot be negative");
        }
    };

    const handleIncrement = () => {
        setQuantity((prev) => prev + 1);
    };

    const addProductToCart = async () => {
        const productIndex = currentCart?.products.findIndex((p: any) => p?.productId.toString() === product?._id.toString());

        let updatedProducts;

        if (productIndex >= 0) {
            updatedProducts = currentCart?.products.map(({ p, index }: any) => {
                if (index === productIndex) {
                    return { ...p, quantity: Number(p?.quantity) + Number(quantity) };
                }
                return p;
            });
        } else {
            updatedProducts = [
                ...currentCart?.products,
                { productId: product?._id, quantity: Number(quantity) }
            ];
        }

        setCurrentCart({
            ...currentCart,
            products: updatedProducts
        });
    };

    const handleAddToCart = () => {
        if (quantity > 0 && user?.loggedInUser) {
            addProductToCart()
            setCurrentCartCount(Number(currentCartCount) + Number(quantity))
            toast.success("Successfully added item to cart!");
        } else if (!user?.loggedInUser) {
            navigate('/login')
        } else if (user?.loggedInUser && quantity <= 0) {
            toast.error("Add items first");
        }
    };

    const handleClick = (id: string | number) => {
        if (product && product._id && isSuperAdmin) {
            navigate(`/product/product-details`, { state: { id: id } });
        }
    };

    useEffect(() => {
        if (user?.loggedInUser?.role === 'superadmin') {
            setIsSuperAdmin(true);
        }
    }, [user?.loggedInUser]);

    return (
        <Card className="product-card">
            {isSuperAdmin && (
                <div
                    className="absolute top-2 fs-5 right-2 bg-slate-200 bg-opacity-60 text-black p-1 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick(product?._id)
                    }}
                >
                    <MdEdit />
                </div>
            )}
            <div className="relative inline-block">
                <Card.Img variant="top" src={product?.image} className={`product-image ${isSuperAdmin ? 'cursor-pointer' : ''}`} onClick={() => handleClick(product?._id)} />

            </div>
            <Card.Body>
                <Card.Title>{product?.title} </Card.Title>
                <span className="inline-flex items-center fs-25 px-2.5  mb-1 rounded-full font-medium bg-green-600 text-white">
                    Price: ₹{product?.price ? product.price.toFixed(2) : 'N/A'}
                </span>

                <OverlayTrigger
                    placement="auto"
                    overlay={<Tooltip id={`tooltip-${product?._id}`}>{product?.description}</Tooltip>}
                >
                    <Card.Text className="product-description">{truncatedDescription}</Card.Text>
                </OverlayTrigger>

            </Card.Body>

            <div className="card-button-container w-100">
                <div className="qty-btn flex justify-center items-center">
                    <Button variant="outline-dark" className='w-10' onClick={handleDecrement}> <FaMinus /></Button>
                    <input
                        type="number"
                        id="quantity-input"
                        value={quantity}
                        className="w-10 text-end"
                        disabled
                    />
                    <Button variant="outline-dark" className='w-10' onClick={handleIncrement}><FaPlus /></Button>
                </div>

                <Button variant="dark" className='w-30' onClick={handleAddToCart}>Add to cart</Button>
            </div>
        </Card >
    );
};

export default ProductCard