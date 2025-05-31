import { recomendarLoMasComprado } from "@/utils/consultarnodos";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    try {
      const productosRecomendados = await recomendarLoMasComprado();
      res.status(200).json(productosRecomendados);
    } catch (error) {
      console.error("Error al obtener productos recomendados:", error);
      res.status(500).json({ error: "Error al obtener productos recomendados" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}