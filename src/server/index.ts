import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import { remultGraphql } from 'remult/graphql';
import { initExpress } from 'remult/server';

let app = express();
let api = initExpress(app);

app.use('/api/docs', swaggerUi.serve,
    swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' })));

const { schema, rootValue } = remultGraphql(api);
app.use('/api/graphql', graphqlHTTP({
    schema: buildSchema(schema),
    rootValue,
    graphiql: true,
}));

app.listen(3002, () => console.log("Server started"));