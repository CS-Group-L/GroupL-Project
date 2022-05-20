import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import Routes from "./Routes";
import "./res/index.scss";

const root = createRoot(
    document.getElementById("react-root")
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    </React.StrictMode>
);