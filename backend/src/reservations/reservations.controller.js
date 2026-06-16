import {
  createReservation,
  fetchCustomerReservations,
  fetchAllReservations,
  updateReservationStatus,
} from "./reservations.service.js";

export const submitReservation = async (req, res, next) => {
  try {
    const result = await createReservation({
      customerId: req.user.userId,
      tableId: req.body.tableId,
      reservationDate: req.body.reservationDate,
      guestCount: req.body.guestCount,
    });
    res.status(201).json({ success: true, message: "Reservation submitted successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const getMyReservations = async (req, res, next) => {
  try {
    const result = await fetchCustomerReservations(req.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllReservations = async (req, res, next) => {
  try {
    const result = await fetchAllReservations();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const changeReservationStatus = async (req, res, next) => {
  try {
    const result = await updateReservationStatus({
      id: req.params.id,
      status: req.body.status,
    });
    res.status(200).json({ success: true, message: "Reservation status updated", data: result });
  } catch (error) {
    next(error);
  }
};