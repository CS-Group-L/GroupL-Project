import { Router } from 'express';
import frontendRoutes from './TestController';
const controllerRoutes = Router();

controllerRoutes.use(frontendRoutes);

export default controllerRoutes;