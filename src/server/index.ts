import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { Remult, SqlDatabase } from 'remult';
import { PostgresDataProvider, verifyStructureOfAllEntities } from 'remult/postgres';
import { Pool } from 'pg';
import expressJwt from 'express-jwt';
import { getJwtTokenSignKey } from '../AuthService';
import { initExpress } from 'remult/server';
import '../Task';

let app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(expressJwt({
    secret: getJwtTokenSignKey(),
    credentialsRequired: false,
    algorithms: ['HS256']
}));
let getDatabase = () => {
    if (process.env.NODE_ENV === "production") {
        const db = new SqlDatabase(new PostgresDataProvider(new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV !== "production" ? false : {
                rejectUnauthorized: false
            }
        })));
        let remult = new Remult();
        remult.setDataProvider(db);
        verifyStructureOfAllEntities(db, remult);
        return db;
    }
    return undefined;
}
let api = initExpress(app, {
    dataProvider: getDatabase()
});
app.use('/api/docs', swaggerUi.serve,
    swaggerUi.setup(api.openApiDoc({ title: 'remult-react-todo' })));

app.use(express.static('build'));
app.use('/*', async (req, res) => {
    res.sendFile('./build/index.html');
});
app.listen(process.env.PORT || 3002, () => console.log("Server started"))