# Smart Restaurant Management System 🍽️

> **An end-to-end real-time restaurant management platform** built with modern web technologies and AI-driven workflows.

---

## 🌟 Overview

Smart Restaurant is a comprehensive full-stack application designed to digitalize and streamline restaurant operations. It serves 4 distinct user roles with real-time synchronization, ensuring a seamless experience from ordering to payment.

### Key Roles & Features
- **🧑‍🍳 Customer**: Scan QR code to join a table session, browse the interactive menu, place orders, track live order status, and pay securely via Stripe.
- **🤵 Waiter**: Receive real-time notifications for new orders and bill requests, manage table assignments, and serve customers efficiently.
- **🍳 Kitchen**: View incoming orders in real-time, update preparation statuses, and instantly notify waiters when food is ready.
- **👑 Admin**: Comprehensive dashboard for managing menus, tables, staff accounts, monitoring live orders, and viewing revenue analytics.

---

## 💻 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (Relational Data), Redis (Caching & Sessions).
- **Real-Time**: Socket.IO for live state synchronization across all clients.
- **Payments**: Stripe API for secure automated checkout.
- **DevOps/Cloud**: Docker, Docker Compose, GitHub Actions (CI/CD), Snyk (Security).
- **AI Tooling**: Developed using AI-native workflows for rapid scaffolding, automated testing, refactoring, and debugging.

---

## 🚀 System Architecture

```text
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   FE (React)    │────▶│   BE (Express)   │────▶│  PostgreSQL DB  │
│  Ports: 5173    │     │  Port: 3030      │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        ↑                       │                         │
        │    Socket.IO          │                         ▼
        └───────────────────────┤                 ┌───────────────┐
                                │                 │     Redis     │
                                └────────────────▶│   (Caching)   │
                                                  └───────────────┘
```

---

## 🛠️ CI/CD & Engineering Practices

This project strictly follows modern engineering standards:
- **Automated Workflows**: GitHub Actions pipeline configured for continuous integration.
- **Quality Gates**: Automated linting (`eslint`) and testing run on every PR.
- **Security**: Snyk container and dependency scanning integrated into the CI pipeline.
- **Spec-Driven**: Features are developed following clear specifications, ensuring maintainable and scalable code.

---

## ⚙️ Quick Start

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose
- PostgreSQL & Redis (or run via Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chubedan4605/SMART_RESTAURANT_CBD.git
   cd SMART_RESTAURANT_CBD
   ```

2. **Start Infrastructure (DB & Redis)**
   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies**
   ```bash
   # Frontend
   cd apps/fe && npm install
   
   # Backend
   cd ../be && npm install
   ```

4. **Environment Variables**
   - Create `.env` in `apps/be` based on `.env.example`.
   - Ensure `DATABASE_URL` and Stripe keys are configured.

5. **Run the Application**
   ```bash
   # Run backend
   cd apps/be && npm run dev
   
   # Run frontend
   cd apps/fe && npm run dev
   ```

---
*Developed with ❤️ and a focus on clean, scalable architecture.*
