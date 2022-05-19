import { Router } from 'express';
import testRoutes from './TestController';
const controllerRoutes = Router();

controllerRoutes.use(testRoutes);

export default controllerRoutes;