import { RegistrarEvento } from "@/interfaces/interfacesutils";
import sesion from "./conexion";

export function agregarCategoria(
  codigoCategoria: string,
  nombreCategoria: string
) {
  return sesion
    .run(
      `
      MERGE (c:Categoria {codigoCategoria: $codigoCategoria})
      ON CREATE SET c.nombreCategoria = $nombreCategoria
      RETURN c
      `,
      { codigoCategoria, nombreCategoria }
    )
    .then((result) => result.records[0].get("c").properties)
    .catch((error) => console.error("Error al crear categoría:", error));
}

export function agregarProducto(
  codigoProducto: string,
  nombreCategoria: string,
  nombreProducto: string
) {
  return sesion
    .run(
      `
      MERGE (c:Categoria {nombreCategoria: $nombreCategoria})
      MERGE (p:Producto {codigoProducto: $codigoProducto})
      ON CREATE SET p.nombreProducto = $nombreProducto
      MERGE (p)-[:PERTENECE_A]->(c)
      RETURN p, c
      `,
      { codigoProducto, nombreCategoria, nombreProducto }
    )
    .then((result) => {
      const producto = result.records[0].get("p").properties;
      const categoria = result.records[0].get("c").properties;
      return { producto, categoria };
    })
    .catch((error) => console.error("Error al crear producto:", error));
}

export async function agregarUsuario(valor: RegistrarEvento) {
  const { codigoUsuario, nombreUsuario, nombreProducto, esCompra } = valor;

  try {
    const result = await sesion.run(
      `
      MERGE (u:Usuario {codigoUsuario: $codigoUsuario})
      ON CREATE SET u.nombreUsuario = $nombreUsuario
      WITH u
      MATCH (p:Producto {nombreProducto: $nombreProducto})
      
      // Si es compra, se crea la relación de compra
      ${
        esCompra
          ? `MERGE (u)-[:USUARIO_COMPRÓ_PRODUCTO]->(p)`
          : `MERGE (u)-[:INTERACTUO_CON]->(p)`
      }

      RETURN u, p
      `,
      { codigoUsuario, nombreUsuario, nombreProducto }
    );

    const usuario = result.records[0].get("u").properties;
    const producto = result.records[0].get("p").properties;
    return { usuario, producto };
  } catch (error) {
    console.error(
      "Error al crear usuario o relacionarlo con producto:",
      error
    );
    throw error;
  }
}

export async function registrarEvento(req: any, res: any) {
  const datosEvento = req.body;

  await agregarCategoria(datosEvento.categoria, datosEvento.nombreCategoria)
    .then(() =>
      agregarProducto(datosEvento.codigoProducto, datosEvento.nombreCategoria, datosEvento.nombreProducto)
    )
    .then(() => agregarUsuario(datosEvento))
    .then(() =>
      res.status(200).json({ message: "Acción registrada exitosamente" })
    )
    .catch((error) => {
      console.error("Error al registrar evento:", error);
      res.status(500).json({ message: "Error al registrar evento" });
    });
}
