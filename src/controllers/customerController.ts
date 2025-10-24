import z, { success } from "zod";
import { CustomerService } from "../services/customerService";
import { NextFunction, Request, Response } from "express";

const customerService = new CustomerService();

const customerIdSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
});

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json({
            success: true,
            data: customer
        });
    } catch(error) {
        next(error);
    }
}

export const getCustomerById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = customerIdSchema.parse(req.params);
        const customer = await customerService.getCustomerById(id);
        res.json({
            success: true,
            data: customer
        });
    } catch(error) {
        next(error);
    }
}

export const getAllCustomers = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await customerService.getAllCustomers(page, limit);
        res.json({
            sucess: true,
            data: result.customers,
            pagination: result.pagination
        })
    } catch(error) {
        next(error);
    }
}

export const updateCustomer = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = customerIdSchema.parse(req.params);
        const customer = await customerService.updateCustomer(id, req.body);
        res.json({
            success: true,
            data: customer
        })
    } catch(error) {
        next(error);
    }
}

export const deleteCustomer = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = customerIdSchema.parse(req.params);
        await customerService.deleteCustomer(id);
        res.json({
            success: true,
        })
    } catch(error) {
        next(error);
    }
}