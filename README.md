# VISER X — Product CRUD Application

A simple Product/Category management application built as a practical assessment for **VISER X**.

- **Backend:** Laravel 12 REST API with JWT authentication.
- **Frontend:** React 19 + Vite single-page app that consumes the API.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup (Laravel)](#backend-setup-laravel)
- [Frontend Setup (React)](#frontend-setup-react)
- [Running the Project Locally](#running-the-project-locally)
- [API Endpoints](#api-endpoints)
- [Frontend Notes](#frontend-notes)
- [Deployment (Optional)](#deployment-optional)

---

## Tech Stack

### Backend (`/backend`)

| Library                               | Purpose                  |
| ------------------------------------- | ------------------------ |
| `laravel/framework` ^12.0             | PHP web framework        |
| `php-open-source-saver/jwt-auth` ^2.8 | JWT-based authentication |
| `laravel/tinker`                      | REPL for the application |
| MySQL                                 | Relational database      |

### Frontend (`/frontend`)

| Library                                | Purpose                            |
| -------------------------------------- | ---------------------------------- |
| `react` / `react-dom` ^19              | UI library                         |
| `vite` ^8                              | Dev server and build tool          |
| `react-router-dom` ^7                  | Client-side routing                |
| `axios` ^1.18                          | HTTP client (with JWT interceptor) |
| `tailwindcss` ^4 + `@tailwindcss/vite` | Utility-first styling              |
| `lucide-react`                         | SVG icon set (menu / close icons)  |
| `typescript`                           | Static typing                      |

---

## Project Structure

```
viserx-task/
├── backend/        # Laravel 12 API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── ProductController.php
│   │   │       └── CategoryController.php
│   │   └── Models/
│   │       ├── Product.php
│   │       ├── Category.php
│   │       └── User.php
│   ├── database/
│   │   └── migrations/   # users, jobs, categories, products
│   └── routes/          # api.php
├── frontend/       # React + Vite SPA
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       │   └── public/   # Product, Login
│       └── lib/api.ts    # axios instance + JWT interceptor
└── README.md
```

---

## Prerequisites

- **PHP** 8.2+
- **MySQL** 5.7+ / 8.0+
- **Composer** 2.x
- **Node.js** 20.19+ (or 22.12+) and **npm**

---

## Backend Setup (Laravel)

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Create the environment file
cp .env.example .env

# 3. Generate the application key
php artisan key:generate

# 4. Generate the JWT secret
php artisan jwt:secret

# 5. Create a MySQL database, then set the DB_* values in .env (see below)

# 6. Run migrations
php artisan migrate
```

### Environment notes (`backend/.env`)

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=viserx_task
DB_USERNAME=root
DB_PASSWORD=mysql
```

The backend runs at **http://127.0.0.1:8000**.

---

## Frontend Setup (React)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The app runs at **http://localhost:5173**.

The axios instance in [`src/lib/api.ts`](frontend/src/lib/api.ts) targets `http://127.0.0.1:8000` and automatically attaches the JWT from `localStorage` (key: `viserXtoken`) as a `Bearer` token on every request.

---

## Running the Project Locally

Open two terminals — one for the backend, one for the frontend:

```bash
# Terminal 1 — backend
cd backend
php artisan serve   # http://127.0.0.1:8000

# Terminal 2 — frontend
cd frontend
npm run dev         # http://localhost:5173
```

---

## API Endpoints

Base URL: `http://127.0.0.1:8000/api`

These are the public read endpoints consumed by the frontend:

| Method | Endpoint           | Description                                                                                   |
| ------ | ------------------ | --------------------------------------------------------------------------------------------- |
| `GET`  | `/products`        | Paginated list of products (10 per page), each with its category. Supports the filters below. |
| `GET`  | `/products/{slug}` | A single product by slug, with its category.                                                  |
| `GET`  | `/categories`      | All categories (`id`, `name`, `slug`).                                                        |

### Product list filters (`GET /products`)

All filters are optional and combinable via query string:

| Query param   | Description                             |
| ------------- | --------------------------------------- |
| `name`        | Filter by product name (partial match). |
| `category_id` | Filter by category.                     |
| `min_price`   | Minimum price.                          |
| `max_price`   | Maximum price.                          |
| `page`        | Page number for pagination.             |

### Pagination

`GET /products` returns Laravel's standard paginated response — **10 products per page**. The JSON includes the items in `data`, plus `current_page`, `last_page`, `total`, and a `links` array (page numbers with `url` / `label` / `active`). Use `?page=N` to fetch a specific page; filters above can be combined with `page`.

### Authentication

JWT-based. `POST /login` returns a token; send it on protected routes as an `Authorization: Bearer <token>` header.

| Method | Endpoint  | Auth   | Description                                                              |
| ------ | --------- | ------ | ----------------------------------------------------------------------- |
| `POST` | `/login`  | —      | Body `{ email, password }`. Returns `{ token, user }` (`401` if invalid). |
| `POST` | `/logout` | Bearer | Invalidates the current token.                                          |
| `GET`  | `/me`     | Bearer | Returns the authenticated user.                                         |

### Dashboard

| Method | Endpoint | Auth   | Description                                                       |
| ------ | -------- | ------ | ---------------------------------------------------------------- |
| `GET`  | `/stats` | Bearer | Product and category counts — `{ products, categories }`.        |

### Category management

`GET /categories` (above) is public; the management actions below require a Bearer token. The `slug` is auto-generated from `name` (and regenerated on update), so it is never sent by the client.

| Method   | Endpoint           | Auth   | Description                                                          |
| -------- | ------------------ | ------ | ------------------------------------------------------------------- |
| `POST`   | `/categories`      | Bearer | Create a category. Body `{ name }` (required, unique).              |
| `GET`    | `/categories/{id}` | Bearer | A single category by id.                                            |
| `PUT`    | `/categories/{id}` | Bearer | Update a category. Body `{ name }`.                                 |
| `DELETE` | `/categories/{id}` | Bearer | Delete a category. **Cascades** — also deletes that category's products. |

---

## Frontend Notes

- **Loading states:** the product list and product details pages show a spinner while data is being fetched, so the UI never flashes an empty / "0 products" / "not found" state before the API responds.

---

## Deployment (Optional)

- **Backend:** any PHP 8.2+ host (Render, Railway, a VPS, Laravel Forge). Set the `.env` and run `php artisan migrate --force`.
- **Frontend:** `npm run build` produces a static bundle in `frontend/dist/` deployable to Vercel, Netlify, or any static host. Point the axios `baseURL` at the deployed API URL.
