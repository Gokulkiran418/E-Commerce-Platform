import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';

const GET_CART = gql`
  query GetCart($userId: ID!) {
    cart(userId: $userId) {
      id
      product {
        id
        name
        price
        image_path
      }
      quantity
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($userId: ID!, $productId: ID!) {
    removeFromCart(userId: $userId, productId: $productId)
  }
`;

const UPDATE_CART_QUANTITY = gql`
  mutation UpdateCartQuantity($userId: ID!, $productId: ID!, $quantity: Int!) {
    updateCartQuantity(userId: $userId, productId: $productId, quantity: $quantity) {
      id
      quantity
    }
  }
`;

const Cart = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();
  const { loading, error, data, refetch } = useQuery(GET_CART, { variables: { userId }, skip: !userId });
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [updateCartQuantity] = useMutation(UPDATE_CART_QUANTITY);

  if (!userId) return <p>Please log in to view your cart.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const cartItems = data.cart;

  const handleRemove = (productId) => {
    removeFromCart({ variables: { userId, productId } })
      .then(() => refetch())
      .catch(error => alert(error.message));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      handleRemove(productId);
    } else {
      updateCartQuantity({ variables: { userId, productId, quantity } })
        .then(() => refetch())
        .catch(error => alert(error.message));
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="container">
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group">
            {cartItems.map(item => (
              <li key={item.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <img src={item.product.image_path} alt={item.product.name} style={{ width: '50px', marginRight: '10px' }} />
                    {item.product.name} - ${item.product.price} x {item.quantity}
                  </div>
                  <div>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    <button className="btn btn-sm btn-danger ms-2" onClick={() => handleRemove(item.product.id)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-3">Total: ${totalPrice.toFixed(2)}</h3>
          <button className="btn btn-success mt-3" onClick={() => alert('Checkout successful!')}>Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;