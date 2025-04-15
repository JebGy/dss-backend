//Conexion - proceso


import neo4j from 'neo4j-driver';

// Configuración del cliente de Neo4j
const driver = neo4j.driver(
  'neo4j+s://2f6d8ee5.databases.neo4j.io',  // URL de la base de datos
neo4j.auth.basic('neo4j', 'OiX7dGVtCom0m-SJ5LPO-8OD5vEhP7lqTcENtvl80gs')

);

// Crea una sesión para interactuar con la base de datos
const sesion = driver.session();

export default sesion;