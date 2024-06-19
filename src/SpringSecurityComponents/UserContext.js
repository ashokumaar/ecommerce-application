import React, { useContext, useState, useEffect } from 'react';

export const UserContext = React.createContext({
    jwtToken: null,
    cartItems: [],
    handleSetJwtToken: () => { },
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    totalItems: 0,
    totalAmount: 0,
});

export const UserContextProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // JWT Token Functions
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        setJwtToken(storedToken);
    }, []);

    useEffect(() => {
        // const total = cartItems.reduce((accumulator, item) => {
        //     return accumulator + item.discountedPrice;
        // }, 0);
        // setTotalAmount(total);
        if (cartItems.length > 0) {
            console.log(cartItems);
            const amount = cartItems.reduce((accumulator, item) => {
                // console.log()
                return accumulator + item.discountedPrice*item.quantity;
            }, 0);
            setTotalAmount(amount);
            console.log('Amount :: ', amount);
        }
    }, [cartItems]);

    const handleSetJwtToken = (newToken) => {
        setJwtToken(newToken);
        localStorage.setItem('jwtToken', newToken);
    };

    const handleLogin = (newToken) => {
        handleSetJwtToken(newToken);
        // sessionStorage.setItem('hasLoggedOut', 'false');
        sessionStorage.removeItem('hasLoggedOut');
    };

    const handleLogout = () => {
        setJwtToken(null);
        localStorage.removeItem('jwtToken');
    };

    // Cart Functions
    const addToCart = async (product, quantity = 1) => {
        // Update total based on added product price and quantity
        setTotalItems(cartItems.length + 1);
        // Add product to cart logic
        setCartItems([...cartItems, { ...product, quantity }]);
    };

    const removeFromCart = async (productId) => {
        // Update total based on removed product price and quantity
        setTotalItems(cartItems.length - 1);
        // Remove product from cart logic
        setCartItems(cartItems.filter((item) => item.title !== productId));
    };

    const updateQuantity = async (productId, newQuantity) => {
        // Update product quantity in cart logic
        // let value = Number(newQuantity);
        // setTotalItems(cartItems.length);
        console.log('quantity ::', newQuantity);
        setCartItems(
            cartItems.map((item) => (item.title === productId ? { ...item, quantity: newQuantity } : item))
        );
    };

    const value = {
        jwtToken,
        cartItems,
        handleSetJwtToken,
        handleLogin,
        handleLogout,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalAmount
    }
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>

};

export const useUserContext = () => useContext(UserContext);