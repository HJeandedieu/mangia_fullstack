# Mangia — Restaurant Management System API

A REST API backend for managing a restaurant's menu, orders, reservations, and tables. Built with Node.js, Express, Prisma, and PostgreSQL.

---

## Tech Stack

- **Runtime:** Node.js with tsx (TypeScript execution)
- **Framework:** Express
- **ORM:** Prisma 7 with pg adapter
- **Database:** PostgreSQL
- **Auth:** JWT + bcrypt
- **Env management:** dotenvx

---

## Prerequisites

- Node.js 18+
- PostgreSQL running locally (or a remote connection string)
- dotenvx installed globally: `npm install -g @dotenvx/dotenvx`

---

## Setup

**1. Clone the repo**
```bash
git clone https://github.com/HJeandedieu/mangia-backend.git
cd mangia-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create your env file**

Create a file named `.env.development.local` in the project root:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mangia"
JWT_SECRET="your_jwt_secret"
PORT=3000
JWT_EXPIRES_IN="7d"
```

Replace `USER` and `PASSWORD` with your PostgreSQL credentials.

**4. Create the database**

In psql:
```sql
CREATE DATABASE mangia;
```

**5. Run migrations**
```bash
npx prisma migrate dev
```

**6. Create your first admin user**

Register via the API (see endpoints below), then manually update the role in the database:
```sql
\c mangia
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

**7. Start the server**
```bash
npm run dev
```

You should see:
```
Mangia API running on localhost:3000
DB connected. Users: [...]
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (auto-restarts on file changes) |
| `npm start` | Start without nodemon |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Port the server listens on |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `7d`) |

---

## Data Models

| Model | Description |
|-------|-------------|
| `User` | Customers and admins. Role defaults to `CUSTOMER` |
| `Category` | Menu item categories |
| `MenuItem` | Items on the menu, linked to a category |
| `Order` | A customer's order, contains one or more order items |
| `OrderItem` | A single line in an order (menu item + quantity + unit price) |
| `Table` | A restaurant table with a number and capacity |
| `Reservation` | A customer's table reservation request |

---

## API Endpoints

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and receive a JWT |
| POST | `/auth/logout` | Auth | Logout |

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/categories` | Public | Get all categories |
| GET | `/categories/:id` | Public | Get a single category |
| POST | `/categories` | Public | Create a category |
| PUT | `/categories/:id` | Public | Update a category |
| DELETE | `/categories/:id` | Public | Delete a category |

### Menu Items
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/menu-items` | Public | Get all menu items |
| GET | `/menu-items/:id` | Public | Get a single menu item |
| POST | `/menu-items` | Public | Create a menu item |
| PUT | `/menu-items/:id` | Public | Update a menu item |
| DELETE | `/menu-items/:id` | Public | Delete a menu item |

### Tables
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/tables` | Public | Get all tables |
| GET | `/tables/:id` | Public | Get a single table |
| POST | `/tables` | Public | Create a table |
| PUT | `/tables/:id` | Public | Update a table |
| DELETE | `/tables/:id` | Public | Delete a table |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/orders` | Customer | Place an order |
| GET | `/orders/my` | Customer | Get own order history |
| GET | `/orders` | Admin | Get all orders |
| PATCH | `/orders/:id/status` | Admin | Update order status |

Valid order statuses: `PENDING` → `CONFIRMED` → `PREPARING` → `READY` → `COMPLETED` / `CANCELLED`

### Reservations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/reservations` | Customer | Submit a reservation |
| GET | `/reservations/my` | Customer | Get own reservation history |
| GET | `/reservations` | Admin | Get all reservations |
| PATCH | `/reservations/:id/status` | Admin | Approve or reject a reservation |

Valid reservation statuses: `PENDING` → `APPROVED` / `REJECTED` / `CANCELLED`

---

## Authentication

Protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are returned from `/auth/login` and `/auth/register`.

---

## Postman Collection

A full Postman collection covering all endpoints is included in the repo as `Mangia_RMS.postman_collection.json`. Import it and run the collection top to bottom — the login requests automatically save tokens to collection variables, and create requests save IDs for use in subsequent requests.