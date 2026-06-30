# VISER X — Product CRUD Application

A simple Product/Category management application built as a practical assessment for **VISER X**.

- **Backend:** Laravel 12 REST API with JWT authentication.
- **Frontend:** React 19 + Vite single-page app that consumes the API.

**Live demo:** <https://viserx.rifatxtra.com/>

**Admin login** (seeded by `php artisan db:seed`):

| Email               | Password   |
| ------------------- | ---------- |
| `admin@example.com` | `password` |

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Backend Setup (Laravel)](#backend-setup-laravel)
- [Frontend Setup (React)](#frontend-setup-react)
- [Running the Project Locally](#running-the-project-locally)
- [API Endpoints](#api-endpoints)
- [Queue & Email (Job)](#queue--email-job)
- [Caching](#caching)
- [CORS](#cors)
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

# 7. Seed the admin user (admin@example.com / password)
php artisan db:seed

# 8. Link the public storage disk (so uploaded product images are web-accessible)
php artisan storage:link
```

### Environment notes (`backend/.env`)

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=viserx_task
DB_USERNAME=root
DB_PASSWORD=mysql

# Queue + mail (used by the product create/update email job)
QUEUE_CONNECTION=database
MAIL_MAILER=log
ADMIN_EMAIL=admin@example.com
```

`ADMIN_EMAIL` is the recipient of the product create/update notification email (see [Queue & Email](#queue--email-job)). With `MAIL_MAILER=log` no SMTP is needed — the email is written to `storage/logs/laravel.log`.

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

# Terminal 2 — queue worker (processes the product create/update email job)
cd backend
php artisan queue:work

# Terminal 3 — frontend
cd frontend
npm run dev         # http://localhost:5173
```

---

## API Endpoints

Base URL: `http://127.0.0.1:8000/api`

These are the public read endpoints consumed by the frontend:

| Method | Endpoint           | Description                                                                                                 |
| ------ | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `GET`  | `/products`        | Paginated list of products (9 per page), each with its category. Supports the filters below.                |
| `GET`  | `/products/{slug}` | A single product by slug, with its category.                                                                |
| `GET`  | `/categories`      | All categories (`id`, `name`, `slug`) as a flat array. Add `?page=N` for a paginated response (9 per page). |

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

`GET /products` returns Laravel's standard paginated response — **9 products per page**. The JSON includes the items in `data`, plus `current_page`, `last_page`, `total`, and a `links` array (page numbers with `url` / `label` / `active`). Use `?page=N` to fetch a specific page; filters above can be combined with `page`.

`GET /categories` is **conditionally** paginated: without a `page` param it returns a flat array (used by the product filter dropdown and the create/edit category selects, which need every category), and with `?page=N` it returns the same paginated shape as products (9 per page) for the admin category list.

### Authentication

JWT-based. `POST /login` returns a token; send it on protected routes as an `Authorization: Bearer <token>` header.

| Method | Endpoint  | Auth   | Description                                                               |
| ------ | --------- | ------ | ------------------------------------------------------------------------- |
| `POST` | `/login`  | —      | Body `{ email, password }`. Returns `{ token, user }` (`401` if invalid). |
| `POST` | `/logout` | Bearer | Invalidates the current token.                                            |
| `GET`  | `/me`     | Bearer | Returns the authenticated user.                                           |

### Dashboard

| Method | Endpoint | Auth   | Description                                               |
| ------ | -------- | ------ | --------------------------------------------------------- |
| `GET`  | `/stats` | Bearer | Product and category counts — `{ products, categories }`. |

### Settings

The recipient of the product create/update email (see [Queue & Email](#queue--email-job)). Backs the admin **Settings** page.

| Method | Endpoint    | Auth   | Description                                                                                              |
| ------ | ----------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `GET`  | `/settings` | Bearer | Returns `{ admin_email, default_admin_email }` — the saved recipient (or `null`) and the env fallback.  |
| `PUT`  | `/settings` | Bearer | Body `{ admin_email }` (nullable email). Saves the recipient; send `null`/empty to fall back to the env. |

### Category management

`GET /categories` (above) is public; the management actions below require a Bearer token. The `slug` is auto-generated from `name` (and regenerated on update), so it is never sent by the client.

| Method   | Endpoint           | Auth   | Description                                                              |
| -------- | ------------------ | ------ | ------------------------------------------------------------------------ |
| `POST`   | `/categories`      | Bearer | Create a category. Body `{ name }` (required, unique).                   |
| `GET`    | `/categories/{id}` | Bearer | A single category by id.                                                 |
| `PUT`    | `/categories/{id}` | Bearer | Update a category. Body `{ name }`.                                      |
| `DELETE` | `/categories/{id}` | Bearer | Delete a category. **Cascades** — also deletes that category's products. |

### Product management

`GET /products` and `GET /products/{slug}` (above) are public; the management actions below require a Bearer token. The `slug` is auto-generated from `name` (and regenerated on update), so it is never sent by the client. Requests are sent as `multipart/form-data` to support file uploads.

| Method   | Endpoint              | Auth   | Description                                                                                   |
| -------- | --------------------- | ------ | --------------------------------------------------------------------------------------------- |
| `POST`   | `/products`           | Bearer | Create a product. Body `{ name, category_id, price, description?, image_url? \| image? }`.    |
| `GET`    | `/products/{id}/edit` | Bearer | A single product by id (used to populate the edit form).                                      |
| `PUT`    | `/products/{id}`      | Bearer | Update a product. Same body as create. With a file upload, send as `POST` with `_method=PUT`. |
| `DELETE` | `/products/{id}`      | Bearer | Delete a product.                                                                             |

**Image — URL or upload:** each product needs an image, provided one of two ways. Send `image_url` for a direct link, **or** send an `image` file. Uploaded files are stored on the `public` disk under `storage/app/public/products`, and a full URL (`APP_URL/storage/products/...`) is generated and saved to `image_url`. Run `php artisan storage:link` once so uploaded files are web-accessible.

### Request / response examples

**Login** — `POST /api/login`

```json
// request
{ "email": "admin@example.com", "password": "password" }

// 200 response
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": { "id": 1, "name": "admin", "email": "admin@example.com" }
}

// 401 response
{ "message": "Invalid credentials" }
```

**List products** — `GET /api/products`

```json
// 200 response (Laravel paginator, trimmed)
{
  "current_page": 1,
  "data": [
    {
      "id": 9,
      "name": "JOYROOM JR-OE3 Clip On Earbuds",
      "slug": "joyroom-jr-oe3-clip-on-earbuds",
      "price": "1200.00",
      "image_url": "http://127.0.0.1:8000/storage/products/abc.jpg",
      "category_id": 2,
      "category": { "id": 2, "name": "Earbuds", "slug": "earbuds" }
    }
  ],
  "last_page": 1,
  "total": 9
}
```

**Single product** — `GET /api/products/{slug}`

```json
// 200 response
{
  "id": 9,
  "name": "JOYROOM JR-OE3 Clip On Earbuds",
  "slug": "joyroom-jr-oe3-clip-on-earbuds",
  "description": "<p>Open-ear clip design.</p>",
  "price": "1200.00",
  "category_id": 2,
  "image_url": "http://127.0.0.1:8000/storage/products/abc.jpg",
  "category": { "id": 2, "name": "Earbuds", "slug": "earbuds" }
}
```

**Create product** — `POST /api/products` (Bearer, `multipart/form-data`)

```json
// request fields: name, category_id, price, description?, image_url? | image?

// 201 response
{
  "name": "Wireless Mouse",
  "slug": "wireless-mouse",
  "description": "<p>Silent click.</p>",
  "price": "999.00",
  "category_id": 3,
  "image_url": "https://example.com/mouse.jpg",
  "id": 10
}

// 422 response (validation)
{
  "message": "The name has already been taken.",
  "errors": { "name": ["The name has already been taken."] }
}
```

> Creating or updating a product also dispatches the [email job](#queue--email-job).

**Create category** — `POST /api/categories` (Bearer)

```json
// request
{ "name": "Earbuds" }

// 201 response
{ "name": "Earbuds", "slug": "earbuds", "id": 2 }
```

---

## Queue & Email (Job)

On **product create and update**, the controller dispatches a queued job that emails an admin notification — satisfying the "Job/Queue to send email on product create/update" requirement.

- **Job:** [`app/Jobs/SendProductSavedEmail.php`](backend/app/Jobs/SendProductSavedEmail.php) implements `ShouldQueue`, so it is pushed onto the queue instead of running inline. Dispatched from `ProductController@store` (action `created`) and `ProductController@update` (action `updated`).
- **Mailable:** [`app/Mail/ProductSaved.php`](backend/app/Mail/ProductSaved.php) renders [`resources/views/emails/product-saved.blade.php`](backend/resources/views/emails/product-saved.blade.php) with the product name, price, and category.
- **Recipient:** the `admin_email` saved from the admin **Settings** page (`GET` / `PUT /api/settings`), stored in the `settings` table. When it is unset, the job falls back to the `ADMIN_EMAIL` env var (`config('mail.admin_address')`). So the address is configurable from the UI without a redeploy, with a sensible env default out of the box.

| Setting            | Value               | Meaning                                                                |
| ------------------ | ------------------- | ---------------------------------------------------------------------- |
| `QUEUE_CONNECTION` | `database`          | Jobs are stored in the `jobs` table; a worker processes them.          |
| `MAIL_MAILER`      | `log`               | Email is written to `storage/logs/laravel.log` (no SMTP needed).       |
| `ADMIN_EMAIL`      | `admin@example.com` | **Default** recipient, used when no `admin_email` is saved in Settings. |

Run a worker to process queued jobs:

```bash
php artisan queue:work
```

Then create or update a product and check `storage/logs/laravel.log` for the rendered email. For real delivery, set `MAIL_MAILER=smtp` and the `MAIL_*` credentials in `.env`.

---

## Caching

Cache store: **database** (`CACHE_STORE=database`). The database driver does not support cache tags, so every read is cached under an explicit key and invalidation targets those keys directly.

### What's cached

Each public/read endpoint is wrapped in `Cache::remember(key, 3600, …)`:

| Key                    | Holds                             | Endpoint                                  |
| ---------------------- | --------------------------------- | ----------------------------------------- |
| `products.index`       | unfiltered first page of products | `GET /products` (no filters / no `?page`) |
| `products.show.{slug}` | a single product + its category   | `GET /products/{slug}`                    |
| `categories.index`     | flat category list                | `GET /categories` (no `?page`)            |
| `stats`                | dashboard product/category counts | `GET /stats`                              |

Requests that **can't** map to a single stable key run live (uncached): filtered or paginated `GET /products`, the paginated `GET /categories?page=N` admin branch, and the auth-only edit/show-by-id form-prefill reads (which must always reflect the latest write).

### Invalidation

Eloquent model observers `forget` the affected keys on every write, so the next read rebuilds from fresh data:

- **`ProductObserver`** — on `created` / `updated` / `deleted`, forgets `products.index` and `stats`, plus that product's `products.show.{slug}`. On a rename the slug changes, so the **old** slug key is forgotten too.
- **`CategoryObserver`** — on `created` / `updated` / `deleted`, forgets `categories.index`, `products.index`, and `stats`. It also forgets the `products.show.{slug}` of every product in the category (a product's cache embeds its category name). Because deleting a category **cascades** to its products at the database level — which does _not_ fire `ProductObserver` — those product detail keys are cleared in the `deleting` hook, while the products still exist.

| Key                    | Cleared by                                                                     |
| ---------------------- | ------------------------------------------------------------------------------ |
| `products.index`       | product writes, category writes                                                |
| `products.show.{slug}` | that product's writes (incl. old slug on rename), its category's writes/delete |
| `categories.index`     | category writes                                                                |
| `stats`                | product writes, category writes                                                |

The 1-hour TTL is only a safety net — under normal operation a write clears the key immediately, so reads are never stale.

---

## CORS

The frontend (`https://viserx.rifatxtra.com`) and the API (`https://viserxapi.rifatxtra.com`) are on different origins, so the API enables CORS via Laravel's `HandleCors` middleware, configured in [`backend/config/cors.php`](backend/config/cors.php):

```php
<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
```

`allowed_origins` is `*` because the API is stateless and authenticates with a JWT in the `Authorization` header (not cookies), so credentialed CORS isn't needed. To lock it down for production, replace `['*']` with `['https://viserx.rifatxtra.com']`.

---

## Frontend Notes

- **Loading states:** the product list and product details pages show a spinner while data is being fetched, so the UI never flashes an empty / "0 products" / "not found" state before the API responds.

---

## Deployment (Optional)

- **Backend:** any PHP 8.2+ host (Render, Railway, a VPS, Laravel Forge). Set the `.env` and run `php artisan migrate --force`.
- **Frontend:** `npm run build` produces a static bundle in `frontend/dist/` deployable to Vercel, Netlify, or any static host. Point the axios `baseURL` at the deployed API URL.
