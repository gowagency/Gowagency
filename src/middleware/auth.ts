import { Request, Response, NextFunction } from "express";

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["x-api-key"];
  if (!process.env.API_SECRET_KEY || key !== process.env.API_SECRET_KEY) {
    res.status(401).json({ error: "API key inválida ou ausente" });
    return;
  }
  next();
}
