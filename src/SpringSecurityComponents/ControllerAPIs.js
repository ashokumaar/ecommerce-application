import axios from "axios";

const baseUrl = 'http://localhost:8000/auth'

export const getWelcome = async () => {
    try {
        return await axios.get(`${baseUrl}/welcome`)
    } catch (error) {
        console.log(error);
    }
}

export const checkUsernameExist = async (username) => {
    try{
        return await axios.get(`${baseUrl}/checkUsernameExist/${username}`)
    } catch(error){
        console.log(error);
    }
}

export const registerUser = async (payload) => {
    try{
        return await axios.post(`${baseUrl}/register`, payload)
    } catch(error){
        console.log(error);
    }
}

export const generateToken = async (payload) => {
    try {
        return await axios.post(`${baseUrl}/generateToken`, payload)
    } catch (error) {
        console.log(error);
    }
}

export const userProfile = async (token) => {
    try {
        // return await axios.get(`${baseUrl}/user/userProfile`, {headers:{Authorization:`Bearer ${token}`}} )
        return await axios.get(`${baseUrl}/me`, {headers:{Authorization:`Bearer ${token}`}} )
    } catch (error) {
        console.log(error)
    }
}