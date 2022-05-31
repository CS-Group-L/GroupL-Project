import { Router } from 'express';
import { Server as WsServer } from 'socket.io';
import AuthenticationController from './AuthenticationController';
import ClusterController from './ClusterController';


export default (io: WsServer) => {
    const ControllerRoutes = Router();

    ControllerRoutes.use("/Cluster", ClusterController(io));
    ControllerRoutes.use("/Users", AuthenticationController);

    return ControllerRoutes;
};