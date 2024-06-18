import { axiosCoreInstance as axios } from '../config/axios'

function login(data: any) {
    const baseUrl = `/api/v1/auth/login`
    return axios.post(`${baseUrl}`, data);
}

function logoutUser() {
    const baseUrl = `/api/v1/auth/logout`
    return axios.post(`${baseUrl}`);
}

function register(data: any) {
    const baseUrl = `/api/v1/auth/register`
    return axios.post(`${baseUrl}`, data);
}

function getProducts() {
    const baseUrl = `/api/v1/product`
    return axios.get(`${baseUrl}`);
}

function getProductDetailsApi(data: string) {
    const baseUrl = `/api/v1/product/${data}`
    return axios.get(`${baseUrl}`);
}

function addProductApi(productData: any) {
    const baseUrl = `/api/v1/product/`
    return axios.post(`${baseUrl}`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

function updateProduct(productId: string | number, productData: any) {
    const baseUrl = `/api/v1/product/${productId}`
    return axios.patch(`${baseUrl}`, productData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

function addToCart(data: any) {
    const baseUrl = `/api/v1/cart/add`
    return axios.post(`${baseUrl}`, data);
}

function getCart() {
    const baseUrl = `/api/v1/cart`
    return axios.get(`${baseUrl}`);
}

function removeFromCartApi(data: any) {
    const baseUrl = `/api/v1/cart/remove`
    return axios.post(`${baseUrl}`, data);
}

function checkOut(data: any) {
    const baseUrl = `/api/v1/cart/checkout`
    return axios.post(`${baseUrl}`, data);
}

export { login, logoutUser, register, getProducts, addProductApi, updateProduct, getProductDetailsApi, addToCart, getCart, removeFromCartApi, checkOut }