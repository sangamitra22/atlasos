# SECURITY

Last updated: 2026-06-30

This document outlines the security posture, responsible disclosure process, and recommended controls for AtlasOS. It is intended for security researchers, integrators, and operators.

Security Principles
- Least Privilege: grant the minimum capability necessary for agents and services to operate.
- Defense in Depth: combine on-chain constraints, governance controls, and off-chain guardrails.
- Auditability: maintain immutable on-chain logs and off-chain verifiable receipts for all impactful actions.
- Fail-safe Defaults: safe-mode and emergency pause should minimize damage in incidents.

Responsible Disclosure
- To report a security issue, contact: security@atlasos.xyz
- If sensitive, use PGP: (PGP key fingerprint - placeholder)
- Please include: affected component, steps to reproduce, impact, PoC (if available), and suggested remediation.
- We ask researchers to give 90 days for us to respond and remediate before public disclosure, unless immediate danger requiring public notice exists.

Bug Bounty
- AtlasOS runs a bug bounty program (program link / HackerOne/GitHub Security) with rewards based on severity.
- Scope: smart contracts, agent orchestration, relayer, indexer, and public API endpoints. Excluded: social engineering or vulnerabilities in third-party dependent services.

On-chain Security Controls
- Timelocks: critical contract upgrades and high-value operations are subject to an on-chain timelock.
- Multisig & Governance: major actions (e.g., treasury moves above threshold) require multisig or DAO approval.
- Capability Tokens: agents perform actions via scoped capability tokens (limited lifetime and scope).
- Immutable Logs: OnChainLogs contract records agent proposals and final execution metadata.

Smart Contract Security Practices
- Language & Frameworks: Solidity with Hardhat/Foundry for tests; follow OpenZeppelin standards for access control and libraries.
- Testing: unit tests, integration tests, forked-chain scenarios, fuzz testing, and property-based tests.
- Formal Methods: where feasible, apply formal verification to critical modules (ExecutionCoordinator, PolicyManager).
- Audits: engage third-party auditors prior to major releases; publish audit reports and remediation logs.

Off-chain Security Practices
- Key Management: relayer keys stored in HSMs or enterprise KMS; rotation policies in place.
- Secrets: use Vault for secrets, encrypt at rest and in transit.
- Least-privilege APIs: internal services authenticate using short-lived mTLS certificates or OIDC tokens.
- Network Security: isolate networks (VPCs), use private subnets for indexers and model stores.

Agent Safety & Governance
- Human-in-the-loop: for high-impact actions agents produce proposals that require human/multisig approval by default.
- Guardrails: policies define per-action limits (max USD, max slippage, asset exposure) and enzyme-style constraints.
- Simulation: every proposed action is simulated in a fork environment and estimated for cost, profit, and risk before execution.

Monitoring & Incident Response
- Monitoring: Prometheus alerts, log anomaly detection, and on-chain event watchers.
- Forensics: retain transaction traces, agent decision records, and model inputs to reproduce incidents.
- Incident Response: documented runbooks for common classes (oracle incidents, agent misbehavior, contract exploit); post-mortem and public disclosure policy.

Third-party Risk
- Oracle redundancy: aggregate multiple oracle feeds and implement sanity checks.
- Dependency tracking: maintain SBOM for critical services and CVE monitoring.
- Partner SLAs: require partners (relayers, oracles, custodians) to meet security baselines and perform regular audits.

Privacy & Data Handling
- Data minimization: avoid storing sensitive wallet addresses or private info unless necessary.
- Encryption: all sensitive data is encrypted at rest (KMS-managed keys) and in transit (TLS v1.2+/mTLS).
- Access controls: RBAC for dashboards and logs; auditor roles for read-only access.

Security Contacts & Timeline
- Security contact: security@atlasos.xyz
- Acknowledge timeframe: 3 business days
- Initial remediation timeframe: 30-90 days depending on severity
- Public disclosure policy: coordinated after remediation or after 90 days

Appendix: Quick Response Checklist
1. Verify incident and scope (on-chain + off-chain).
2. If funds at risk, trigger emergency pause via governance multisig.
3. Rotate keys and revoke compromised capability tokens.
4. Notify affected partners and launch coordinated disclosure.
5. Publish a post-mortem with timeline and remediation steps.

Notes
- Replace placeholder emails and PGP fingerprints with operational details before public release.
