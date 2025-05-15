import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './src/schema/schema.js';
import resolvers from './src/resolvers/resolvers.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use('/api/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.listen(process.env.PORT || 4000, () => {
  console.log('Server running on port 4000');
});

export default app;