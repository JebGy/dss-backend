// En utils/agregarnodo.ts

import sesion from "./conexion";

export function limpiarGrafo() {
  return sesion
    .run("MATCH (n) DETACH DELETE n")
    .then(() => console.log("Grafo limpiado"))
    .catch((error) => console.error("Error al limpiar grafo:", error));
}
