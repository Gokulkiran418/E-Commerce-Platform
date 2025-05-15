import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
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

const Home = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();
  const { loading, error, data } = useQuery(GET_PRODUCTS);
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

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="row">
        {data.products.map(product => (
          <div key={product.id} className="col-md-4">
            <div className="card mb-4">
              <img 
                src={product.image_path} 
                className="card-img-top" 
                alt={product.name} 
                onError={(e) => e.target.src = '/assets/images/placeholder.jpg'} 
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">${product.price}</p>
                <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
                <button className="btn btn-success ms-2" onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;