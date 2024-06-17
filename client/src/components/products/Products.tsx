import { useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import useStore from '@/store/useStore';
import ProductCard from './ProductCard';

export default function Products() {
  const { fetchProducts } = useProducts()
  const { products }: any = useStore((state) => state)

  useEffect(() => {
    fetchProducts()
  }, []);

  return (
    <>
      <div className="card-container w-100 d-flex justify-content-evenly align-items-center flex-wrap">
        {products && products?.map((product: any) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </>
  );
};
