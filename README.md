# AtlasOS

AtlasOS is an autonomous AI agent network that manages risk, yield, liquidations and treasury on HashKey Chain — non-custodial, transparent, on-chain.

This repository contains the UI, backend, agent orchestration code, smart contracts, and documentation to build and deploy AtlasOS. The repo is primarily TypeScript (frontend, backend, and SDK), with smart contracts in Solidity and supporting scripts.

Quick Links
- Website: https://atlasos.xyz (TBD)
- Docs: /docs (in repo)
- Pitch & overview: pitch.md
- Architecture: ARCHITECTURE.md
- Security: SECURITY.md

Table of Contents
- Getting Started
- Local Development
- Testing
- Smart Contracts
- Agents & Models
- Deployment
- Contributing
- Roadmap
- License

Getting Started

Prerequisites
- Node.js 18+ and npm or pnpm
- Docker & Docker Compose (for localchain and services)
- Hardhat / Foundry (for smart contract development)
- Kubernetes CLI (kubectl) and access to a cluster for deployment

Clone

```bash
git clone https://github.com/sangamitra22/atlasos.git
cd atlasos
```

Install

```bash
npm ci
# Or, use pnpm
# pnpm install
```

Project Layout (high level)
- /web — Next.js frontend (marketing + dashboard)
- /api — Node.js backend and GraphQL server
- /agents — agent services (TypeScript microservices)
- /models — model training & serving configs
- /contracts — Solidity contracts, scripts, and tests
- /scripts — utility scripts (deploy, migrate, seed)
- /docs — documentation and developer guides

Local Development

1. Start a localchain (Hardhat node or ganache) for contract testing and sandboxing:

```bash
# From /contracts
npm run node
```

2. Deploy Contracts to Localchain

```bash
cd contracts
npm run deploy:local
```

3. Start backend and frontend

```bash
# From repo root
# Start API
cd api && npm run dev
# Start frontend
cd web && npm run dev
```

4. Start agents (optional) — run as local Node processes or Docker containers

```bash
# Example
cd agents/risk-manager && npm run dev
```

Testing

- Smart-contract tests: Foundry / Hardhat
  - `cd contracts && npm run test`
- Backend/unit tests: Jest
  - `cd api && npm run test`
- Agent integration tests: run against a forked testnet and localchain

Smart Contracts

- Framework: Hardhat + OpenZeppelin
- Key contracts: AgentRegistry, PolicyManager, ExecutionCoordinator, OnChainLogs
- Security: run `npm run lint && npm run test && npm run verify` before deployment

Agents & Models

- Agents are built as stateless microservices in TypeScript. Each agent subscribes to a data stream and emits proposals.
- Model artifacts are stored in S3-compatible object stores. The repo includes training pipelines and example notebooks under `/models`.

Deployment

- Kubernetes manifests in `/deploy` for core services (api, agents, model server)
- Use Helm charts or kustomize for parameterized deployments
- CI/CD: GitHub Actions run tests and publish container images to registry, followed by deployment to cluster

Environment Variables

Create a `.env` file for local development and set required variables (example):

```
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/atlasos
RPC_URL_HASHKEY=https://your-hashkey-rpc.example
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=models
JWT_SECRET=replace_me
VAULT_ADDR=http://localhost:8200
```

Security & Compliance

- See SECURITY.md for responsible disclosure and security practices.
- Production relayer keys must be stored in HSM/KMS and never committed to the repository.

Contributing

We welcome contributions. Please follow the guidelines below:
- Fork the repository and create a topic branch.
- Run tests and linters locally.
- Open a pull request with clear description and test coverage.

Code Style

- TypeScript strict mode
- ESLint + Prettier
- Commit messages follow Conventional Commits

Roadmap

- M1: Core agent orchestration and basic smart contracts (Complete)
- M2: Sandbox + backtesting environment (Q3)
- M3: Enterprise relayer integrations and HashKey Chain pilots (Q4)
- M4: Marketplace for third-party agent plugins (2027)

License

This repository is released under the MIT License. See LICENSE file for details.

Contact

- Maintainers: hello@atlasos.xyz
- Security: security@atlasos.xyz

Acknowledgements

- Built with open-source tooling. Replace links and contacts with production-ready endpoints before public launches.
