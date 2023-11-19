//importa fastify
import fastify from "fastify";
//Importa as rotas
import { AppRoutes } from "./routes";
import cors from '@fastify/cors';
//Cria objeto da classe Fastify
const server = fastify()
//Registra as notas
server.register(AppRoutes)
server.register(cors)

//Sobe o servidor
server.listen({
    port: 3333,
})
.then( () => {
    console.log('HTTP SERVER RUNNING')
})

//ORM - MAPEADOR OBJETO RELACIONAL (INTERMEDIO ENTRE O SISTEMA E O BANCO DE DADOS) 
// -D SIGNIFICA INSTALAÇÃO NAS DEPENDENCIAS DE DESENVOLVIMENTO
// DEPENDENDIA ZOD RECUPERA DADOS DO FRONTEND