import Express from 'express';
import fileUpload from "express-fileupload";
import bodyParser from 'body-parser';
import cors from "cors";
import { config } from 'dotenv';
import controllerRoutes from './src/controllers';

config();

const port = process.env.PORT ?? 3000;
const app = Express();

app.use(cors({
    origin: "*"
}));
app.use(fileUpload({ useTempFiles: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controllerRoutes);

app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});