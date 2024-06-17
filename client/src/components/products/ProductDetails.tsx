import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useStore from '@/store/useStore';
import { Form, Button, Row, Col, Container, Image } from 'react-bootstrap';

function ProductDetails() {
    const { productDetail } = useStore((state) => state);

    const [formData, setFormData] = useState({
        title: productDetail?.title || '',
        image: productDetail?.image || '',
        description: productDetail?.description || '',
        price: productDetail?.price || '',
    });

    const { state } = useLocation();
    const { fetchProductDetails, updatePoductDetails } = useProducts();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("formData", formData);
        updatePoductDetails(state?.id, formData);
    };

    useEffect(() => {
        if (state && state?.id) {
            fetchProductDetails(state?.id);
        }
    }, [state]);

    useEffect(() => {
        if (productDetail) {
            setFormData(productDetail);
        }
    }, [productDetail])

    return (
        <div className='product-details my-5'>
            {productDetail && (
                <Form className='h-100' onSubmit={handleSubmit}>

                    <Row className='mb-3'>
                        <Col md={6}>
                            <Form.Group className='form-group'>
                                <Form.Label>Image Preview:</Form.Label>
                                <div className='text-center'>
                                    <Image src={formData?.image} alt={formData?.title} />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId='formDescription' className='form-group'>
                                <Form.Label>Description:</Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={10}
                                    name='description'
                                    value={formData?.description}
                                    onChange={handleChange}
                                    placeholder='Enter description'
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col md={6}>
                            <Form.Group controlId='formTitle' className='form-group'>
                                <Form.Label>Title:</Form.Label>
                                <Form.Control
                                    type='text'
                                    name='title'
                                    value={formData?.title}
                                    onChange={handleChange}
                                    placeholder='Enter title'
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId='formPrice' className='form-group'>
                                <Form.Label>Price:</Form.Label>
                                <Form.Control
                                    type='number'
                                    name='price'
                                    value={formData?.price}
                                    onChange={handleChange}
                                    placeholder='Enter price'
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant='dark' className='w-40 mt-3' type='submit'>
                        Save
                    </Button>
                </Form>
            )}
        </div>
    );
}

export default ProductDetails;
