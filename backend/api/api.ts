// src/backend/api.ts
import express from "express";
import cors from "cors";
import { connectToOpcServer, readAllNodes, readNodeValue, writeNodeValue, nodeMap } from "./opcClient";

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Connect OPC UA
connectToOpcServer().catch(console.error);

// Endpoint: alle nodes uitlezen
app.get("/api/all", async (req, res) => {
  try {
    const data = await readAllNodes();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("🚀 API draait op http://localhost:3001"));
