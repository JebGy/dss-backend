import { RegistrarEvento } from "@/interfaces/interfacesutils";
import {
  agregarCategoria,
  agregarProducto,
  agregarUsuario,
  registrarEvento,
} from "@/utils/agregarnodo";
import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //solicita el token en el header de la peticion
  const token = req.headers.authorization?.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    res.status(500).json({ error: "No se ha configurado el secreto" });
    return;
  }
  //verifica el token para luego ejecutar la accion
  if (req.method === "POST") {
    if (!token) {
      res.status(401).json({ error: "Token no proporcionado" });
      return;
    }
    try {
      const decoded = verify(token, secret);
      if (decoded) {
        registrarEvento(req, res);
      } else {
        res.status(401).json({ error: "Token inválido" });
      }
    } catch (error) {
      res.status(401).json({ error: "Token inválido" + error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
