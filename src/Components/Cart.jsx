import React, { useState, useEffect } from 'react';
import { useUserContext } from '../SpringSecurityComponents/UserContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, handlePaymentItems, itemsForPayment, totalQuantity, paymentAmount } = useUserContext();
    const [checkedItems, setCheckedItems] = useState([]);
    const navigate = useNavigate();

    // Handle checkbox change
    const handleCheck = (id, checked) => {
        setCheckedItems((prevCheckedItems) =>
            checked ? [...prevCheckedItems, id] : prevCheckedItems.filter((itemId) => itemId !== id)
        );
    };

    // Update itemsForPayment and paymentAmount whenever checkedItems or cartItems change
    useEffect(() => {
        const updatedItemsForPayment = cartItems.filter(item => checkedItems.includes(item.id));
        handlePaymentItems(updatedItemsForPayment);
    }, [checkedItems, cartItems]);

    // Handle displaying cart items (assuming 'CartItem' component exists)
    const renderCartItems = () => {
        return cartItems.map((item, index) => (
            <CartItem key={index} item={item} onRemove={removeFromCart} onUpdate={updateQuantity} onCheck={handleCheck} />
        ));
    };

    const checkOut = () => {
        console.log('placing order steps : address select');
        navigate('/addressList');
    };

    return (
        <div className="cart py-4">
            <h2>Cart Items</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="list-group my-3">{renderCartItems()}</ul>
                
            )}
            {itemsForPayment.length > 0 && (
                <div className="p-3" style={{ backgroundColor: '#EFEBE9' }}>
                    <p>Total items: {totalQuantity}</p>
                    <p>Subtotal: ₹{new Intl.NumberFormat('en-IN').format(paymentAmount)}</p>
                    <button className="btn btn-light border-secondary-subtle" onClick={checkOut}>Proceed to checkout</button>
                </div>
            )}
        </div>
    );
};

export default Cart;

export const CartItem = ({ item, onRemove, onUpdate, onCheck }) => {
    const { imageUrl, title, discountedPrice } = item;

    const handleRemove = () => {
        onRemove(item.id);
    };

    const decreaseQuantity = () => {
        if (item.quantity > 1) {
            onUpdate(item.id, item.quantity - 1);
        }
    };

    const increaseQuantity = () => {
        onUpdate(item.id, item.quantity + 1);
    };

    const handleCheck = (e) => {
        onCheck(item.id, e.target.checked);
    };

    const checkboxId = `checkbox-${item.id}`;

    return (
        <li className="list-group-item cart-item mx-3" key={item.id}>
            <div className="row align-items-center">
                <div className="col-auto">
                    <input
                        className="form-check-input me-1"
                        type="checkbox"
                        value={item.id}
                        id={checkboxId}
                        onChange={handleCheck}
                    />
                </div>
                <div className="col-auto">
                    <img src={imageUrl} alt={title} className="object-fit-fill border rounded me-3" />
                </div>
                <div className="col">
                    <div className="cart-item-info">
                        <h6>{title}</h6>
                        <p>Price: ₹{new Intl.NumberFormat('en-IN').format(discountedPrice)}</p>
                        <p>
                            <button className="rounded-start btn btn-light" onClick={decreaseQuantity}>−</button>
                            &nbsp;{item.quantity}&nbsp;
                            <button className="btn btn-light" onClick={increaseQuantity}>+</button>&nbsp;
                        </p>
                        <button className="btn btn-light border-secondary-subtle mt-2" onClick={handleRemove}>Remove</button>
                    </div>
                </div>
            </div>
        </li>
    );
};
