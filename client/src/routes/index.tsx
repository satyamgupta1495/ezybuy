
import useStore from '@/store/useStore';
import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

const Products = lazy(() => import('@/components/products/Products'));
const ProductDetails = lazy(() => import('@/components/products/ProductDetails'));
const Cart = lazy(() => import('@/components/Cart'));
const Login = lazy(() => import('@/components/Login'));
const Signup = lazy(() => import('@/components/SignUp'));
const Page404 = lazy(() => import('@/components/Page404'));
const Home = lazy(() => import('@/components/Home'));
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {

    const { user }: any = useStore((state) => state)

    const routes: RouteObject[] = [
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/product',
            element: <Products />
        },
        {
            path: '/product/product-details',
            element: <PrivateRoute element={ProductDetails} />
        },
        {
            path: '/cart',
            element: <Cart />,
        },
        {
            path: '/login',
            element: user?.loggedInUser ? <Navigate to="/" /> : <Login />
        },
        {
            path: '/signup',
            element: user?.loggedInUser ? <Navigate to="/" /> : <Signup />
        },
        {
            path: '*',
            element: <Page404 />,
        },
    ];
    return routes;
};

export default AppRoutes;
