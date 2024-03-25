
import { Router } from "express";
import * as  cartController from "./cart.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
const router = Router();





router.post('/', auth([systemRoles.USER]), expressAsyncHandler(cartController.addProductToCart))

router.put('/:productId', auth([systemRoles.USER]), expressAsyncHandler(cartController.removeFromcart))

export default router;