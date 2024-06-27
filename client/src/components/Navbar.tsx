import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { Button, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';
import { logoutUser } from '@/helper';
import { useEffect } from 'react';
import useProducts from './hooks/useProducts';
import Logo from "@/assets/logo.jpeg"

export default function Navbars() {

    const navigate = useNavigate()
    const location = useLocation()

    const { user, logout, currentCart, setCurrentCart, currentCartCount, setCurrentCartCount }: any = useStore((state) => state)

    const { fetchCart, addProductToCart } = useProducts()

    useEffect(() => {
        if (user?.loggedInUser) {
            setCurrentCartCount(0)
            setCurrentCart({ products: [] })
            fetchCart()
        }
    }, [])

    const handleLogout = async () => {
        try {
            logout();
            toast.success("Logged out successfully!");
            const response = await logoutUser();
            if (response?.data?.success) {
                navigate('/');
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            toast.error("An error occurred during logout");
            console.error("Logout error:", error);
        }
    };

    const handleCartView = async () => {
        try {
            if (currentCart?.products?.length > 0) {
                await addProductToCart(currentCart.products);
                fetchCart();
                navigate('/cart');
            } else {
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error adding products to cart:', error);
        }
    };

    return (
        <Navbar expand="lg" className="d-flex w-100">
            <Navbar.Brand href="/" className='mx-5 flex items-center'>
                <Image src={Logo} className='rounded-full mr-1' width={40} height={40} alt="Ezybuy Logo" />
                Ezybuy
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/" active={location?.pathname === '/' ? true : false} >Home</Nav.Link>
                    <Nav.Link href="/product" active={location?.pathname === '/product' ? true : false}>Products</Nav.Link>
                </Nav>
                <Nav>
                    <div className="icon-container justify-content-center align-items-center d-flex mx-5 gap-4 fs-3">
                        {location?.pathname === '/product' && user?.loggedInUser?.role === 'superadmin' && <Button variant="success" onClick={() => navigate("/product/product-details", { state: { action: "add" } })}>Add product</Button>}

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
