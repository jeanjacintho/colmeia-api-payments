import z from "zod";

export const createCustomerSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.email("Email inválido"),
    document: z.string().min(11, "CPF deve ter 11 caracteres"),
    phone: z.string().min(11, "Telefone deve ter 11 caracteres"),
})

export const createChargeSchema = z.object({
    amount: z.number().positive("Valor deve ser positivo"),
    currency: z.string().default("BRL"),
    paymentMethod: z.enum(["CREDIT_CARD", "PIX", "BOLETO"]),
    customerId: z.string().min(1, "ID do cliente é obrigatório"),
    pixData: z.object({
        key: z.string().optional()
    }).optional(),
    cardData: z.object({
        installments: z.number().min(1).max(12).optional(),
        cardNumber: z.string().optional(),
        cardHolder: z.string().optional(),
    }).optional(),
    boletoData: z.object({
        dueDate: z.string().optional(),
        instructions: z.string().optional(),
    }).optional()
})

export const updateChargeStatusSchema = z.object({
    status: z.enum(["PENDING", "PAID", "FAILED", "EXPIRED", "REFUNDED", "CANCELLED"]),
})

export type CreateCustomerBody = z.infer<typeof createCustomerSchema>;
export type CreateChargeBody = z.infer<typeof createChargeSchema>;
export type UpdateChargeStatusBody = z.infer<typeof updateChargeStatusSchema>;