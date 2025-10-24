import { Router } from "express";
import { validateBody } from "../middlewares/validation";
import { createChargeSchema, updateChargeStatusSchema } from "../schemas/validation";
import { createCharge, getAllCharges, getChargeByCustomer, getChargeById, getChargesByStatus, updateChargeStatus } from "../controllers/chargeController";

const router = Router();

router.post('/', validateBody(createChargeSchema), createCharge);
router.get('/', getAllCharges);
router.get('/status/:status', getChargesByStatus);
router.get('/customer/:id', getChargeByCustomer);
router.get('/:id', getChargeById);
router.put('/status/:id/', validateBody(updateChargeStatusSchema), updateChargeStatus);

export default router;