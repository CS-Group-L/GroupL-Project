import Express, { Request, Response } from 'express';
import fileUpload from "express-fileupload";
import bodyParser from 'body-parser';
import cors from "cors";
import { config } from 'dotenv';
import { createServer } from 'https';
config();
import controllerRoutes from './src/controllers';
import { readFileSync } from 'fs';
import path from 'path';

const clientPath = path.join(__dirname, "/client");
export const corsOptions = { origin: "*" };

const port = process.env.PORT ?? 3000;
const app = Express();
const server = createServer({
    cert: readFileSync("../cert.pem"),
    key: readFileSync("../key.pem")
}, app);

app.use(cors(corsOptions));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", Express.static(
    path.join(clientPath, "/public")
));
app.use("/api", controllerRoutes());
const serveSPA = (req: Request, res: Response) =>
    res.sendFile("/index.html", { root: clientPath });

app.get("/", serveSPA);
app.get("/users", serveSPA);
app.get("/login", serveSPA);
app.get("/register", serveSPA);
app.get("/change-password", serveSPA);

server.listen(port, () => {
    console.log(`Server started on: https://localhost:${port}`);
});

export { server, app };