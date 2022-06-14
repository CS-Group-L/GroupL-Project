import Express from 'express';
import fileUpload from "express-fileupload";
import bodyParser from 'body-parser';
import cors from "cors";
import { config } from 'dotenv';
import { createServer } from 'http';
config();
import controllerRoutes from './src/controllers';


export const corsOptions = { origin: "*" };

const port = process.env.PORT ?? 3000;
const app = Express();
const server = createServer(app);

app.use(cors(corsOptions));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controllerRoutes());

server.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});

export { server, app };