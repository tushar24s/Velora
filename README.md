# Velora

Velora is a premium full-stack luxury eCommerce project built for a portfolio setting. It combines a MERN backend with a polished React storefront, dense editorial layout, motion-driven interactions, admin tools, and a seeded luxury catalog designed around INR pricing.

The goal of the project is not just to demonstrate CRUD operations. It is built to feel like a modern retail product: cinematic homepage layout, polished transitions, realistic cart and checkout flows, protected admin tooling, and a frontend that stays usable even when the backend is unavailable.

Live Project - https://veloraec.vercel.app/

## Table of Contents

- [Project Overview](#project-overview)
- [Why This Stack Was Used](#why-this-stack-was-used)
- [Tech Stack](#tech-stack)
- [Core Product Features](#core-product-features)
- [Design and UX System](#design-and-ux-system)
- [Architecture Overview](#architecture-overview)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Authentication, Cart, and Order Flow](#authentication-cart-and-order-flow)
- [API Overview](#api-overview)
- [Data Model Summary](#data-model-summary)
- [Seed Data and Default Admin](#seed-data-and-default-admin)
- [Environment Variables](#environment-variables)
- [Local Development Setup](#local-development-setup)
- [Available Scripts](#available-scripts)
- [Build Notes](#build-notes)
- [Known Tradeoffs and Future Improvements](#known-tradeoffs-and-future-improvements)

## Project Overview

Velora is a dark-first luxury storefront focused on:

- premium visual design
- tight layout balance
- smooth product browsing
- JWT-based authentication
- guest cart to account cart sync
- order placement and history
- protected admin product and order management

The storefront is built around a curated luxury catalog rather than generic electronics or demo placeholders. Categories currently center on:

- Luxury Watches
- Men's Clothing
- Women's Clothing
- Shoes
- Luxury Bags
- Accessories

The homepage is intentionally designed like a premium brand landing experience instead of a marketplace dashboard.

## Why This Stack Was Used

This project uses the MERN stack because it balances developer speed, flexibility, and portfolio credibility very well.

### React

React is used for the frontend because:

- component composition makes it easy to build reusable UI pieces like product cards, drawers, modals, filters, and admin forms
- route-based page structure works well for storefront, product, cart, checkout, and admin views
- it pairs cleanly with animation libraries like Framer Motion and GSAP

### Vite

Vite is used for the React build system because:

- it gives fast local startup
- it keeps iteration smooth while adjusting UI and motion-heavy components
- it keeps the client build setup lightweight

### Tailwind CSS

Tailwind is used because:

- the project relies heavily on precise spacing, surface styling, and visual consistency
- design tokens and utility composition make it easier to keep the luxury UI coherent
- it speeds up iterative polishing of spacing, radii, shadows, and responsive behavior

### Framer Motion

Framer Motion is used because:

- the product card interactions, route transitions, modal motion, and shared layout animations need a React-friendly animation model
- it is well suited to micro-interactions such as hover lift, quick view transitions, and product-to-detail transitions

### GSAP + ScrollTrigger

GSAP is used because:

- it handles cinematic scroll reveals and layered hero motion more elegantly than basic CSS-only approaches
- it adds a more premium storytelling feel to homepage and shop sections

### Axios

Axios is used because:

- the client needs a centralized API layer
- auth tokens are injected through a request interceptor
- it keeps backend communication consistent across auth, products, cart, orders, and admin actions

### Node.js + Express

Node and Express are used because:

- they provide a clean REST API surface for the store
- Express is small and flexible enough for auth, product, cart, order, and admin routes without adding unnecessary framework complexity

### MongoDB + Mongoose

MongoDB is used because:

- product and order shapes are naturally document-oriented
- Mongoose gives schema validation, relationships, and straightforward query patterns for reviews, carts, and order histories

### JWT Authentication

JWT is used because:

- it keeps authentication simple and stateless
- it fits well for a portfolio project where the frontend and backend are separate apps
- it allows protected routes for checkout, orders, and admin operations

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger
- Axios
- React Router DOM
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors
- morgan

### Tooling

- concurrently
- nodemon
- PostCSS
- Autoprefixer

## Core Product Features

### Storefront

- premium homepage with editorial hero layout
- responsive shop page with search, sort, and category filtering
- category landing page
- product details page with gallery, reviews, related products, and quantity selection
- quick view modal
- recently viewed products via localStorage
- theme toggle with dark/light mode support

### Product Interaction

- hover lift and image zoom on product cards
- shared motion between cards, quick view, and product detail page
- add-to-cart fly animation toward the navbar cart icon
- slide-in cart drawer
- toast notifications for user feedback

### Authentication

- user registration
- user login
- profile refresh/update
- protected checkout route
- protected order history route
- protected admin route
- wishlist toggling for signed-in users

### Cart and Checkout

- guest cart support using localStorage
- automatic sync from guest cart to server cart after login
- quantity update and remove actions
- order summary and shipping form
- checkout order creation from live cart state

### Orders

- authenticated user order history
- per-order detail retrieval
- server-side pricing logic
- admin order status updates

### Admin

- dashboard stats
- product creation
- product editing
- product deletion
- order management

### Resilience / Fallback Behavior

The frontend is intentionally resilient:

- if the API is unavailable, the app can fall back to a local curated product dataset
- image rendering is normalized through a shared image helper to avoid broken product cards
- recently viewed items are stored locally so homepage personalization still works without extra backend complexity

## Design and UX System

Velora is intentionally styled as a premium retail product rather than a generic dashboard.

### Design goals

- luxury neutral palette
- premium card surfaces
- rounded corners and soft shadows
- dense but breathable spacing
- motion that feels elegant instead of flashy

### Current UI patterns

- dark-first but theme-switchable
- glassmorphism surfaces where appropriate
- structured 2-column homepage hero
- marquee brand strip
- premium hover and reveal interactions

### Animation approach

Velora uses two animation layers:

- Framer Motion for React-native UI transitions and micro-interactions
- GSAP + ScrollTrigger for section reveals and cinematic scroll behavior

This split helps keep motion expressive without overloading one tool for every case.

## Architecture Overview

Velora is organized as a workspace monorepo:

```text
velora/
  client/   React frontend
  server/   Express + MongoDB backend
```

### High-level flow

1. The React client loads data from the Express API through Axios.
2. Axios injects the JWT token automatically when available.
3. Public routes read product and category data.
4. Protected routes handle profile, cart, orders, and admin operations.
5. On server startup, MongoDB is connected and the default catalog/admin account are seeded.

## Frontend Structure

```text
client/
  package.json
  .env.example
  src/
    animations/   Framer Motion variants and shared animation helpers
    components/   Reusable UI pieces such as cards, navbar, drawers, modals
    context/      Auth, cart, theme, toast, and cart-motion providers
    data/         Local fallback product and highlight data
    hooks/        Reusable hooks such as debounce and GSAP scene setup
    layouts/      Shared app layout shell
    pages/        Route-level pages
    utils/        API client, helpers, currency, and image logic
```

### Important frontend areas

- `src/App.jsx`
  Defines the route structure and wraps route transitions in `AnimatePresence`.

- `src/layouts/AppLayout.jsx`
  Shared shell for navbar, page background, footer, and global overlays.

- `src/context/AuthContext.jsx`
  Handles login, register, profile updates, logout, and wishlist actions.

- `src/context/CartContext.jsx`
  Manages guest cart, server cart, cart sync, quantity updates, and drawer state.

- `src/context/ThemeContext.jsx`
  Stores the active theme and updates the root class accordingly.

- `src/components/HeroSection.jsx`
  Homepage hero layout, hero carousel logic, marquee strip, and top product density.

- `src/data/fallbackProducts.js`
  Local curated catalog used when the backend is unavailable or empty.

- `src/utils/api.js`
  Shared Axios instance with JWT header injection from localStorage.

## Backend Structure

```text
server/
  package.json
  .env.example
  index.js
  config/
    db.js
  controllers/
    adminController.js
    authController.js
    cartController.js
    orderController.js
    productController.js
  data/
    products.js
    seedDefaults.js
  middleware/
    authMiddleware.js
    errorMiddleware.js
  models/
    Cart.js
    Order.js
    Product.js
    User.js
  routes/
    adminRoutes.js
    authRoutes.js
    cartRoutes.js
    orderRoutes.js
    productRoutes.js
  utils/
    asyncHandler.js
    generateToken.js
```

### Important backend areas

- `server/index.js`
  Creates the Express app, registers middleware, mounts routes, connects to MongoDB, and seeds defaults.

- `server/config/db.js`
  Connects to MongoDB using Mongoose.

- `server/data/products.js`
  Defines the default curated luxury catalog.

- `server/data/seedDefaults.js`
  Upserts the default products and creates the default admin account.

- `server/middleware/authMiddleware.js`
  Protects authenticated and admin-only routes using JWT.

- `server/controllers/orderController.js`
  Converts cart data into orders and calculates tax/shipping totals.

## Authentication, Cart, and Order Flow

### Authentication flow

1. User registers or logs in.
2. The backend returns a JWT-backed user payload.
3. The client stores the user in localStorage.
4. Axios reads the stored token and adds `Authorization: Bearer <token>` automatically.

### Guest cart flow

1. Guest users add items locally.
2. Cart state is stored under `velora-guest-cart`.
3. When the user logs in, the guest cart is synced to the backend automatically.

### Checkout flow

1. Checkout is protected by auth.
2. The server reads the authenticated cart.
3. The server validates stock.
4. Order pricing is computed on the server:
   - tax: 18%
   - shipping: free at `>= 4999`, otherwise `199`
5. Stock is decremented when the order is created.
6. The cart is cleared after successful order creation.

## API Overview

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/wishlist`

### Products

- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/products/categories`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/reviews`

### Cart

- `GET /api/cart`
- `POST /api/cart`
- `POST /api/cart/sync`
- `PUT /api/cart/:productId`
- `DELETE /api/cart/:productId`
- `DELETE /api/cart`

### Orders

- `GET /api/orders/mine`
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/orders/admin/all`
- `PUT /api/orders/:id/status`

### Admin

- `GET /api/admin/dashboard`

## Data Model Summary

### User

Stores:

- name
- email
- hashed password
- `isAdmin`
- wishlist
- address book

### Product

Stores:

- name
- slug
- brand
- price
- image / images
- description
- category
- rating
- reviews
- stock
- tags
- specifications
- featured flag
- popularity

### Cart

Stores:

- owning user
- cart items
- product reference
- quantity

### Order

Stores:

- user
- order items snapshot
- shipping address
- payment method
- item total
- tax
- shipping
- final total
- payment state
- delivery state
- order status

## Seed Data and Default Admin

On server startup:

- MongoDB is connected
- the default luxury catalog is upserted
- legacy product slugs from older versions are cleaned up
- the default admin account is created if it does not exist

### Default admin credentials

- Email: `admin@velora.store`
- Password: `Admin@123`

### Important note about the seed behavior

The seed process does not only insert when the database is empty. It performs an upsert by slug, which makes it easier to keep the demo catalog aligned with the current codebase.

## Environment Variables

### Client

Create `client/.env` from `client/.env.example`

```bash
VITE_API_URL=http://localhost:5000/api
```

Why it exists:

- lets the client point to the Express API
- makes it easy to swap between local and deployed backends

### Server

Create `server/.env` from `server/.env.example`

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/velora
JWT_SECRET=replace-this-with-a-secure-secret
```

Why they exist:

- `PORT` controls the API port
- `MONGO_URI` defines the MongoDB connection string
- `JWT_SECRET` signs and verifies auth tokens

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment files

Copy these examples:

- `client/.env.example` -> `client/.env`
- `server/.env.example` -> `server/.env`

### 3. Start MongoDB

Use a local MongoDB instance or a MongoDB connection string in `MONGO_URI`.

### 4. Run the project

```bash
npm run dev
```

This starts:

- frontend: `http://localhost:5173`
- backend: `http://localhost:5000`

### 5. Health check

You can confirm the backend is running:

```bash
http://localhost:5000/api/health
```

## Available Scripts

### Root

```bash
npm run dev
```

Runs client and server together with `concurrently`.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run start
```

Starts the backend in production mode.

### Client

```bash
npm run dev --workspace client
npm run build --workspace client
npm run preview --workspace client
```

### Server

```bash
npm run dev --workspace server
npm run start --workspace server
```

## Build Notes

The standard verification used during development is:

```bash
npm run build
```

At the moment, Vite reports a chunk-size warning for the frontend bundle. The app still builds successfully, but route-based code splitting would be a good next optimization.

## Known Tradeoffs and Future Improvements

This project is deliberately polished, but still a portfolio app, so a few decisions are intentionally pragmatic:

- payment is simulated through checkout state rather than a real payment gateway
- image handling relies on shared fallback and normalization logic because demo catalogs often contain unstable third-party media
- the frontend includes a local fallback catalog to keep the storefront usable during backend downtime

Good next improvements would be:

- Stripe or Razorpay integration
- server-side image upload/storage flow
- pagination or infinite scrolling for larger catalogs
- route-level code splitting for smaller production bundles
- analytics and admin reporting beyond the current dashboard stats

## Summary

Velora is a full-stack luxury eCommerce portfolio project that demonstrates:

- a real React storefront
- an Express + MongoDB API
- JWT auth
- cart and checkout state
- order creation and history
- admin controls
- polished UI motion and premium layout work

It is designed to feel like a real product, not just a CRUD exercise.
