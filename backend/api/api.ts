// src/backend/api.ts
import express from "express";
import cors from "cors";
import { connectToOpcServer, readAllNodes, readNodeValue, writeNodeValue, nodeMap } from "./opcClient";

const app = express();
app.use(cors());
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

// Endpoint: specifieke node uitlezen
app.get("/api/read", async (req, res) => {
  try {
    const name = req.query.name as string;
    if (!name || !nodeMap[name]) return res.status(400).json({ error: "Invalid node name" });

    const value = await readNodeValue(nodeMap[name]);
    res.json({ name, value });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: waarde schrijven
app.post("/api/write", async (req, res) => {
  try {
    const { name, value } = req.body;
    if (!name || !nodeMap[name]) return res.status(400).json({ error: "Invalid node name" });

    await writeNodeValue(nodeMap[name], value);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 API draait op http://localhost:3000"));
