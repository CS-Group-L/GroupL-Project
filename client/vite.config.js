import { defineConfig } from 'vite';
import { config as configEnv } from "dotenv";
import react from "@vitejs/plugin-react";

configEnv();

export default defineConfig({
    server: { port: process.env.PORT ?? 3001 },
    plugins: [react()]
});