import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useStore from '@/store/useStore';
import { Form, Button } from 'react-bootstrap';
import FileUpload from './FileUpload';

function ProductDetails() {
    const { productDetail } = useStore((state) => state);

    const [formData, setFormData] = useState<any>({
        title: productDetail?.title || '',
        image: productDetail?.image || '',
        description: productDetail?.description || '',
        price: productDetail?.price || '',
    });

    const fileRef = useRef<any>(null);

    const { state } = useLocation();
    const { fetchProductDetails, addPoduct, updatePoductDetails } = useProducts();

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            fileRef.current = file;
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (state?.action === 'add') {
            addPoduct({ ...formData, image: fileRef.current })
        } else {
            updatePoductDetails(state?.id, { ...formData, image: fileRef.current });
        }
    };

    useEffect(() => {
        if (state && state?.id) {
            fetchProductDetails(state?.id);
        } else if (state && state?.action === 'add') {
            setFormData({
                title: '',
                image: '',
                description: '',
                price: ''
            });
        }
    }, [state]);

    useEffect(() => {
        if (productDetail && state && state?.action !== 'add') {
            setFormData(productDetail);
        }
    }, [productDetail])

    return (
        <div className='product-details my-1 shadow-none'>
            {productDetail && (
                <Form className='h-100' onSubmit={handleSubmit}>

                    <Form.Group controlId='formTitle' className='form-group'>
                        <Form.Control
                            type='text'
                            name='title'
                            value={formData?.title}
                            onChange={handleChange}
                            placeholder='Enter title'
                            className='shadow-none'
                        />
                    </Form.Group>

                    <Form.Group className='form-group'>
                        <div>
                            <FileUpload imageUrl={formData?.image} imageTitle={formData?.title} handleFileChange={handleFileChange} action={state?.action} />
                        </div>
                    </Form.Group>

                    <Form.Group controlId='formDescription' className='form-group'>
                        <Form.Control
                            as='textarea'
                            rows={6}
                            name='description'
                            value={formData?.description}
                            onChange={handleChange}
                            placeholder='Enter description'
                            className='shadow-none'
                        />
                    </Form.Group>

                    <Form.Group controlId='formPrice' className='form-group'>
                        <Form.Control
                            type='number'
                            name='price'
                            value={formData?.price}
                            onChange={handleChange}
                            placeholder='Enter price'
                            className='shadow-none'
                        />
                    </Form.Group>

                    {state?.action !== 'add' ?
                        <Button variant='dark' className='w-40 mt-3' type='submit'>
                            Save
                        </Button> :
                        <Button variant='dark' className='w-40 mt-4' type='submit'>
                            Add product
                        </Button>}
                </Form>
            )}
        </div>
    );
}

export default ProductDetails;
