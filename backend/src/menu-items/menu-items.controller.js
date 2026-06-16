import { registerMenuItem, fetchAllMenuItems, fetchMenuItem, updateMenuItem, deleteMenuItem } from "./menu-items.service.js";


export const createMenuItem = async(req, res, next) => {
    try{

        const result = await registerMenuItem(req.body);
        res.status(201).json({success: true, message: "Menu Item created successfully", data: result});

    }catch (error){
        next(error)
    }
}

export const fetchMenuItems = async (req, res, next) => {
    try{

        const result = await fetchAllMenuItems();
        res.status(200).json({success: true, data: result})

    } catch(error){
        next(error)
    }
}

export const fetchSingleMenuItem = async (req, res, next) => {
    try{
        const result = await fetchMenuItem(req.params.id);
        res.status(200).json({success: true, data: result});

    } catch(error){
        next(error)
    }
}

export const editMenuItem = async (req, res, next) => {
    try{

        const result = await updateMenuItem({id: req.params.id, ...req.body});
        res.status(200).json({success: true, message: "Menu Item updated successfully", data: result})

    } catch (error){
        next(error)
    }
}

export const removeMenuItem = async (req, res, next) => {
    try{
        const result = await deleteMenuItem(req.params.id);
        res.status(200).json({success: true, message: "Menu Item deleted Successfully", data: result})
    } catch (error){
        next(error);
    }
}