# ECDAT — Enterprise Cryptographic Discovery & Analysis Tool

> A React-based Cryptographic Observability & Post-Quantum Cryptography (PQC) Transition Platform.

ECDAT provides enterprise security teams with full-perimeter visibility into cryptographic algorithms, keys, certificates, libraries, and protocols across distributed microservices. It catalogs assets into a Cryptographic Bill of Materials (CBOM), calculates quantum exposure windows using Dr. Michele Mosca's theorem, visualizes 4-tier dependency architectures, and orchestrates remediation roadmaps aligned with NIST FIPS 203/204 PQC standards.

---

## Key Capabilities

- **Executive Posture Dashboard (`/dashboard`)**: High-level cryptographic posture metrics, quantum-exposed perimeter tracking, algorithm family distributions, and urgent risk alerts.
- **Cryptographic Bill of Materials (CBOM) (`/inventory`)**: Searchable, multi-factor filtered inventory of 1,284 assets with full 6-tab deep inspection drawers (Overview, AST Code Evidence, Dependencies, Risk Scoring, PQC Guidance, Audit History).
- **Risk & Threat Center (`/risks`)**: Multi-factor scoring engine and 2D Cryptographic Risk Matrix mapping Business Criticality vs. Exposure, plus Harvest-Now-Decrypt-Later (HNDL) data shelf-life tracking.
- **Mosca Timing Sandbox (`/mosca`)**: Real-time simulation of Mosca's Theorem $(X + Y > Z)$ with interactive sliders for Data Shelf Life ($X$), Migration Time ($Y$), and Threat Horizon ($Z$).
- **4-Tier Dependency Graph (`/graph`)**: Interactive React Flow diagram mapping Business Domains $\to$ Applications $\to$ Crypto Providers $\to$ Cryptographic Assets with blast radius inspection.
- **PQC Guidance & Migration Runway (`/recommendations`, `/migration`)**: NIST FIPS 203/204 standard remediation strategies with a 5-stage Kanban orchestration board and interactive task checklists.
- **Live Code Scanner & Discovery Pipeline (`/scanner`, `/scans`)**: In-browser regex discovery engine analyzing code snippets in real time, accompanied by multi-step scan launcher simulations.
- **Compliance & Audit Reports (`/reports`, `/settings`)**: Machine-readable CycloneDX 1.6 CBOM JSON and CSV exports.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/) (Hash-based routing for static hosting compatibility)
- **UI & Primitives**: [Radix UI](https://www.radix-ui.com/) & Vanilla CSS Design System
- **Graph Visualization**: [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter & Tooling**: [Oxlint](https://oxc.rs/)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build
npm run preview
```

---

## Static Hosting & GitHub Pages

This application is configured with `base: './'` and client-side hash routing, making it compatible with GitHub Pages, Cloudflare Pages, AWS S3, or any static web server.
