import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { initExpress } from 'remult/server';

let app = express();
let api = initExpress(app);
app.use('/api/docs', swaggerUi.serve,
    swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' })));

app.listen(3002, () => console.log("Server started"));