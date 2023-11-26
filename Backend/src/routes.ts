import { FastifyInstance } from "fastify"
import {z} from 'zod'
import {prisma} from "./lib/prisma"

export async function AppRoutes(server: FastifyInstance) {

    //ROTAS PARA MOSTRAR

    //ROTA MOSTRA DADOS DA TABELA TB_ITEM
    server.get('/tb_item', async() => {
        const tb_item = await prisma.tb_item.findMany()
        return tb_item
    })

    //ROTA PARA MOSTRAR A TABELA TB_USUARIO
    server.get('/tb_usuario', async() => {
        const tb_usuario = await prisma.tb_usuario.findMany()
        return tb_usuario
    })
    //ROTA PARA MOSTRAR UM USUÁRIO ESPECÍFICO DA TABELA TB_USUARIO
    server.get('/tb_usuario/:username', async(request) => {
        const usernameParams = z.object({
            username: z.string()
        })
        const {username} = usernameParams.parse(request.params)
        const tb_usuario = await prisma.tb_usuario.findMany({
            where: {
                nm_usuario: username,
            },
        })
        return tb_usuario
    })

    //ROTA PARA MOSTRAR A TABELA TB_FORNECEDOR
    server.get('/tb_fornecedor', async() => {
        const tb_fornecedor = await prisma.tb_fornecedor.findMany()
        return tb_fornecedor
    })

    //ROTA PARA MOSTRAR A TABELA TB_SALA
    server.get('/tb_sala', async() => {
        const tb_sala = await prisma.tb_sala.findMany()
        return tb_sala
    })

    //ROTAS PARA CRIAR

    //ROTA CRIAR UM NOVO ITEM NA TB_ITEM
    server.post('/tb_item/add', async(Request) => {
        const postBody = z.object(
            {
                cod_item: z.number(),
                id_fornecedor: z.number(),
                id_sala: z.number(),
                nm_item: z.string(),
                des_item: z.string(),
                estado_item: z.string(),
                dt_entrada: z.string(),
            }
        )
        const {cod_item, id_fornecedor, id_sala, nm_item,
                des_item, estado_item, dt_entrada} = postBody.parse(Request.body)
        const newItem = await prisma.tb_item.create({
            data: {
                cod_item: cod_item,
                id_fornecedor: id_fornecedor,
                id_sala: id_sala,
                nm_item: nm_item,
                des_item: des_item,
                estado_item: estado_item,
                dt_entrada: new Date (dt_entrada),
            }
        })
        return newItem;
    });

    //ROTA PARA CRIAR UM NOVO USUÁRIO NA TB_USUARIO
    server.post('/tb_usuario/add', async(Request) => {
        const postBody = z.object(
            {
                nm_usuario: z.string(),
                senha: z.string(),
            }
        )
        const {nm_usuario, senha} = postBody.parse(Request.body)
        const newUser = await prisma.tb_usuario.create({
            data: {
                nm_usuario: nm_usuario,
                senha: senha,
            }
        })
        return newUser;
    })

    //ROTA PARA CRIAR UM NOVO FORNECEDOR NA TB_FORNECEDOR
    server.post('/tb_fornecedor/add', async(Request) => {
        const postBody = z.object(
            {
                nm_fornecedor: z.string(),
                telefone: z.string(),
                email: z.string(),
            }
        )
        const {nm_fornecedor, telefone, email} = postBody.parse(Request.body)
        const newFornedor = await prisma.tb_fornecedor.create({
            data: {
                nm_fornecedor: nm_fornecedor,
                telefone: telefone,
                email: email,
            }
        })
        return newFornedor;
    })

    //ROTA PARA CRIAR UMA NOVA SALA NA TB_SALA
    server.post('/tb_sala/add', async(Request) => {
        const postBody = z.object(
            {
                nm_sala: z.string(),
            }
        )
        const {nm_sala} = postBody.parse(Request.body)
        const newSala = await prisma.tb_sala.create({
            data: {
                nm_sala: nm_sala,
            }
        })
        return newSala;
    })

    //ROTAS PARA REMOVER

    //ROTA PARA REMOVER UM ITEM NA TB_ITEM
    server.delete('/tb_item/delete/:id', async (request) => {
        const idParam = z.object({
            id: z.string(),
        })
        const { id } = idParam.parse(request.params)
        const itemid = Number(id)
        const deleteItem = await prisma.tb_item.delete({
            where: {
                id_item: itemid,
            },
        })
        return deleteItem
    });

    //ROTA PARA REMOVER UM USUÁRIO DA TB_USUARIO
    server.delete('/tb_usuario/delete/:id', async (request) => {
        const idParam = z.object({
            id: z.string(),
        })
        const { id } = idParam.parse(request.params)
        const userid = Number(id)
        const deleteUser = await prisma.tb_usuario.delete({
            where: {
                id_usuario: userid,
            },
        })
        return deleteUser
    });

    //ROTA PARA DELETAR UM FORNECEDOR DA TB_FORNECEDOR
    server.delete('/tb_fornecedor/delete/:id', async (request) => {
        const idParam = z.object({
            id: z.string(),
        })
        const { id } = idParam.parse(request.params)
        const fornecedorid = Number(id)
        const deleteFornecedor = await prisma.tb_fornecedor.delete({
            where: {
                id_fornecedor: fornecedorid,
            },
        })

        return deleteFornecedor
    });

    //ROTA PARA DELETAR UMA SALA DA TB_SALA
    server.delete('/tb_sala/delete/:id', async (request) => {
        const idParam = z.object({
            id: z.string(),
        })
        const { id } = idParam.parse(request.params)
        const salaid = Number(id)
        const deleteSala = await prisma.tb_sala.delete({
            where: {
                id_sala: salaid,
            },
        })
        return deleteSala
    });

    //ROTAS PARA ATUALIZAR

    //ROTA PARA ATUALIZAR UM ITEM NA TB_ITEM
    server.put('/tb_item/update', async (Request) => {
        const idParams = z.object({
            id_item: z.number()
        })
        const {id_item} = idParams.parse(Request.params)
        const putBody = z.object({
            cod_item: z.number(),
            id_fornecedor: z.number(),
            id_sala: z.number(),
            nm_item: z.string(),
            des_item: z.string(),
            estado_item: z.string(),
            dt_entrada: z.string(),
        })
        const {cod_item, nm_item, id_sala, des_item, id_fornecedor,
                estado_item, dt_entrada} = putBody.parse(Request.body)
        const itemUpdate = await prisma.tb_item.updateMany({
            where: {
                id_item: id_item,
            },
            data: {
                cod_item: cod_item,
                id_fornecedor: id_fornecedor,
                id_sala: id_sala,
                nm_item: nm_item,
                des_item: des_item,
                estado_item: estado_item,
                dt_entrada: new Date (dt_entrada)
            },
        })
        return (itemUpdate.count >= 1) ? `Atualização com sucesso` : `Nada foi atualizado`
    })
    //ROTA PARA ATUALIZAR UM USUÁRIO NA TB_USUARIO
    server.put('/tb_usuario/update', async (Request) => {
        const putBody = z.object({
            id_usuario: z.number(),
            nm_usuario: z.string(),
            senha: z.string(),
        })
        const {id_usuario, nm_usuario, senha} = putBody.parse(Request.body)
        const updateUser = await prisma.tb_usuario.updateMany({
            where: {
                id_usuario: id_usuario,
            },
            data: {
                nm_usuario: nm_usuario,
                senha: senha,
            },
        })
        return (updateUser.count >= 1 ) ? `Atualizado com suscesso` : `Nada foi atualizado`
    })
    //ROTA PARA ATUALIZAR UM FORNECEDOR NA TB_FORNECEDOR
    server.put('/tb_fornecedor/update', async (Request) => {
        const putBody = z.object({
            id_fornecedor: z.number(),
            nm_fornecedor: z.string(),
            telefone: z.string(),
            email: z.string(),
        })
        const {id_fornecedor, nm_fornecedor, telefone, email} = putBody.parse(Request.body)
        const updateFornecedor = await prisma.tb_fornecedor.updateMany({
            where: {
                id_fornecedor: id_fornecedor,
            },
            data: {
                nm_fornecedor: nm_fornecedor,
                telefone: telefone,
                email: email,
            },
        })
        return (updateFornecedor.count >= 1 ) ? `Atualizado com suscesso` : `Nada foi atualizado`
    })
    //ROTA PARA ATUALIZAR UMA SALA NA TB_SALA
    server.put('/tb_sala/update', async (Request) => {
        const idParams = z.object({
            id_sala: z.number()
        })
        const {id_sala} = idParams.parse(Request.params)
        const putBody = z.object({
            id_sala: z.number(),
            nm_sala: z.string(),
        })
        const {nm_sala} = putBody.parse(Request.body)
        const updateSala = await prisma.tb_sala.updateMany({
            where: {
                id_sala: id_sala,
            },
            data: {
                nm_sala: nm_sala,
            },
        })
        return (updateSala.count >= 1 ) ? `Atualizado com suscesso` : `Nada foi atualizado`
    })

}