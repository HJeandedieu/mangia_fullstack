import { createCategory,fetchAllCategories, fetchCategory, updateCategory, deleteCategory } from "./categories.service.js";

export const registerCategory = async (req, res, next) => {
    try{
        const result = await createCategory(req.body);
        res.status(201).json({success: true, message: "Category created Successfully", data: result})

    } catch (error){
        next(error)
    }
};

export const fetchCategories = async (req, res, next) => {
    try{
        const result = await fetchAllCategories();
        res.status(200).json({success: true, data:result})
    } catch(error){
        next(error)
    }
}

export const fetchSingleCategory = async (req, res, next) => {
    try{
        const result = await fetchCategory(req.params.id);
        res.status(200).json({success: true, data: result});
    } catch(error){
        next(error)
    }
}

export const editCategory = async (req, res, next) => {
    try{
        const result = await updateCategory({id: req.params.id, ...req.body});
        res.status(200).json({success: true, message: "Category updated Successfully", data: result})

    } catch (error){
        next(error)
    }
}

export const removeCategory = async (req, res, next) => {
    try{

        const result = await deleteCategory(req.params.id);
        res.status(200).json({success: true, message: "Category deleted successfully", data:result})

    } catch(error){
        next(error)
    }
}