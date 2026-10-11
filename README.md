# 🍽️ Lumière Bistro — Smart Restaurant Management System

> **Smart Restaurant Management System** — A modern, production-ready Full-Stack Monorepo web platform designed to streamline end-to-end restaurant operations: in-table dynamic QR ordering, real-time Kitchen Display System (KDS) & Waiter synchronization, Redis-backed stock & session management, multi-channel digital payments, and actionable business intelligence.

[![Monorepo](https://img.shields.io/badge/Monorepo-pnpm%20workspaces-f69220?logo=pnpm)](https://pnpm.io/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Tailwind%20v4-61dafb?logo=react)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%205-339933?logo=node.js)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Redis-336791?logo=postgresql)](https://www.postgresql.org/)
[![Realtime](https://img.shields.io/badge/Realtime-Socket.io-010101?logo=socketdotio)](https://socket.io/)
[![Payment](https://img.shields.io/badge/Payment-Stripe%20%2B%20VietQR-635bff?logo=stripe)](https://stripe.com/)

---

## 🌟 Project Overview

**Lumière Bistro** eliminates conventional paper-based and disjointed dining workflows by providing a cohesive digital experience:
- **Diners** scan a dynamic QR code on their table to browse rich digital menus, customize dishes with modifiers, place orders, and follow real-time cooking progress straight from their mobile browser without installing any app.
- **Waitstaff (Waiter Console)** monitor table orders in real time, approve or reject items with automated stock restoration, handle call-waiter requests, apply promo discounts, and print invoices.
- **Kitchen Staff (Kitchen Display System - KDS)** interact with a purpose-built touch display that prioritizes pending tickets, tracks cooking timers, flags overdue orders with urgent alerts, and sounds audible chimes.
- **Restaurant Managers (Admin Backoffice)** oversee live revenue metrics, item-level stock inventories, menu customization, table layouts, staff roles, and promotional campaigns.

---

## 🚀 Key Features

### 1. 📱 Customer Experience
- **In-Table Dynamic QR Pairing**: Scan table QR codes (`/scan-qr` or tokenized URLs) to automatically bind table sessions without manual entry.
- **Interactive Digital Menu**: Instant client-side fuzzy search powered by Fuse.js, category filtering (Appetizers, Mains, Desserts, Beverages), and dietary flags.
- **Item Customization (Modifiers)**: Flexible options (Portion size, toppings, sweetness levels, custom chef notes).
- **Live Order Status Tracking**: Real-time push updates through WebSockets (*Queued → Preparing → Ready → Completed*).
- **Internationalization & Premium Aesthetics**: Full Vietnamese & English bilingual support via `react-i18next`, with adaptive **Light & Dark Themes**.
- **Multi-Channel Payments**:
  - Cash upon counter checkout.
  - Automated **VietQR** bank transfer generation (dynamic payload encoding exact balance & order code).
  - International cards through **Stripe** (Stripe Elements & Stripe QR Code).
- **Online Table Booking & Loyalty Points**: Visual table selection map and customer loyalty points reward program upon order completion.

### 2. 🛎️ Waiter Console (`/waiter`)
- **Real-Time Order Stream**: Instant audio-visual notifications upon customer order placements.
- **Item & Order Review**: Approve orders to dispatch to the kitchen, or reject individual items with out-of-stock feedback (automatically restoring PostgreSQL & Redis inventory counts).
- **Table Session Tracking**: Real-time monitoring of table statuses (*Serving, Pending Approval, Bill Requested, Available*).
- **Billing & PDF Invoices**: Coupon code validation, automated VAT calculation, manual discount adjustments, and instant PDF invoice downloads via `jspdf`.

### 3. 👨‍🍳 Kitchen Console (`/kitchen`)
- **Kitchen Display System (KDS)**: High-contrast layout tailored for kitchen screens and tablets.
- **Smart Order Timers (`OrderTimer`)**: Real-time countdowns tracking item preparation times, triggering **Urgent Overdue Alerts** when exceeding thresholds.
- **Stage Progress Updates**: Mark individual items as `preparing` or `ready`, alerting waitstaff for prompt service.
- **Sound Alerts**: Audible notifications triggered on new incoming kitchen tickets.

### 4. 📊 Admin Backoffice (`/admin`)
- **Analytics Dashboard**: Interactive revenue trends, order volume graphs, and best-selling item analytics visualized with Recharts.
- **Menu & Modifier Management**: Complete CRUD operations for categories, menu items, and modifier groups with direct Cloudinary media uploads.
- **Real-Time Stock Inventory (`track_inventory`)**:
  - Configure stock quantities, low-stock warning thresholds, and inventory toggles.
  - Automated deductions upon customer order placement and automated restoration on order rejection/cancellation.
  - Sub-millisecond validation backed by Redis caching.
- **Table Layout & Dynamic QR Generation**: Manage floor maps and export printable dynamic QR codes for each table.
- **Role-Based Access Control (RBAC)**: Manage user accounts and permission boundaries (Admin, Waiter, Kitchen, Customer).
- **Discounts & Coupons**: Percentage-based and fixed-amount promotional vouchers.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (apps/fe)                          │
│     Customer Web App   │    Waiter Console    │    Kitchen KDS / Admin │
│       (Port 5173)      │       (/waiter)      │     (/kitchen, /admin) │
└───────────────────▲────────────────────────────────────▲───────────────┘
                    │                                    │
                    │ REST API                           │ WebSocket (Socket.io)
                    │ (Axios)                            │ Bi-directional
                    ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API SERVER (apps/be)                            │
│                       Node.js + Express 5.x                            │
│  Controllers │ Services │ Repositories │ Middlewares (JWT, Auth, RBAC) │
└───────────┬───────────────────┬─────────────────────────┬──────────────┘
            │                   │                         │
            ▼                   ▼                         ▼
┌───────────────────────┐ ┌───────────┐ ┌────────────────────────────────┐
│      PostgreSQL       │ │   Redis   │ │       EXTERNAL SERVICES        │
│    (Port 5432)        │ │(Port 6379)│ │ • Stripe (Online payments)     │
│ Prisma ORM & Knex.js  │ │Cache & QRs│ │ • Cloudinary (Media assets)    │
│ Core tables, orders,  │ │Stock cache│ │ • Resend / SMTP (Email alerts) │
│ users, menu, bills    │ │Sessions   │ │ • VietQR API (MBBank QR code)  │
└───────────────────────┘ └───────────┘ └────────────────────────────────┘
```

---

## 📁 Monorepo Workspace Structure

```
Final-Project-Smart-Restaurant/
├── apps/
│   ├── fe/                          # React 19 Frontend (Vite, Tailwind v4, Redux Toolkit)
│   │   ├── src/
│   │   │   ├── Components/          # Shared components: Navbar, OrderCard, BillModal, Input...
│   │   │   ├── features/
│   │   │   │   ├── Admin/           # Dashboard, Menu, Inventory, Accounts Management
│   │   │   │   ├── Auth/            # SignIn, SignUp, Forgot, ResetPassword, VerifyEmail
│   │   │   │   ├── Customer/        # Digital Menu, Cart, OrderTracking, Booking, ScanQR
│   │   │   │   ├── Kitchen/         # Kitchen Console KDS
│   │   │   │   └── Waiter/          # Waiter Order & Table Management
│   │   │   ├── context/             # ThemeContext (Light & Dark mode state)
│   │   │   ├── services/            # Axios API instances & service modules
│   │   │   └── store/               # Redux Toolkit Slices (auth, cart, orders)
│   │   └── package.json
│   │
│   └── be/                          # Express 5 Backend API Server
│       ├── src/
│       │   ├── config/              # Database, Redis, Cloudinary, Stripe, Mailer configs
│       │   ├── controllers/         # Request handling & HTTP response mapping
│       │   ├── database/            # Knex connection & Migration scripts
│       │   ├── middlewares/         # JWT auth, RBAC guards, validations, rate limiting
│       │   ├── repositories/        # Database access layer (Knex & Prisma)
│       │   ├── routes/              # Backoffice & Public route definitions
│       │   ├── services/            # Core business logic (Order, Inventory, Billing)
│       │   └── socket/              # Socket.io Room & Event dispatchers
│       ├── prisma/                  # Prisma schema & Database seeders
│       └── package.json
│
├── docker-compose.yml               # Local services: PostgreSQL 17, Redis 7, RedisInsight
├── package.json                     # Monorepo root scripts (pnpm)
├── pnpm-workspace.yaml              # Workspace package mapping (apps/fe, apps/be)
└── README.md
```

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Monorepo Manager** | [pnpm](https://pnpm.io/) Workspaces |
| **Frontend Framework** | [React 19](https://react.dev/), [Vite 6](https://vitejs.dev/) |
| **Styling & Icons** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), Font Awesome |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) |
| **Internationalization** | [i18next](https://www.i18next.com/), [react-i18next](https://react.i18next.com/) |
| **Backend Runtime** | [Node.js](https://nodejs.org/) (>= 18), [Express 5](https://expressjs.com/) |
| **Database** | [PostgreSQL 17](https://www.postgresql.org/) ([Prisma Client](https://www.prisma.io/) & [Knex.js](https://knexjs.org/)) |
| **Caching & In-Memory**| [Redis 7](https://redis.io/) (Stock validation & Table session store) |
| **Realtime WebSockets**| [Socket.IO 4](https://socket.io/) (Room-based event dispatching) |
| **Payment Gateways** | [Stripe API](https://stripe.com/), [VietQR](https://vietqr.net/) dynamic generator |
| **Cloud Media** | [Cloudinary](https://cloudinary.com/) (Menu item & Avatar image hosting) |
| **Email Service** | [Resend](https://resend.com/) & Nodemailer (SMTP Gmail fallback) |
| **Testing & Quality** | [Jest](https://jestjs.io/), [Vitest](https://vitest.dev/), ESLint |
| **DevOps / Infra** | Docker, Docker Compose, AWS EC2, AWS S3/CloudFront, GitHub Actions |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.x or v20.x+
- **pnpm**: v9.x+ (`npm install -g pnpm`)
- **Docker & Docker Compose**: For local PostgreSQL and Redis containers

### 2. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/chubedan4605/SMART_RESTAURANT_CBD.git
cd SMART_RESTAURANT_CBD

# Install dependencies across all monorepo packages
pnpm install
```

### 3. Start Database & Redis (Docker)
Launch PostgreSQL (port `5432`), Redis (port `6379`), and RedisInsight (port `5540`):
```bash
docker compose up -d
```

### 4. Configure Environment Variables

#### Backend (`apps/be/.env`):
Create `apps/be/.env` based on the template below:
```env
PORT=3030
DATABASE_URL=postgresql://postgres:password@localhost:5432/smart_restaurant
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=true

# Security & Secrets
JWT_SECRET=your_jwt_secret_key_here
QR_SECRET=your_qr_secret_key_here

# Stripe Integration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Transactional Emails
RESEND_API_KEY=re_...
MAIL_FROM="Lumière Bistro <onboarding@resend.dev>"

# CORS Allowed Origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (`apps/fe/.env`):
Create `apps/fe/.env`:
```env
VITE_APP_BASE_URL=http://localhost:3030
VITE_FRONTEND_BASE_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# VietQR MBBank Configuration
VITE_BANK_ID=MB
VITE_ACCOUNT_NO=21230907843010
VITE_ACCOUNT_NAME=NHA HANG SMART
VITE_TEMPLATE=compact
```

### 5. Database Initialization & Seeding
```bash
# Navigate to backend
cd apps/be

# Generate Prisma Client
pnpm prisma generate

# Seed sample data (dishes, categories, admin accounts)
pnpm seed

# Run inventory migrations
pnpm migrate:inventory
cd ../..
```

### 6. Run Development Servers

From the root repository directory, run:

```bash
# Run both Frontend & Backend concurrently:
pnpm dev

# Or launch services individually:
pnpm dev:be   # Backend API:  http://localhost:3030
pnpm dev:fe   # Frontend App: http://localhost:5173
```

- **Customer Web App**: `http://localhost:5173`
- **Kitchen Console**: `http://localhost:5173/kitchen`
- **Waiter Console**: `http://localhost:5173/waiter`
- **Admin Dashboard**: `http://localhost:5173/admin`
- **RedisInsight UI**: `http://localhost:5540`

---

## 🧪 Quality Gates & Automated Testing

This repository enforces strict Quality Gate verification before committing or deploying changes:

```bash
# Frontend Quality Gate (ESLint + Vitest unit test suite):
pnpm quality:fe

# Backend Quality Gate (Jest unit tests + ESLint):
pnpm quality:be
```

---

## 📡 Real-Time Socket.IO Event Reference

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `order:created` | Customer → Server → Waiter | Emitted when a customer places an order at a table |
| `order:accepted` | Waiter → Server → Kitchen/Customer | Waiter accepts an order, dispatching tickets to the kitchen |
| `item:status_update` | Kitchen → Server → Waiter/Customer | Kitchen updates dish status to `preparing` or `ready` |
| `table:call_waiter` | Customer → Server → Waiter | Table bell calling waitstaff for assistance |
| `table:request_bill`| Customer → Server → Waiter | Table requests physical or digital checkout |
| `inventory:updated` | Admin/Server → Frontend | Broadcasts real-time stock balance changes across clients |

---

## 👥 Demo Credentials

| Role | Email | Password | Dedicated View |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lumiere.com` | `Admin@123` | `/admin` |
| **Waiter** | `waiter@lumiere.com` | `Waiter@123` | `/waiter` |
| **Kitchen** | `kitchen@lumiere.com` | `Kitchen@123` | `/kitchen` |
| **Customer** | `customer@lumiere.com` | `Customer@123` | `/` |

---

## 📄 License
This project is licensed under the [MIT License](LICENSE). Built for academic and production research in smart restaurant automation.
