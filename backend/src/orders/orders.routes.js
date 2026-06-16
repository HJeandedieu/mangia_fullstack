import { Router } from "express";
import { placeOrder, getMyOrders, getAllOrders, changeOrderStatus } from "./orders.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const ordersRouter = Router();

ordersRouter.post("/", authenticate, authorize("CUSTOMER"), placeOrder);
ordersRouter.get("/my", authenticate, authorize("CUSTOMER"), getMyOrders);
ordersRouter.get("/", authenticate, authorize("ADMIN"), getAllOrders);
ordersRouter.patch("/:id/status", authenticate, authorize("ADMIN"), changeOrderStatus);

export default ordersRouter;