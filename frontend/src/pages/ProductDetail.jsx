import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from '../context/AuthContext';

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      image_path
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($userId: ID!, $productId: ID!, $quantity: Int!) {
    addToCart(userId: $userId, productId: $productId, quantity: $quantity) {
      id
      quantity
    }
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const { getUserId } = useAuth();
  const userId = getUserId();
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });
  const [addToCart] = useMutation(ADD_TO_CART);

  const handleAddToCart = (productId) => {
    if (!userId) {
      alert('Please log in to add items to cart');
      return;
    }
    addToCart({ variables: { userId, productId, quantity: 1 } })
      .then(() => alert('Added to cart'))
      .catch(error => alert(error.message));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <img src={product.image_path} alt={product.name} style={{ maxWidth: '300px' }} />
      <p>{product.description}</p>
      <p>${product.price}</p>
      <button className="btn btn-success" onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
    </div>
  );
};

export default ProductDetail;