import Produto from '../models/Produto.js';
import { z } from 'zod';
export default async function routes(fastify) {
    const produtoSchema = z.object({
        nome: z.string(),
        preco: z.number(),
        dataFabricado: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Data de fabricação inválida',
        }),
        dataValidade: z.string().refine(val => !isNaN(Date.parse(val)), {
            message: 'Data de validade inválida',
        }),
        imagem: z.string(),
        categoria: z.string(),
        quantidade: z.number(),
    });
    const produtoParamsSchema = z.object({
        id: z.string(),
    });
    fastify.get('/', async (_request, reply) => {
        const listarProdutos = await Produto.find();
        reply.send(listarProdutos);
    });
    fastify.post('/cadastrar', {
        schema: {
            body: produtoSchema,
            response: {
                201: z.object({ mensagem: z.string() }),
                400: z.object({ mensagem: z.string() }),
                500: z.object({ mensagem: z.string(), erro: z.string().optional() }),
            },
        },
    }, async (request, reply) => {
        const { nome, preco, dataFabricado, dataValidade, imagem, categoria, quantidade, } = request.body;
        try {
            const fabricado = new Date(dataFabricado);
            const validade = new Date(dataValidade);
            if (isNaN(fabricado.getTime()) || isNaN(validade.getTime())) {
                return reply.status(400).send({ mensagem: 'Datas inválidas' });
            }
            const produto = new Produto({
                nome,
                preco,
                dataFabricado: fabricado,
                dataValidade: validade,
                imagem,
                categoria,
                quantidade,
            });
            await produto.save();
            return reply.status(201).send({ mensagem: 'Produto cadastrado com sucesso!!' });
        }
        catch (err) {
            console.error('ERRO AO SALVAR PRODUTO:', err);
            return reply.status(500).send({
                mensagem: 'Erro ao cadastrar produto',
                erro: err.message ?? 'Erro desconhecido',
            });
        }
    });
    fastify.put('/produto/:id', {
        schema: {
            params: produtoParamsSchema,
            body: produtoSchema.partial(),
            response: {
                200: z.object({
                    mensagem: z.string(),
                    produto: produtoSchema.optional(),
                }),
                400: z.object({ mensagem: z.string() }),
                404: z.object({ mensagem: z.string() }),
            },
        },
    }, async (request, reply) => {
        const { id } = request.params;
        const dadosAtualizados = request.body;
        if (!id || Object.keys(dadosAtualizados).length === 0) {
            return reply.status(400).send({ mensagem: 'ID ou dados ausentes' });
        }
        try {
            if (dadosAtualizados.dataFabricado) {
                const d = new Date(dadosAtualizados.dataFabricado);
                if (isNaN(d.getTime()))
                    return reply.status(400).send({ mensagem: 'DataFabricado inválida' });
                dadosAtualizados.dataFabricado = d;
            }
            if (dadosAtualizados.dataValidade) {
                const d = new Date(dadosAtualizados.dataValidade);
                if (isNaN(d.getTime()))
                    return reply.status(400).send({ mensagem: 'DataValidade inválida' });
                dadosAtualizados.dataValidade = d;
            }
            const produtoAtualizado = await Produto.findByIdAndUpdate(id, dadosAtualizados, {
                new: true,
            });
            if (!produtoAtualizado) {
                return reply.status(404).send({ mensagem: 'Produto não encontrado' });
            }
            const produtoObj = produtoAtualizado.toObject();
            const produtoFormatado = {
                ...produtoObj,
                dataFabricado: produtoObj.dataFabricado.toISOString(),
                dataValidade: produtoObj.dataValidade.toISOString(),
            };
            return reply.status(200).send({
                mensagem: 'Produto alterado com sucesso!',
                produto: produtoFormatado,
            });
        }
        catch (err) {
            console.error('Erro ao alterar produto:', err);
            return reply.status(500).send({ mensagem: 'Erro ao alterar produto', erro: err.message });
        }
    });
    fastify.delete('/produto/:id', {
        schema: {
            params: produtoParamsSchema,
            response: {
                200: z.object({ mensagem: z.string() }),
                400: z.object({ mensagem: z.string(), erro: z.string().optional() }),
            },
        },
    }, async (request, reply) => {
        const { id } = request.params;
        if (!id) {
            return reply.status(400).send({ mensagem: 'ID Não encontrado...' });
        }
        try {
            await Produto.findByIdAndDelete(id);
            reply.status(200).send({ mensagem: 'Produto deletado com sucesso!!' });
        }
        catch (err) {
            console.error('Erro ao deletar produto:', err);
            reply.status(400).send({ mensagem: 'Erro ao deletar o produto', erro: err.message });
        }
    });
}
