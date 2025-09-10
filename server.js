// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { ethers } from "ethers";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { create as createIPFSClient } from "ipfs-http-client";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// mount auth routes
app.use("/api/auth", authRoutes);

// multer (store locally then remove)
const upload = multer({ dest: "uploads/" });

// ✅ Local IPFS Client setup - NO API KEY REQUIRED
const ipfsApiUrl = "http://127.0.0.1:5001";
const ipfs = createIPFSClient({ url: ipfsApiUrl });

// Ethereum contract
const contractAddress =
    process.env.CONTRACT_ADDRESS ||
    "0xF3aAFfd2F3065f61Bc2Fee52082AF593a0b61EA4";
const contractABI = [
    "function storeReportHash(string memory hash) public returns (bool)",
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Upload route
app.post("/api/reports/upload", upload.single("report"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    try {
        console.log("📂 Uploaded file:", fileName);

        const fileBuffer = fs.readFileSync(filePath);

        // Upload to local IPFS node
        const result = await ipfs.add(fileBuffer);
        const cid = result.cid.toString();

        console.log("✅ Stored on local IPFS CID:", cid);

        fs.unlinkSync(filePath); // cleanup

        // Store CID on blockchain
        const tx = await contract.storeReportHash(cid);
        await tx.wait();
        console.log("✅ Stored on blockchain tx:", tx.hash);

        // Build URLs (will need a public gateway to be viewable)
        const ipfsCidUrl = `https://ipfs.io/ipfs/${cid}`;

        return res.json({
            message: "Report uploaded & stored on blockchain",
            file: fileName,
            hash: cid,
            txHash: tx.hash,
            ipfsCidUrl,
            ipfsFileUrl: ipfsCidUrl,
        });
    } catch (err) {
        console.error("❌ Upload error:", err);
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.error("Failed to delete temp file:", e.message);
        }
        return res.status(500).json({
            message: "Upload failed",
            error: err.message,
            stack: err.stack,
        });
    }
});

// DB + Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));