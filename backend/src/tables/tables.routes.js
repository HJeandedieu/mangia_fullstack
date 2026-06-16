import { Router } from "express";
import {
  editTable,
  fetchSingleTable,
  fetchTables,
  registerTable,
  removeTable,
} from "./tables.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const tablesRouter = Router();

tablesRouter.get("/", fetchTables);

tablesRouter.get("/:id", fetchSingleTable);

tablesRouter.post("/", authenticate, authorize("ADMIN"), registerTable);

tablesRouter.put("/:id", authenticate, authorize("ADMIN"), editTable);

tablesRouter.delete("/:id", authenticate, authorize("ADMIN"), removeTable);

export default tablesRouter;
