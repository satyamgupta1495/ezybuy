import { Navigate } from 'react-router-dom';
import useStore from '@/store/useStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const PrivateRoute = ({ element: Element }: any) => {
    const { user }: any = useStore((state) => state);

    useEffect(() => {
        if (user && user?.loggedInUser?.role !== 'superadmin') {
            toast.error('Unauthorized access');
        }
    }, [user]);

    return user?.loggedInUser?.role === 'superadmin' ? <Element /> : <Navigate to="/" />;
};

export default PrivateRoute;
