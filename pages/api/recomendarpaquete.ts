import { recomendarPorPaqueteSimilar } from "@/utils/consultarnodos";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    const { idUsuario } = req.query;
    if (!idUsuario || typeof idUsuario !== "string") {
      res.status(400).json({ error: "Falta el parámetro idUsuario" });
      return;
    }
    try {
      const productos = await recomendarPorPaqueteSimilar(idUsuario);
      res.status(200).json(productos);
    } catch (error) {
      console.error("Error al recomendar productos por paquete similar:", error);
      res.status(500).json({ error: "Error al recomendar productos por paquete similar" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
