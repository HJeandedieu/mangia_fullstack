import { createTable, fetchAllTables, fetchTable, updateTable, deleteTable  } from "./tables.service.js";

export const registerTable = async(req, res, next) => {
    try{
        const result = await createTable(req.body)
        res.status(201).json({success: true, message: "Table registered Successfully", data: result})

    } catch(error){
        next(error)
    }
}

export const fetchTables = async(req, res, next) => {
    try{
        const result = await fetchAllTables();
        res.status(200).json({success: true, data: result});

    } catch(error){
        next(error);
    }
}

export const fetchSingleTable = async(req, res, next) => {
    try{
        const result = await fetchTable(req.params.id);
        res.status(200).json({success: true, data: result});
    } catch (error){
        next(error)
    }
}

export const editTable = async (req, res, next) => {
    try{
        const result = await updateTable({id:req.params.id, ...req.body});
        res.status(200).json({success: true, message: "Table was updated successfully", data: result});
    } catch (error){
        next(error);
    }
}

export const removeTable = async (req, res, next) => {
    try{
        const deletedTable = await deleteTable(req.params.id);
        res.status(200).json({success: true, message: "Table deleted successfully", data: deletedTable})
    } catch (error){
        next(error);
    }
}