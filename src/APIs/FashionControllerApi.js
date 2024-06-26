import axios from "axios";

// const baseUrl = 'http://localhost:8100/fashion/products'
const baseUrl = 'http://localhost:8888/fashion/products' // api gateway

export const getAllProducts = async () => {
    try {
        return await axios.get(`${baseUrl}/all`)
    } catch (error) {
        console.log(error);
    }
}

export const getProductById = async (id, token) => {
    try {
        return await axios.get(`${baseUrl}/${id}`, {headers:{Authorization:`Bearer ${token}`}} )
    } catch (error) {
        console.log(error)
    }
}

export const createProduct = async (payload) => {
    try {
        return await axios.post(`${baseUrl}/create`, payload)
    } catch (error) {
        console.log(error);
    }
}

export const createProducts = async (payload) => {
    try {
        return await axios.post(`${baseUrl}/createmany`, payload)
    } catch (error) {
        console.log(error);
    }
}

