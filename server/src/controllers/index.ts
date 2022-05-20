import { Router } from 'express';
import testRoutes from './TestController';
import testRoutes1 from './test1';
const controllerRoutes = Router();

controllerRoutes.use(testRoutes);
controllerRoutes.use(testRoutes1);

export default controllerRoutes;