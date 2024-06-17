import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';
import { logoutUser } from '@/helper';
import { useEffect } from 'react';
import useProducts from './hooks/useProducts';


export default function Navbars() {

    const navigate = useNavigate()
    const { user, logout, currentCart, setCurrentCart, currentCartCount, setCurrentCartCount }: any = useStore((state) => state)

    const { fetchCart, addProductToCart } = useProducts()



    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response?.data?.success) {
                toast.success("Logged out successfully!");
                logout();
                navigate('/');
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            toast.error("An error occurred during logout");
            console.error("Logout error:", error);
        }
    };

    useEffect(() => {
        if (user?.loggedInUser) {
            setCurrentCartCount(0)
            setCurrentCart({ products: [] })
            fetchCart()
        }
    }, [])

    const handleCartView = async () => {
        try {
            if (currentCart?.products?.length > 0) {
                const productPromises = currentCart.products.map((data: any) =>
                    addProductToCart({
                        productId: data?.productId,
                        quantity: data?.quantity
                    })
                );

                await Promise.all(productPromises);
                navigate('/cart');
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error adding products to cart:', error);
        }
    };



    return (
        <Navbar expand="lg" className="bg-white d-flex w-100">
            <Navbar.Brand href="/" className='mx-5'>Ezybuy</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/product">Products</Nav.Link>
                </Nav>
                <Nav>
                    <div className="icon-container justify-content-center align-items-center d-flex mx-5 gap-4 fs-3">
                        {!user?.loggedInUser && <>
                            <Button variant="outline-dark" onClick={() => navigate("/login")}>Login</Button>
                            <Button variant="dark" onClick={() => navigate("/signup")}>Sign up</Button>
                        </>}
                        {user?.loggedInUser && <>
                            <Button variant="outline-dark" onClick={handleLogout}>Logout</Button>
                            <span className='fs-4 cursor-pointer'><UserIcon /></span>
                            <span className='relative cursor-pointer inline-block'>
                                {currentCartCount > 0 && <span className='absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1 z-10 transform translate-x-1/2 -translate-y-1/2'>
                                    {currentCartCount}
                                </span>}
                                <ShoppingCart style={{ transform: "scaleX(-1)" }} onClick={handleCartView} />
                            </span>
                        </>}
                    </div>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
