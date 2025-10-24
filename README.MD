### 1. Clone o repositório
```bash
git clone https://github.com/jeanjacintho/colmeia-api-payments
cd colmeia-api-payments
```

### 2. Instale as dependencias
```bash
npm install
```

### 3.Configure o .ENV
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/payment_system?schema=public"
PORT=3000
NODE_ENV=development
```

### 4. Rodar o docker-compose
```bash
docker-compose up -d
```

### 5. Executar as migrações do Prisma
```bash
npx prisma generate
npx prisma db push
```

### 6. Executar servidor
```bash
npm run dev
```

## Documentação da API
### Base URL
```bash
http://localhost:3000/api
```

### Health Check
```http
GET /health
```

### Endpoints de Clientes

#### Criar Cliente
```http
POST /api/customers
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "document": "12345678901",
  "phone": "11999999999"
}
```

#### Listar Clientes
```http
GET /api/customers?page=1&limit=10
```

#### Buscar Cliente por ID
```http
GET /api/customers/{id}
```

#### Atualizar Cliente
```http
PUT /api/customers/{id}
Content-Type: application/json

{
  "name": "João Silva Santos",
  "phone": "11888888888"
}
```

#### Remover Cliente
```http
DELETE /api/customers/{id}
```

### Endpoints de Cobranças

#### Criar Cobrança PIX
```http
POST /api/charges
Content-Type: application/json

{
  "amount": 100.50,
  "currency": "BRL",
  "paymentMethod": "PIX",
  "customerId": "ID_DO_CUSTOMER",
  "pixData": {
    "key": "joao@email.com"
  }
}
```

#### Criar Cobrança Cartão de Crédito
```http
POST /api/charges
Content-Type: application/json

{
  "amount": 500.00,
  "currency": "BRL",
  "paymentMethod": "CREDIT_CARD",
  "customerId": "ID_DO_CUSTOMER",
  "cardData": {
    "installments": 3,
    "cardNumber": "4111111111111111",
    "cardHolder": "JOÃO SILVA"
  }
}
```

#### Criar Cobrança Boleto
```http
POST /api/charges
Content-Type: application/json

{
  "amount": 250.00,
  "currency": "BRL",
  "paymentMethod": "BOLETO",
  "customerId": "ID_DO_CUSTOMER",
  "boletoData": {
    "dueDate": "2025-11-15",
    "instructions": "Pagamento até vencimento"
  }
}
```

#### Listar Cobranças
```http
GET /api/charges?page=1&limit=10&customerId={ID_DO_CUSTOMER}
```

#### Buscar Cobrança por ID
```http
GET /api/charges/{id}
```

#### Atualizar Status da Cobrança
```http
PUT /api/charges/status/{id}/
Content-Type: application/json

{
  "status": "PAID"
}
```

#### Listar Cobranças por Status
```http
GET /api/charges/status/PENDING
```

#### Listar Cobranças por Cliente
```http
GET /api/charges/customer/{customerId}
```

#### Filtrar Cobranças
```http
GET /api/charges/filter?customerId={customerId}&status={status}
```

**Exemplos de uso:**
- Buscar cobranças pagas de um cliente: `GET /api/charges/filter?customerId=123&status=PAID`
- Buscar todas as cobranças de um cliente: `GET /api/charges/filter?customerId=123`
- Buscar todas as cobranças pagas: `GET /api/charges/filter?status=PAID`

### Status das Cobranças
- `PENDING` - Pendente
- `PAID` - Pago
- `FAILED` - Falhado
- `EXPIRED` - Expirado
- `REFUNDED` - Reembolsado
- `CANCELLED` - Cancelado

### Métodos de Pagamento
- `PIX` - Pagamento instantâneo
- `CREDIT_CARD` - Cartão de crédito
- `BOLETO` - Boleto bancário