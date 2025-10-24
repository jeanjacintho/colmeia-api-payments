import { PrismaClient } from "@prisma/client";
import { CreateCustomerBody } from "../schemas/validation";
import { createError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

export class CustomerService {
    async createCustomer(data: CreateCustomerBody) {
        try {
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    OR: [
                        {email: data.email},
                        {document: data.document},
                    ]
                }
            });
    
            if(existingCustomer) {
                if(existingCustomer.email === data.email) {
                   throw createError("Email já cadastrado", 409);
                }
                if(existingCustomer.document === data.document) {
                    throw createError("CPF já cadastrado", 409);
                }
            }
    
            const customer = await prisma.customer.create({
                data
            });
    
            return customer;
        } catch (error) {
            if(error === "P2002") {
                throw createError("Email ou CPF já cadastrado", 409);
            }
            throw error;
        }
    }

    async getCustomerById(id: string) {
        const customer = await prisma.customer.findUnique({
            where: {
                id
            }
        });

        if(!customer) {
            throw createError("Cliente não encontrado", 404);
        }

        return customer;
    }

    async getAllCustomers(page: number, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
            }),
            prisma.customer.count(),
        ]);

        return {
            customers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async updateCustomer(id: string, data: Partial<CreateCustomerBody>) {
        const customer = await prisma.customer.findUnique({
            where: {
                id
            }
        });

        if(!customer) {
            throw createError("Cliente não encontrado", 404);
        }

        try {
            const updatedCustomer = await prisma.customer.update({
                where: {
                    id
                },
                data
            })
            return updatedCustomer;
        } catch (error) {
            if(error === "P2002") {
                throw createError("Email ou CPF já cadastrado", 409);
            }
            throw error;
        }

    }

    async deleteCustomer(id: string) {
        const customer = prisma.customer.findUnique({
            where: {
                id
            }
        });

        if(!customer) {
            throw new Error("Cliente não encontrado");
        }

        await prisma.customer.delete({
            where: {
                id
            }
        });

        return { message: "Cliente deletado com sucesso" };
    }
}