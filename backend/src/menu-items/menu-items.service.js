import prisma from "../lib/prisma.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

export const registerMenuItem = async ({ name, description, price, imageUrl, available, categoryId }) => {

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    if(!category){
        throw new NotFoundError("Category not found");
    }

    const newMenuItem = await prisma.menuItem.create({
        data: {
            name,
            description,
            price,
            imageUrl,
            available,
            category: {connect: {id: categoryId}}
        }
    })

    return newMenuItem;
}

export const fetchAllMenuItems = async () => {
    const menuItems = await prisma.menuItem.findMany();
    return menuItems;
}

export const fetchMenuItem = async(id) => {
    const menuItem = await prisma.menuItem.findUnique({
        where: {
            id
        }
    })

    if (!menuItem){
        throw new NotFoundError("Menu item not found");
    }

    return menuItem;
}

export const updateMenuItem = async({id, name, description, price, imageUrl, available }) => {
    const menuItemExists = await prisma.menuItem.findUnique({
        where:{
            id: id
        }
    })

    if(!menuItemExists){
        throw new NotFoundError("Menu item not found");
    }

    const updatedMenuItem = await prisma.menuItem.update({
        where: {
            id: id
        },
        data: {
            name,
            description,
            price,
            imageUrl,
            available
        }
    })

    return updatedMenuItem;
}

export const deleteMenuItem = async(id) => {
    const menuItemExists = await prisma.menuItem.findUnique({
        where: {
            id: id
        }
    })

    if(!menuItemExists){
        throw new NotFoundError("Menu item not found");
    }

    const deletedMenuItem = await prisma.menuItem.delete({
        where: {
            id: id
        }
    })

    return deletedMenuItem;
}