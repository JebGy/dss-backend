import sesion from "./conexion";

export async function recomendarCategorias(codigoUsuario: string) {
  const productosRecomendados: {
    codigoCategoria: string;
    nombreCategoria: string;
  }[] = [];

  try {
    const result = await sesion.run(
      `
            MATCH (u:Usuario {codigoUsuario: $codigoUsuario})-[:USUARIO_COMPRÓ_PRODUCTO]->(p:Producto)-[:PERTENECE_A]->(c:Categoria)
            WITH c, COUNT(*) AS frecuencia
            ORDER BY frecuencia DESC
            RETURN c.codigoCategoria AS codigoCategoria,
                   c.nombreCategoria AS nombreCategoria
            LIMIT 5
            `,
      { codigoUsuario }
    );

    result.records.forEach((record) =>
      productosRecomendados.push({
        codigoCategoria: record.get("codigoCategoria"),
        nombreCategoria: record.get("nombreCategoria"),
      })
    );
  } catch (error) {
    console.error("Error al recomendar producto:", error);
  }

  return productosRecomendados;
}

export async function recomendarTop6Comprados(){
  const productosRecomendados: {
    codigoProducto: string;
    nombreProducto: string;
  }[] = [];

  try {
    const result = await sesion.run(
      `
      MATCH (p:Producto)-[:PERTENECE_A]->(c:Categoria)
      OPTIONAL MATCH (usuario:Usuario)-[:USUARIO_COMPRÓ_PRODUCTO]->(p)
      WITH p, COUNT(usuario) AS vecesComprado
      ORDER BY vecesComprado DESC
      LIMIT 4
      RETURN p.codigoProducto AS codigoProducto, p.nombreProducto AS nombreProducto
            `
    );

    result.records.forEach((record) =>
      productosRecomendados.push({
        codigoProducto: record.get("codigoProducto"),
        nombreProducto: record.get("nombreProducto"),
      })
    );
  } catch (error) {
    console.error("Error al recomendar producto:", error);
  }

  return productosRecomendados;
}

export async function recomendarLoMasComprado() {
  const productosRecomendados: {
    codigoProducto: string;
    nombreProducto: string;
  }[] = [];

  try {
    const result = await sesion.run(
      `
      MATCH (u:Usuario)-[:USUARIO_COMPRÓ_PRODUCTO]->(p:Producto)-[:PERTENECE_A]->(c:Categoria)
      WITH c, COUNT(*) AS frecuencia
      ORDER BY frecuencia DESC
      LIMIT 5
          
      MATCH (p:Producto)-[:PERTENECE_A]->(c)<-[:PERTENECE_A]-(p2:Producto)
      OPTIONAL MATCH (usuario:Usuario)-[:USUARIO_COMPRÓ_PRODUCTO]->(p2)
      WITH p2, c, COUNT(usuario) AS vecesComprado
      ORDER BY vecesComprado DESC
      RETURN p2.codigoProducto AS codigoProducto, p2.nombreProducto AS nombreProducto, vecesComprado
            `
    );

    result.records.forEach((record) =>
      productosRecomendados.push({
        codigoProducto: record.get("codigoProducto"),
        nombreProducto: record.get("nombreProducto"),
      })
    );
  } catch (error) {
    console.error("Error al recomendar producto:", error);
  }

  return productosRecomendados;
}
