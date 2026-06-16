import { Router } from "express"
import { editCategory, fetchCategories, fetchSingleCategory, registerCategory, removeCategory } from "./categories.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/", fetchCategories )
categoriesRouter.get("/:id", fetchSingleCategory)
categoriesRouter.post("/", authenticate, authorize("ADMIN"), registerCategory)
categoriesRouter.put("/:id", authenticate, authorize("ADMIN"), editCategory)
categoriesRouter.delete("/:id", authenticate, authorize("ADMIN"), removeCategory)

export default categoriesRouter;