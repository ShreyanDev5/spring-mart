# <img src="public/logo.svg" width="28" height="28" style="vertical-align: middle;" /> SpringMart

Full-stack e-commerce app built with a Java (Spring Boot) REST API and React frontend. Supports product management, multi-field search, pagination, and raw image streaming.

[Live Demo](https://springmart.netlify.app/)

---

## Preview

| Home Page | Product Details | Add / Edit Product |
| :---: | :---: | :---: |
| <img src="public/home_page.png" width="280" alt="Home Page"> | <img src="public/product_page.png" width="280" alt="Product Details"> | <img src="public/add_page.png" width="200" alt="Add Product"> |

---

## Features

- **Product CRUD**: Create, view, update, and delete products with validation and partial update support.
- **Multi-Field Search**: JPQL keyword search across name, description, category, and brand.
- **Image Handling**: Uploads and streams product images directly as raw byte arrays with MIME types.
- **Pagination**: Server-side and client-side pagination for product catalogs.
- **Auto-Seed & Docker**: Auto-seeds demo items on startup; runs locally or containerized with Docker.

---

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.4.5, Spring Data JPA, Hibernate, H2 Database, Maven
- **Frontend**: React 19, React Router, Sass, React Toastify, React Icons
- **Deployment & Infra**: Docker, Netlify (Frontend), Render (Backend)
- **AI Tooling**: Frontend and UI built with AI agents (Antigravity, Cursor)

---

## Architecture

```text
HTTP Request ──> ProductController ──> ProductService ──> ProductRepository ──> H2 Database
```

- **Controller**: Validates requests, enables CORS, and maps multipart form data (`ProductRequest` DTO + image).
- **Service**: Runs business logic, handles partial update merges, and preserves existing images.
- **Repository**: Spring Data JPA repository executing custom multi-field JPQL queries.
- **Storage**: Disk-persisted H2 database (`./data/springmartdb`) storing image bytes directly.

---

## API Reference

Base path: `/api`

| Method | Endpoint | Description | Request Format |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Health check | — |
| `GET` | `/products?page=0&size=10` | Paginated product list | Query params (`page`, `size`) |
| `GET` | `/products/{id}` | Product details by ID | — |
| `GET` | `/products/search?keyword=...` | Search across 4 fields | Query param (`keyword`) |
| `GET` | `/products/image/{id}` | Stream raw image bytes | — |
| `POST` | `/products` | Create product | Multipart (`product` DTO + `imageFile`) |
| `PUT` | `/products/{id}` | Update product | Multipart (`product` DTO + `imageFile`) |
| `DELETE`| `/products/{id}` | Delete product | — |

---

## Project Structure

```text
SpringMart/
├── springmart-backend/   # Java 21 / Spring Boot REST API
├── springmart-frontend/  # React 19 SPA
├── docker-compose.yml    # Docker setup for backend
└── Dockerfile            # Multi-stage backend build
```

---

## Getting Started

### Prerequisites
- **Java 21+**
- **Node.js 20+**
- **Docker** (optional)

### 1. Backend
```bash
cd springmart-backend

# Windows (PowerShell / CMD)
.\mvnw.cmd spring-boot:run

# macOS / Linux
chmod +x mvnw && ./mvnw spring-boot:run
```
- API: `http://localhost:8080` (H2 Console: `/h2-console`)

### 2. Frontend
```bash
cd springmart-frontend
npm install
npm start
```
- App: `http://localhost:3000`

### 3. Docker (Backend Alternative)
```bash
docker compose up --build
```

---

## Deployment

- **Frontend**: [springmart.netlify.app](https://springmart.netlify.app/)
- **Backend**: Hosted on [Render](https://render.com)
