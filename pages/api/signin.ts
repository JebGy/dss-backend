import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

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
  
  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Faltan datos" });
      return;
    }
    const token = sign({ email }, secret, { expiresIn: "1h" });
    res.status(200).json({ token });
    console.log("Agregado exitoso");
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}