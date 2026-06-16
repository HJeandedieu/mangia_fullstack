import { Router } from "express";
import {
  submitReservation,
  getMyReservations,
  getAllReservations,
  changeReservationStatus,
} from "./reservations.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const reservationsRouter = Router();

reservationsRouter.post("/", authenticate, authorize("CUSTOMER"), submitReservation);
reservationsRouter.get("/my", authenticate, authorize("CUSTOMER"), getMyReservations);
reservationsRouter.get("/", authenticate, authorize("ADMIN"), getAllReservations);
reservationsRouter.patch("/:id/status", authenticate, authorize("ADMIN"), changeReservationStatus);

export default reservationsRouter;