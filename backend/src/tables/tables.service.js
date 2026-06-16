import prisma from "../lib/prisma.js";
import { AppError, NotFoundError, BadRequestError } from "../utils/errors.js";

export const createTable = async ({ tableNumber, capacity }) => {
  const newTable = await prisma.table.create({
    data: {
      tableNumber,
      capacity,
    },
  });

  return newTable;
};

export const fetchAllTables = async () => {
  const tables = await prisma.table.findMany();
  return tables;
};

export const fetchTable = async (id) => {
  const table = await prisma.table.findUnique({
    where: {
      id: id,
    },
  });

  if (!table) {
    throw new NotFoundError("Table not found");
  }

  return table;
};

export const updateTable = async ({ id, tableNumber, capacity }) => {
  const tableExists = await prisma.table.findUnique({
    where: {
      id: id,
    },
  });

  if (!tableExists) {
    throw new NotFoundError("Table not found");
  }

  const updatedTable = await prisma.table.update({
    where: {
      id: id,
    },
    data: {
      tableNumber,
      capacity,
    },
  });

  return updatedTable;
};

export const deleteTable = async (id) => {
  const tableExists = await prisma.table.findUnique({
    where: {
      id: id,
    },
  });

  if (!tableExists) {
    throw new NotFoundError("Table not found");
  }

  const activeReservation = await prisma.reservation.findFirst({
    where: {
      tableId: id,
      status: "APPROVED",
    },
  });

  if (activeReservation) {
    throw new AppError("Can't delete a table with active reservation", 409);
  }

  const deletedTable = await prisma.table.delete({
    where: {
      id: id,
    },
  });

  return deletedTable;
};
