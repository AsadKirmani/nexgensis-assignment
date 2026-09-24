# Product Admin Dashboard

A responsive Product Admin Dashboard built as a frontend take-home assignment using Next.js, React, TypeScript, Tailwind CSS, Axios, and the DummyJSON API.

## Tech Stack

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* Axios
* DummyJSON API

## Getting Started

### Prerequisites

* Node.js installed
* npm installed

### Installation

```bash
git clone <your-github-repository-url>
cd nexgensis-assignment
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

## Login

The application uses the DummyJSON authentication API.

Test credentials:

```text
Username: emilys
Password: emilyspass
```

After successful login, the access token is stored in localStorage and automatically attached to API requests through the shared Axios instance.

## Features

### Authentication

* Login using DummyJSON authentication
* Protected Products page
* Access token stored locally
* Automatic Authorization header through Axios interceptor
* Logout functionality
* Redirect to login when unauthenticated

### Product Listing

* Desktop table layout
* Mobile card layout
* Product image
* Title
* Category
* Price
* Rating
* Stock

### Pagination

* Page numbers
* Previous / Next navigation
* Page sizes: 10, 20, and 50
* Displays the current product range
* Pagination state is stored in the URL

### Search

* Product search using DummyJSON search API
* 800ms debounce
* Search resets pagination to page 1
* Search state is stored in the URL

### Filtering and Sorting

* Category filtering
* Sort by:

  * Title
  * Price
  * Rating
* Ascending and descending order
* Filter and sort state is stored in the URL

### Search and Category Behavior

DummyJSON provides separate endpoints for product search and category filtering.

Because these endpoints cannot be combined directly in the same request, the application treats search and category filtering as mutually exclusive.

Selecting a category clears the current search query.

### Product Details

* Product image gallery
* Description
* Price
* Rating
* Stock
* Brand
* SKU
* Customer reviews
* Invalid product handling
* Edit and Delete actions

### Add Product

* Product creation form
* Required field validation
* Price and stock validation
* Duplicate submission prevention
* Newly created products are displayed immediately

### Edit Product

* Reusable product form
* Field validation
* Duplicate submission prevention
* Updated products are immediately reflected in the application

### Delete Product

* Delete confirmation modal
* Duplicate delete prevention
* Deleted products are removed from the application

## DummyJSON Persistence Limitation

DummyJSON is a mock API and does not permanently persist Add, Edit, or Delete operations.

To provide a usable dashboard experience, the application stores local product changes in `localStorage`.

The application maintains:

* Added products
* Updated products
* Deleted product IDs

This allows CRUD changes to remain visible after navigation and page refresh in the same browser.

Local products use IDs starting from `195` to avoid conflicting with the existing DummyJSON product IDs.

## Race Condition Handling

Product searches use a request ID mechanism.

Each new request receives a unique request ID. When a response arrives, it is only applied if it belongs to the latest request.

This prevents an older, slower request from overwriting the results of a newer search.

The search input also uses an 800ms debounce to reduce unnecessary API requests.

## URL State

The following product-list state is stored in the URL:

* Page
* Page size
* Search
* Category
* Sort field
* Sort order

Example:

```text
/products?page=1&pageSize=20&search=phone&sortBy=price&sortOrder=asc
```

Invalid URL values are safely normalized to valid defaults.

## Loading, Error and Empty States

The application includes:

* Skeleton loading states
* API error state
* Retry action
* Empty product state
* Empty search/filter state

## Project Structure

```text
app/
├── login/
├── products/
│   ├── [id]/
│   │   └── edit/
│   ├── add/
│   └── page.tsx
├── page.tsx
└── globals.css

components/
└── products/

lib/
├── api.ts
├── auth.ts
└── product-store.ts

services/
├── auth.service.ts
└── products.service.ts
```

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

## AI Assistance

AI tools were used during development for:

* Debugging implementation issues
* Reviewing and improving React/Next.js code
* Troubleshooting API and state-management issues
* Improving responsive UI
* Reviewing edge cases and error handling

The final implementation was tested and integrated manually.

## Deployment

The application can be deployed to Vercel.

Build command:

```bash
npm run build
```

Start command for a standard Node.js deployment:

```bash
npm run start
```
