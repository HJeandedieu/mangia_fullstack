import {
  createOrder,
  fetchCustomerOrders,
  fetchAllOrders,
  updateOrderStatus,
} from "./orders.service.js";

export const placeOrder = async (req, res, next) => {
  try {
    const result = await createOrder({
      customerId: req.user.userId, // never from req.body
      items: req.body.items,
      orderType: req.body.orderType,
      deliveryAddress: req.body.deliveryAddress,
      notes: req.body.notes,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Order placed successfully",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const result = await fetchCustomerOrders(req.user.userId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const result = await fetchAllOrders();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const changeOrderStatus = async (req, res, next) => {
  try {
    const result = await updateOrderStatus({
      id: req.params.id,
      status: req.body.status,
    });
    res
      .status(200)
      .json({ success: true, message: "Order status updated", data: result });
  } catch (error) {
    next(error);
  }
};
