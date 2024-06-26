import React, { useContext, useState, useEffect } from 'react';
import { decodeToken, isExpired } from 'react-jwt'
import { useNavigate } from 'react-router-dom';
import { getCartByUserId, createCart, addItemToCart, updateCartItemQuantity, removeItem } from '../APIs/AuthServiceAPIs';
import { getAllProducts } from '../APIs/FashionControllerApi';
import { toast } from 'react-toastify';

export const UserContext = React.createContext({
    jwtToken: null,
    user: {},
    cart: {},
    cartItems: [],
    handleSetJwtToken: () => { },
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    totalItems: 0,
    totalAmount: 0,
    products: [],
    fashionProducts: [],
});

export const UserContextProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState({});
    const [cartItems, setCartItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [products, setProducts] = useState([]);
    const [fashionProducts, setFashionProducts] = useState([]);

    const myDecodedToken = decodeToken(jwtToken)
    const isMyTokenExpired = isExpired(jwtToken)

    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const productResponse = await getAllProducts();
            const productData = productResponse.data;
            setFashionProducts(productData);
            setProducts([...products, productData]);
        }
        fetch();
    }, [])

    // Fetch products and user cart when component mounts or jwtToken changes
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        if (storedToken) {
            setJwtToken(storedToken);
            console.log('jwtToken ::: ', jwtToken);
            console.log('myDecodedToken ::: ', myDecodedToken);
            console.log('isMyTokenExpired ::: ', isMyTokenExpired);
            if (jwtToken && !isMyTokenExpired) {
                fetchProductsAndCart(storedToken);
            } else if (jwtToken) {
                toast.warn('your session has expired, please login again! ', {
                    autoClose: 3000
                })
                sessionStorage.setItem('SessionExpired', true);
                navigate('/')
            }
        }
    }, [jwtToken]);

    const fetchProductsAndCart = async (token) => {
        try {
            const productResponse = await getAllProducts();
            const productData = productResponse.data;
            setProducts(productData);
            const userId = localStorage.getItem('UserId');
            if (userId) {
                await getCartByUserId2(userId, token, productData);
            }
        } catch (error) {
            console.error('Failed to fetch products or cart:', error);
        }
    };

    const getCartByUserId2 = async (id, token, productData) => {
        try {
            const response = await getCartByUserId(id, token);
            if (response.status === 200) {
                const data = response.data;
                handleSetCart(data);
                const items = data.items.map((item) => {
                    const product = productData.find((product) => item.product.id === product.id);
                    return product ? { ...product, quantity: item.quantity, itemId: item.id } : null;
                }).filter(Boolean);
                console.log('cart items from backend', items);
                setCartItems(items);
                setTotalItems(items.length);
                updateTotalAmount(items);
            }
        } catch (error) {
            console.log(error);
            const cart = { user: { id } };
            await createCart2(cart, token);
        }
    };

    const createCart2 = async (payload, token) => {
        try {
            console.log(payload);
            const response = await createCart(payload, token);
            console.log(response);
        } catch (error) {
            console.error('Failed to create cart:', error);
        }
    };

    const updateTotalAmount = (items) => {
        const amount = items.reduce((accumulator, item) => {
            return accumulator + item.discountedPrice * item.quantity;
        }, 0);
        setTotalAmount(amount);
    };

    const handleSetJwtToken = (newToken) => {
        setJwtToken(newToken);
        localStorage.setItem('jwtToken', newToken);
        fetchProductsAndCart(newToken);
    };

    const handleSetUser = (comingUser) => {
        setUser(comingUser);
        localStorage.setItem('UserId', comingUser.id);
    };

    const handleSetCart = (comingCart) => {
        setCart(comingCart);
    };

    const handleLogin = (newToken) => {
        handleSetJwtToken(newToken);
        sessionStorage.removeItem('hasLoggedOut');
    };

    const handleLogout = () => {
        setJwtToken(null);
        localStorage.removeItem('jwtToken');
        setUser(null);
        localStorage.removeItem('UserId');
        setCartItems([]);
        setTotalItems(0);
        setTotalAmount(0);
    };

    const addToCart = async (product, quantity = 1) => {
        if (!cart.id) {
            console.error('Cart ID is not available');
            navigate('/auth/register');
            return;
        }
        const payload = {
            product: {
                id: product.id,
                title: product.title
            },
            quantity
        };
        try {
            const response = await addItemToCart(cart.id, payload, jwtToken);
            if (response && response.status === 200) {
                // setCartItems((prevCartItems) => {
                //     const found = prevCartItems.some((item) => item.id === product.id);
                //     if (!found) {
                //         const updatedCartItems = [...prevCartItems, { ...product, quantity }];
                //         setTotalItems(updatedCartItems.length);
                //         updateTotalAmount(updatedCartItems);
                //         return updatedCartItems;
                //     }
                //     return prevCartItems;
                // });
                fetchProductsAndCart(jwtToken);
            }
        } catch (error) {
            console.error('Failed to add item to cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        const item = cart.items.find(item => item.product.id === productId);
        if (item) {
            const itemId = item.id;
            try {
                const response = await removeItem(itemId, jwtToken);
                if (response && response.status === 200) {
                    setCartItems((prevCartItems) => {
                        const updatedCartItems = prevCartItems.filter((item) => item.id !== productId);
                        setTotalItems(updatedCartItems.length);
                        updateTotalAmount(updatedCartItems);
                        return updatedCartItems;
                    });
                }
            } catch (error) {
                console.error('Failed to remove the item:', error);
            }
        } else {
            console.error(`Item with product ID ${productId} not found in cart.`);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        const item = cart.items.find(item => item.product.id === productId);
        if (item) {
            const itemId = item.id;
            try {
                const response = await updateCartItemQuantity(cart.id, itemId, newQuantity, jwtToken);
                if (response && response.status === 200) {
                    setCartItems((prevCartItems) => {
                        const updatedCartItems = prevCartItems.map((item) =>
                            item.id === productId ? { ...item, quantity: newQuantity } : item
                        );
                        updateTotalAmount(updatedCartItems);
                        return updatedCartItems;
                    });
                }
            } catch (error) {
                console.error('Failed to update item quantity:', error);
            }
        } else {
            console.error(`Item with product ID ${productId} not found in cart.`);
        }
    };

    return (
        <UserContext.Provider
            value={{
                jwtToken,
                user,
                cart,
                handleSetUser,
                cartItems,
                handleLogin,
                handleLogout,
                addToCart,
                removeFromCart,
                updateQuantity,
                totalItems,
                totalAmount,
                products,
                fashionProducts
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
