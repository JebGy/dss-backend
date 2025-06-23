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

export async function recomendarTop6Comprados() {
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

export async function obtenerProductosPorCategoriaUsuario(idUsuario: string) {
  const productos: {
    codigoProducto: string;
    nombreProducto: string;
    categoria: string;
  }[] = [];

  try {
    const result = await sesion.run(
      `
      MATCH (u:Usuario {id: $idUsuario})-[:USUARIO_COMPRÓ_PRODUCTO|USUARIO_VISITÓ_PRODUCTO]->(p:Producto)-[:PERTENECE_A]->(c:Categoria)
      WITH DISTINCT c
      MATCH (p2:Producto)-[:PERTENECE_A]->(c)
      RETURN DISTINCT p2.codigoProducto AS codigoProducto, p2.nombreProducto AS nombreProducto, c.nombre AS categoria
      `,
      { idUsuario }
    );

    result.records.forEach((record) => {
      productos.push({
        codigoProducto: record.get("codigoProducto"),
        nombreProducto: record.get("nombreProducto"),
        categoria: record.get("categoria"),
      });
    });
  } catch (error) {
    console.error(
      "Error al obtener productos por categoría del usuario:",
      error
    );
  }

  return productos;
}

export async function recomendarProductosPorInteresesSimilares(
  idUsuario: string
) {
  const productosRecomendados: {
    codigoProducto: string;
    nombreProducto: string;
  }[] = [];

  try {
    const result = await sesion.run(
      `
      MATCH (u:Usuario {codigoUsuario: $idUsuario})-[:USUARIO_COMPRÓ_PRODUCTO|USUARIO_VISITÓ_PRODUCTO]->(p:Producto)      
WITH u, collect(DISTINCT p) AS productosUsuario      
MATCH (u2:Usuario)-[:USUARIO_COMPRÓ_PRODUCTO|USUARIO_VISITÓ_PRODUCTO]->(p2:Producto)      
WHERE u2 <> u      
WITH u, productosUsuario, u2, collect(DISTINCT p2) AS productosOtroUsuario       // Calcular la intersección de productos para encontrar usuarios similares      
WITH u, u2, apoc.coll.intersection(productosUsuario, productosOtroUsuario) AS productosEnComun, productosOtroUsuario, productosUsuario      
WHERE size(productosEnComun) > 0       // Recomendar productos que el usuario no ha visto/comprado pero que los similares sí      
UNWIND productosOtroUsuario AS prodRecomendado      
WITH prodRecomendado, productosUsuario      
WHERE NONE(x IN productosUsuario
WHERE x = prodRecomendado)      
WITH prodRecomendado, count(*) AS vecesRecomendado      
RETURN prodRecomendado.codigoProducto AS codigoProducto, prodRecomendado.nombreProducto AS nombreProducto      
ORDER BY vecesRecomendado DESC      
LIMIT 4
      `,
      { idUsuario }
    );

    result.records.forEach((record) => {
      productosRecomendados.push({
        codigoProducto: record.get("codigoProducto"),
        nombreProducto: record.get("nombreProducto"),
      });
    });
  } catch (error) {
    console.error(
      "Error al recomendar productos por intereses similares:",
      error
    );
  }

  return productosRecomendados;
}
