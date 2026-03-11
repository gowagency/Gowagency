import "dotenv/config";
import express from "express";
import cors from "cors";
import { requireApiKey } from "./middleware/auth";
import chatRouter from "./routes/chat";
import assistantRouter from "./routes/assistant";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

// Health check (sem autenticação)
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rotas da IA — protegidas por API key
app.use("/api/chat", requireApiKey, chatRouter);
app.use("/api/assistant", requireApiKey, assistantRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
