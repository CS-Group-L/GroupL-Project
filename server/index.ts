import Express from 'express';
import fileUpload from "express-fileupload";
import controllerRoutes from './src/controllers';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import { Execute } from './src/services/ClusterService';
config();

const port = process.env.PORT ?? 3000;
const app = Express();

app.use(fileUpload({ useTempFiles: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controllerRoutes);
Execute();

app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});