import { defineConfig } from 'vite';
import { config as configEnv } from "dotenv";
import react from "@vitejs/plugin-react";
import fs from "fs";

configEnv();

export default defineConfig({
    build: {
        outDir: "../server/client",
        assetsDir: "public/assets",
        emptyOutDir: true
    },
    server: {
        port: process.env.PORT ?? 3001,
        https: {
            cert: fs.readFileSync("../cert.pem"),
            key: fs.readFileSync("../key.pem")
        }
    },
    plugins: [react()]
});