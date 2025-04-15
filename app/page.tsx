"use client";
import {
  agregarCategoria,
  agregarProducto,
  agregarUsuario,
} from "@/utils/agregarnodo";
import { limpiarGrafo } from "@/utils/clean";

export default function Home() {
  return (
    <div>
      {/* Botón para agregar categoría, producto y usuario (vista) /}
      
      {/ Botón para simular la compra de un producto */}
{/* 
      <button
        onClick={async () => {
          await limpiarGrafo();
          try {
            // Agregar categoría
            const categoria = await agregarCategoria(
              "CAT001",
              "Calzado deportivo"
            );
            console.log("Categoría creada:", categoria);

            // Agregar producto bajo esa categoría
            const producto = await agregarProducto(
              "PRO001",
              "Calzado deportivo",
              "Zapatillas Nike"
            );
            console.log("Producto creado:", producto);

            // Agregar usuario con solo interacción (no compra)
            const usuario = await agregarUsuario(
              "Favio",
              "Flavia Siguas",
              "PRO001",
              false
            ); // esCompra = false (solo vista)
            console.log("Usuario interactuó con producto:", usuario);
          } catch (error) {
            console.error("Hubo un error al crear:", error);
          }
        }}
      >
        Realizar Vista de Producto
      </button> */}

      {/* <button
        onClick={async () => {
          try {
            // Agregar usuario con compra (esCompra = true)
            const usuario = await agregarUsuario(
              "Favio",
              "Flavia Siguas",
              "PRO001",
              true
            ); // esCompra = true (compra)
            console.log("Usuario compró producto:", usuario);
            alert("Completado");
          } catch (error) {
            console.error("Hubo un error al crear:", error);
          }
        }}
      >
        Comprar Producto
      </button> */}
    </div>
  );
}
