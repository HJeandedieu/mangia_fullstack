import prisma from "../lib/prisma.js";
import { AppError, NotFoundError, BadRequestError } from "../utils/errors.js";

export const createCategory = async ({ name }) => {
  const categoryExists = await prisma.category.findUnique({
    where: {
      name: name,
    },
  });

  if (categoryExists) {
    throw new AppError("Category already exists", 409);
  }

  const newCategory = await prisma.category.create({
    data: {
      name: name,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return newCategory;
};

export const fetchAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

export const fetchCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return category;
};

export const updateCategory = async ({ id, name }) => {
  const categoryExists = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!categoryExists) {
    throw new NotFoundError("Category not found");
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });

  return updatedCategory;
};

export const deleteCategory = async (id) => {
  const categoryExists = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  if (!categoryExists) {
    throw new NotFoundError("Category not found");
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id: id,
    },
  });

  return deletedCategory;
};
