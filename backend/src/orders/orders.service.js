import prisma from "../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

export const createOrder = async ({
  customerId,
  items,
  orderType = "DINE_IN",
  deliveryAddress,
  notes,
}) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new BadRequestError("Order must contain atleast one item");
  }

  // validate all items and build order data
  let totalAmount = 0;
  const orderItemsData = [];

  for (const [index, item] of items.entries()) {
    const { menuItemId, quantity } = item;

    if (!menuItemId || !quantity || quantity < 1) {
      throw new BadRequestError(`Invalid data at item index ${index}`);
    }

    // get price from the menuItem itself, not OrderItem
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem || !menuItem.available) {
      throw new BadRequestError(
        `Menu item ${menuItemId} not found or unavailable`,
      );
    }

    const unitPrice = menuItem.price;
    totalAmount += Number(unitPrice) * quantity;

    orderItemsData.push({ menuItemId, quantity, unitPrice });
  }

  // create order + all items in one transaction
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customerId,
        totalAmount,
        orderType,
        deliveryAddress,
        notes,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return newOrder;
  });

  return order;
};

export const fetchCustomerOrders = async (customerId) => {
  const orders = await prisma.order.findMany({
    where: { customerId },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  });

  return orders;
};

export const fetchAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  });

  return orders;
};

export const updateOrderStatus = async ({ id, status }) => {
  const validStatuses = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ];

  if (!validStatuses.includes(status)) {
    throw new BadRequestError("Invalid Order status");
  }

  const orderExists = await prisma.order.findUnique({
    where: { id },
  });

  if (!orderExists) {
    throw new NotFoundError("Order not found");
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return updatedOrder;
};
