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




export function agregarUsuario(
  codigoUsuario: string,
  nombreUsuario: string,
  codigoProducto: string,
  esCompra: boolean = false // Añadimos un parámetro para identificar si es compra o solo vista
) {
  return sesion
    .run(
      `
      MERGE (u:Usuario {codigoUsuario: $codigoUsuario})
      ON CREATE SET u.nombreUsuario = $nombreUsuario
      WITH u
      MATCH (p:Producto {codigoProducto: $codigoProducto})
      
      // Si es compra, se crea la relación de compra
      ${esCompra ? `MERGE (u)-[:USUARIO_COMPRÓ_PRODUCTO]->(p)` : `MERGE (u)-[:INTERACTUO_CON]->(p)`}

      RETURN u, p
      `,
      { codigoUsuario, nombreUsuario, codigoProducto, esCompra }
    )
    .then((result) => {
      const usuario = result.records[0].get("u").properties;
      const producto = result.records[0].get("p").properties;
      return { usuario, producto };
    })
    .catch((error) =>
      console.error("Error al crear usuario o relacionarlo con producto:", error)
    );
}
