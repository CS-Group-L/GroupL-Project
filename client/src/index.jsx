import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import Routes from "./Routes";
import { AuthProvider } from './hooks/useAuth';
import "./res/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";

const root = createRoot(
    document.getElementById("react-root")
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);