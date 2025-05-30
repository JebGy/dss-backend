import { NextApiRequest, NextApiResponse } from "next";
import { verify, JwtPayload } from "jsonwebtoken";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
 // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    res.status(500).json({ error: "No se ha configurado el secreto" });
    return;
  }
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  try {
    const result = verify(token, secret);
    if (result) {
      const decoded = result as JwtPayload;
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        res.status(200).json({ decoded });
      } else {
        res.status(401).json({ error: "Token expirado" });
      }
    } else {
      res.status(401).json({ error: "Token inválido" });
    }
  } catch (error) {
    res.status(401).json({ error: "Token inválido" + error });
  }
}
