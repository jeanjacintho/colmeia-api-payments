import z from "zod";
import { ChargeService } from "../services/chargeService";
import { NextFunction, Request, Response} from "express";

const chargeService = new ChargeService();

const chargeIdSchema = z.object({
    id: z.string().min(1, "ID é obrigatório"),
});

export const createCharge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const charge = await chargeService.createCharge(req.body);
        res.status(201).json({
            sucess: true,
            data: charge
        })
    } catch(error) {
        next(error);
    }
}

export const getChargeById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = chargeIdSchema.parse(req.params);
        const charge = await chargeService.getChargeById(id);
        res.json({
            success: true,
            data: charge
        });
    } catch(error) {
        next(error);
    }
}

export const getAllCharges = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const customerId = req.query.customerId as string;

        const result = await chargeService.getAllCharges(page, limit, customerId);
        res.json({
            success: true,
            data: result.charges,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
}

export const updateChargeStatus = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = chargeIdSchema.parse(req.params);
        const charge = await chargeService.updateChargeStatus(id, req.body);
        res.json({
            success: true,
            data: charge
        })
    } catch (error) {
        next(error);
    }
}

export const getChargeByCustomer = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = chargeIdSchema.parse(req.params);
        const charges = await chargeService.getChargeByCustomer(id);
        res.json({
            success: true,
            data: charges
        })
    } catch (error) {
        next(error);
    }
}

export const getChargesByStatus = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const status = req.params.status as any;
        const charges = await chargeService.getChargesByStatus(status);
        res.json({
            success: true,
            data: charges
        });
    } catch (error) {
        next(error);
    }
}