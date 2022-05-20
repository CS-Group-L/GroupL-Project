import { Router } from 'express';
import AuthenticationController from './AuthenticationController';
import ClusterController from './ClusterController';
const ControllerRoutes = Router();

ControllerRoutes.use("/Cluster", ClusterController);
ControllerRoutes.use("/Users", AuthenticationController);

export default ControllerRoutes;