import { Router } from 'express';
import { Server as WsServer } from 'socket.io';
import AuthenticationController from './AuthenticationController';
import ClusterController from './ClusterController';


export default () => {
    const ControllerRoutes = Router();

    ControllerRoutes.use("/Cluster", ClusterController);
    ControllerRoutes.use("/Users", AuthenticationController);

    return ControllerRoutes;
};