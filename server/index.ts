import Express from 'express';
import controllerRoutes from './src/controllers';
import { config } from 'dotenv';
config();

const port = process.env.PORT ?? 3000;
const app = Express();

app.use(controllerRoutes);

app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});