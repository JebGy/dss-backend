//Conexion - proceso
import neo4j from "neo4j-driver";

// Configuración del cliente de Neo4j
const driver = neo4j.driver(
  `neo4j+s://${process.env.NEO_INSTANCE}.databases.neo4j.io`, // URL de la base de datos
  neo4j.auth.basic("neo4j", process.env.NEO_PASSWORD || "") // Autenticación básica
);

// Crea una sesión para interactuar con la base de datos
const sesion = driver.session();

export default sesion;
