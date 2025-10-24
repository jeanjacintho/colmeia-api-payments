import { ChargeStatus, PrismaClient } from "@prisma/client";
import { CreateChargeBody, UpdateChargeStatusBody } from "../schemas/validation";
import { createError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

export class ChargeService {
    async createCharge(data: CreateChargeBody) {
        const customer = await prisma.customer.findUnique({
            where: {
                id: data.customerId
            }
        })

        if(!customer) {
            throw createError("Cliente não encontrado", 404);
        }

        const chargeData: any = {
            amount: data.amount,
            currency: data.currency,
            paymentMethod: data.paymentMethod,
            customerId: data.customerId,
            status: "PENDING",
        }

        switch(data.paymentMethod) {
            case "PIX":
                chargeData.pixData = data.pixData || { key: "" };
                break;
            case "CREDIT_CARD":
                chargeData.cardData = data.cardData || { installments: 1, cardNumber: "", cardHolder: "" };
                break;
            case "BOLETO":
                chargeData.boletoData = data.boletoData || { dueDate: "", instructions: "" };
                break;
            default:
                throw createError("Método de pagamento inválido", 400);
        }

        const charge = await prisma.charge.create({
            data: chargeData,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return charge;
    }

    async getChargeById(id: string){
        const charge = await prisma.charge.findUnique({
            where: {
                id
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        document: true,
                        phone: true
                    }
                }
            }
        });

        if(!charge) {
            throw createError("Cobrança não encontrada", 404);
        }

        return charge;
    }

    async getAllCharges(page: number = 1, limit: number = 10, customerId?: string) {
        const skip = (page - 1) * limit;
        const where = customerId ? { customerId } : {};

        const [charges, total] = await Promise.all([
            prisma.charge.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.charge.count({
                where
            })
        ]);

        return {
            charges,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async updateChargeStatus(id: string, data: UpdateChargeStatusBody) {
        const charge = await prisma.charge.findUnique({
            where: {
                id
            },
        });

        if(!charge) {
            throw createError("Cobrança não encontrada", 404);
        }

        const updateCharge = await prisma.charge.update({
            where: {
                id
            },
            data: {
                status: data.status
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return updateCharge;
    }

    async getChargeByCustomer(customerId: string) {
        const customer = await prisma.customer.findUnique({
            where: {
                id: customerId
            }
        });

        if(!customer) {
            throw createError("Cliente não encontrado", 404);
        }

        const charges = await prisma.charge.findMany({
            where: {
                customerId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return charges;
    }

    async getChargesByStatus(status: ChargeStatus) {
        const charges = await prisma.charge.findMany({
            where: {
                status
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return charges;
    }

    async getChargesByFilters(filters: { customerId?: string; status?: ChargeStatus }) {
        const where: any = {};

        if (filters.customerId) {
            const customer = await prisma.customer.findUnique({
                where: {
                    id: filters.customerId
                }
            });

            if (!customer) {
                throw createError("Cliente não encontrado", 404);
            }

            where.customerId = filters.customerId;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        const charges = await prisma.charge.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return charges;
    }
}