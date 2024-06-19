import React from 'react';
import { useUserContext } from '../SpringSecurityComponents/UserContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, totalItems, totalAmount } = useUserContext();

    // Handle displaying cart items (assuming 'CartItem' component exists)
    const renderCartItems = () => {
        return cartItems.map((item, index) => (
            <CartItem key={index} item={item} onRemove={removeFromCart} onUpdate={updateQuantity} />
        ));
    };

    return (
        <div className="cart">
            <h2>Cart Items</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className='my-3'>{renderCartItems()}</ul>
            )}
            {cartItems.length > 0 && (
                <div className="cart-total p-3">
                    <p>Total items: {totalItems}</p>
                    <p>Total items value: ₹{new Intl.NumberFormat('en-IN').format(totalAmount)}</p>
                </div>
            )}
            {/* Add buttons or functionalities for checkout or other actions */}
        </div>
    );
};

export default Cart;


export const CartItem = ({ item, onRemove, onUpdate }) => {

    const { imageUrl, title, discountedPrice } = item;

    const handleRemove = () => {
        onRemove(item.title); // Call the removal function provided as a prop
    };

    // const handleQuantityChange = (event) => {
    //     // const newQuantity = parseInt(event.target.value, 10);
    //     const newQuantity = event.target.value;
    //     onUpdate(item.title, newQuantity); // Call the update function with new quantity
    // };
    const decreaseQuantity = () => {
        if (item.quantity > 1) {
            onUpdate(item.title, item.quantity - 1); // Call the update function with new quantity
        }
    }
    const increaseQuantity = () => {
        onUpdate(item.title, item.quantity + 1); // Call the update function with new quantity
    }

    return (
        <li className="cart-item my-3" style={{ listStyle: 'none' }} key={item.title}>
            <img src={imageUrl} alt={title} />
            <div className="cart-item-info">
                <h4>{title}</h4>
                <p>Price: ₹{new Intl.NumberFormat('en-IN').format(discountedPrice)}</p>
                {/* <p>Quantity: <input type="number" min={1} max={10} value={item.quantity} onChange={e => handleQuantityChange(e)} /></p> */}
                <p>Quantity : &nbsp;
                    <button className="rounded-start btn btn-light" onClick={decreaseQuantity}>−</button>
                    {/* <span style={{backgroundColor:'red'}}>{item.quantity}</span> */}
                    {item.quantity}&nbsp;
                    <button className="btn btn-light" onClick={increaseQuantity}>+</button>&nbsp;
                </p>
                {/* <p>Quantity : &nbsp;
                    <button className="rounded-start border border-info-subtle m-0" onClick={decreaseQuantity}>−</button>
                    <button className="border border-light-subtle" style={{ cursor: 'text' }} >{item.quantity}</button>
                    <button className="rounded-end border border-info-subtle" onClick={increaseQuantity}>+</button>
                </p> */}
            </div>
            <button className="btn btn-light border-secondary-subtle" onClick={handleRemove}>Remove</button>
        </li>
    );
};