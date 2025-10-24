import { Router } from "express";
import { validateBody } from "../middlewares/validation";
import { createCustomerSchema } from "../schemas/validation";
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/customerController";

const router = Router();

router.post('/', validateBody(createCustomerSchema), createCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', validateBody(createCustomerSchema.partial()), updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;