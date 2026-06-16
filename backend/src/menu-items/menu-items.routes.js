import { Router } from "express";
import {
  createMenuItem,
  editMenuItem,
  fetchMenuItems,
  fetchSingleMenuItem,
  removeMenuItem,
} from "./menu-items.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const menuItemsRouter = Router();

menuItemsRouter.get("/", fetchMenuItems);

menuItemsRouter.get("/:id", fetchSingleMenuItem);

menuItemsRouter.post("/", authenticate, authorize("ADMIN"), createMenuItem);

menuItemsRouter.put("/:id", authenticate, authorize("ADMIN"), editMenuItem);

menuItemsRouter.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  removeMenuItem,
);

export default menuItemsRouter;
