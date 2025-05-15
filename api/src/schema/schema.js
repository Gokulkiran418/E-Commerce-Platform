import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type User {
    id: ID!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    image_path: String!
  }

  type CartItem {
    id: ID!
    product: Product!
    quantity: Int!
  }

  type Query {
    products: [Product!]!
    cart(userId: ID!): [CartItem!]!
    product(id: ID!): Product
  }

  type Mutation {
    register(email: String!, password: String!): User!
    login(email: String!, password: String!): String!
    addToCart(userId: ID!, productId: ID!, quantity: Int!): CartItem!
    removeFromCart(userId: ID!, productId: ID!): Boolean!
    updateCartQuantity(userId: ID!, productId: ID!, quantity: Int!): CartItem!
  }
`);

export default schema;