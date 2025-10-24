import z from "zod";

export const createCustomerSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.email("Email inválido"),
    document: z.string().min(11, "CPF deve ter 11 caracteres"),
    phone: z.string().min(11, "Telefone deve ter 11 caracteres"),
})

export type CreateCustomerBody = z.infer<typeof createCustomerSchema>;