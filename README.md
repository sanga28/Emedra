# Emedra: Decentralized Medical Reports
Emedra is a decentralized application (dApp) for securely storing and managing medical reports. It uses the Ethereum blockchain for data immutability and IPFS (InterPlanetary File System) for decentralized file storage.
## Features
- Secure File Storage: Medical reports are uploaded to a local IPFS node, a peer-to-peer network, ensuring they're not stored on a single, centralized server.
- Immutable Data Records: The IPFS hash (CID) of each file is permanently stored on an Ethereum smart contract, creating an unchangeable record of the report.
- MetaMask Integration: The app uses MetaMask to allow patients to connect their wallet and sign transactions, giving them full control over their data and gas fees.
- Patient and Doctor Roles: The application distinguishes between patient and doctor roles to control who can upload, view, and manage reports.
- Local Development Environment: The project is configured to run on a local Ganache blockchain and a local IPFS node, making it easy to develop and test without requiring external API keys.
## Prerequisites
- Node.js: Make sure you have Node.js and npm installed.
- Ganache: Download and install Ganache.
- IPFS Desktop: Download and install IPFS Desktop to run a local IPFS node.
- MetaMask: Install the MetaMask browser extension and connect it to your local Ganache network.
