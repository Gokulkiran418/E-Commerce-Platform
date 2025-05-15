import pool from '../utils/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const resolvers = {
  products: async () => {
    const { rows } = await pool.query('SELECT * FROM products');
    return rows;
  },
  cart: async ({ userId }) => {
    const { rows } = await pool.query(
      'SELECT c.id, c.quantity, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
      [userId]
    );
    return rows.map(row => ({
      id: row.id,
      product: {
        id: row.product_id,
        name: row.name,
        description: row.description,
        price: row.price,
        image_path: row.image_path,
      },
      quantity: row.quantity,
    }));
  },
  product: async ({ id }) => {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0];
  },
  register: async ({ email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    return rows[0];
  },
  login: async ({ email, password }) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  },
  addToCart: async ({ userId, productId, quantity }) => {
    try {
      const { rows } = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id, quantity',
        [userId, productId, quantity]
      );
      const cartItem = rows[0];
      const product = await resolvers.product({ id: productId });
      return { id: cartItem.id, product, quantity: cartItem.quantity };
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        const { rows } = await pool.query(
          'UPDATE cart SET quantity = quantity + $3 WHERE user_id = $1 AND product_id = $2 RETURNING id, quantity',
          [userId, productId, quantity]
        );
        const cartItem = rows[0];
        const product = await resolvers.product({ id: productId });
        return { id: cartItem.id, product, quantity: cartItem.quantity };
      }
      throw error;
    }
  },
  removeFromCart: async ({ userId, productId }) => {
    await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    return true;
  },
  updateCartQuantity: async ({ userId, productId, quantity }) => {
    const { rows } = await pool.query(
      'UPDATE cart SET quantity = $3 WHERE user_id = $1 AND product_id = $2 RETURNING id, quantity',
      [userId, productId, quantity]
    );
    const cartItem = rows[0];
    const product = await resolvers.product({ id: productId });
    return { id: cartItem.id, product, quantity: cartItem.quantity };
  },
};

export default resolvers;