import Express from 'express';
import fileUpload from "express-fileupload";
import bodyParser from 'body-parser';
import { Server as wsServer } from "socket.io";
import cors from "cors";
import { config } from 'dotenv';
import { createServer } from 'http';
import controllerRoutes from './src/controllers';

config();

const port = process.env.PORT ?? 3000;
const app = Express();
const server = createServer(app);
const websocketServer = new wsServer(server);

app.use(cors({ origin: "*" }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(controllerRoutes(websocketServer));

server.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});

export { websocketServer, server, app };