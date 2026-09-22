# ECDAT ? Enterprise Cryptographic Discovery & Assessment Tool

[![FastAPI](https://img.shields.io/badge/FastAPI-0.129+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react&logoColor=black)](https://reactjs.org)
[![CycloneDX](https://img.shields.io/badge/CycloneDX-1.6_CBOM-0080FF.svg)](https://cyclonedx.org)
[![NIST PQC](https://img.shields.io/badge/NIST_PQC-FIPS_203_%7C_204_%7C_205-10b981.svg)](https://csrc.nist.gov/pqc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ECDAT is an end-to-end Enterprise Cryptographic Discovery and Assessment platform built to accelerate migration to **Post-Quantum Cryptography (PQC)**. It automatically inventories cryptographic assets across microservices and repositories, generates standards-compliant **CycloneDX 1.6 Cryptographic Bills of Materials (CBOM)**, quantifies organizational exposure via **Mosca's Theorem ($X + Y > Z$)**, and outputs prioritized, actionable migration plans aligned with NIST standards (**ML-KEM-768**, **ML-DSA-65**, **SLH-DSA**).

---

## Key Features

- **Automated Discovery & AST Inspection**: Regex & AST pattern recognition for deprecated algorithms (`RSA-1024/2048`, `ECDSA/ECDH P-256`, `3DES`, `SHA-1`, `MD5`) and PQC schemes (`ML-KEM`, `ML-DSA`, `Kyber`, `Dilithium`).
- **Interactive Cryptographic Bill of Materials (CBOM)**: Full-fidelity data grid powered by TanStack Table, multi-column filtering, quantum-exposure classification, drawer inspection, and instant CycloneDX 1.6 JSON export.
- **Mosca's Theorem Risk Calculator**: Real-time evaluation of data shelf life ($X$), migration time ($Y$), and threat horizon ($Z$) to pinpoint Harvest Now, Decrypt Later (HNDL) deficits.
- **Interactive Dependency Topology**: Visual graph modeling relationships between enterprise applications, microservices, crypto libraries, and underlying algorithms.
- **Migration Roadmap & Task Management**: Kanban-style progress tracker with blast radius calculation, dual-scheme hybrid verification checklists, and ownership assignments.
- **Dual-Mode Architecture**: Runs as a standalone client-side SPA or connected to the Python FastAPI backend service.

---

## Architecture Overview

```
                      ??????????????????????????????????
                      ?          Web Browser           ?
                      ?  React 18 + TanStack + Lucide  ?
                      ??????????????????????????????????
                                      ?
                         REST API (HTTP / JSON)
                                      ?
                      ??????????????????????????????????
                      ?    FastAPI Python Service      ?
                      ?         (Uvicorn ASGI)         ?
                      ??????????????????????????????????
                              ?              ?
        ????????????????????????????????????????????????????????????
        ?                     ?              ?                     ?
????????????????     ???????????????? ????????????????    ???????????????????
? Asset Store  ?     ? Mosca Engine ? ? Risk Matrix  ?    ? CBOM Generator  ?
?  & Seed Data ?     ? (X + Y > Z)  ? ? & HNDL Guard ?    ? (CycloneDX 1.6) ?
????????????????     ???????????????? ????????????????    ???????????????????
```

---

## Public Deployment

### Deploy to Render (Recommended)

This repository includes a native [`render.yaml`](./render.yaml) blueprint configuring both the FastAPI Web Service and React Static Site:

1. Fork or push this repository to GitHub: `https://github.com/Zeromatrix-159328/ECDAT.git`
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New** > **Blueprint**.
4. Connect this GitHub repository. Render will automatically detect `render.yaml` and provision:
   - **`ecdat-api`**: Python 3.11 Web Service running FastAPI (`uvicorn app.main:app`).
   - **`ecdat-frontend`**: Static Site hosting the compiled React SPA with SPA routing.
5. In your frontend settings on Render, set `VITE_API_URL` to the public URL of your `ecdat-api` service.

---

### Deploy with Docker

#### Single Unified Container (Frontend + Backend)
```bash
# Build the unified container
docker build -t ecdat:latest .

# Run the container (serves both API and UI on port 8000)
docker run -d -p 8000:8000 --name ecdat-app ecdat:latest
```
Visit `http://localhost:8000` to view the application and `http://localhost:8000/api/v1/docs` for Swagger UI.

#### Using Docker Compose
```bash
docker-compose up --build
```

---

## Local Development

### 1. Prerequisites
- **Node.js** >= 18.x
- **Python** >= 3.10
- **Git**

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Local URL: `http://localhost:5173`

### 3. Backend Setup
```bash
cd backend

# Install Python requirements
pip install -r requirements.txt

# Start FastAPI uvicorn server
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger Documentation: `http://localhost:8000/api/v1/docs`

---

## API Contract Specification

All endpoints are versioned under `/api/v1`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health status and timestamp |
| `GET` | `/api/v1/dashboard/summary` | Global cryptographic KPIs, risk, and algorithm metrics |
| `GET` | `/api/v1/assets` | Queryable asset inventory with search, risk, and quantum filters |
| `GET` | `/api/v1/assets/{id}` | Detailed asset specification, usage context, and classification |
| `POST` | `/api/v1/assets` | Ingest new cryptographic asset into inventory |
| `GET` | `/api/v1/assets/export/cbom` | Export CycloneDX 1.6 Cryptographic Bill of Materials (JSON) |
| `GET` | `/api/v1/scans` | Historical code & pipeline discovery scan runs |
| `POST` | `/api/v1/scans/analyze` | Real-time AST & regex cryptographic pattern detection |
| `GET` | `/api/v1/risks/summary` | Enterprise risk distribution & quantum exposure metrics |
| `GET` | `/api/v1/risks/hndl` | Harvest Now, Decrypt Later vulnerability report |
| `POST` | `/api/v1/mosca/assess` | Mosca Theorem calculus ($X+Y > Z$) & deficit analysis |
| `GET` | `/api/v1/migration/tasks` | Post-quantum migration roadmap, checklist items, and effort |
| `PATCH` | `/api/v1/migration/tasks/{id}` | Update migration phase, checklist, or ownership |
| `GET` | `/api/v1/recommendations` | NIST FIPS 203/204/205 transition mapping per asset |
| `GET` | `/api/v1/graph` | Cryptographic dependency topology (nodes & edges) |

---

## PQC Transition Reference Standards

- **NIST FIPS 203**: Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)
- **NIST FIPS 204**: Module-Lattice-Based Digital Signature Standard (ML-DSA)
- **NIST FIPS 205**: Stateless Hash-Based Digital Signature Standard (SLH-DSA)
- **CycloneDX 1.6**: Cryptographic Bill of Materials (CBOM) Standard
