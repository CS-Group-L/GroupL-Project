import Express, { Request, Response } from 'express';
import path from 'path';
const app = Express();

app.get('*', (_, res: Response) => {
    return res.sendFile(
        path.resolve(__dirname, "../../public/index.html"),
        (err) => console.log(err)
    );
});

export default (port = 3000) => {
    app.listen(port, () => {
        console.log(`Server started on: http://localhost:${port}`);
    });
};