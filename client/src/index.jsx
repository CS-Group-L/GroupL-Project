import React from 'react';
import { createRoot } from "react-dom/client";
import "./res/index.scss";
import App from './views/App';

const root = createRoot(
    document.getElementById("react-root")
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);