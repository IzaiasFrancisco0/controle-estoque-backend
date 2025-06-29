"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const Produto_js_1 = __importDefault(require("../models/Produto.js"));
const zod_1 = require("zod");
function routes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        const produtoSchema = zod_1.z.object({
            nome: zod_1.z.string(),
            preco: zod_1.z.number(),
            dataFabricado: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), {
                message: 'Data de fabricação inválida',
            }),
            dataValidade: zod_1.z.string().refine(val => !isNaN(Date.parse(val)), {
                message: 'Data de validade inválida',
            }),
            imagem: zod_1.z.string(),
            categoria: zod_1.z.string(),
            quantidade: zod_1.z.number(),
        });
        const produtoParamsSchema = zod_1.z.object({
            id: zod_1.z.string(),
        });
        fastify.get('/', (_request, reply) => __awaiter(this, void 0, void 0, function* () {
            const listarProdutos = yield Produto_js_1.default.find();
            reply.send(listarProdutos);
        }));
        fastify.post('/cadastrar', {
            schema: {
                body: produtoSchema,
                response: {
                    201: zod_1.z.object({ mensagem: zod_1.z.string() }),
                    400: zod_1.z.object({ mensagem: zod_1.z.string() }),
                    500: zod_1.z.object({ mensagem: zod_1.z.string(), erro: zod_1.z.string().optional() }),
                },
            },
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { nome, preco, dataFabricado, dataValidade, imagem, categoria, quantidade, } = request.body;
            try {
                const fabricado = new Date(dataFabricado);
                const validade = new Date(dataValidade);
                if (isNaN(fabricado.getTime()) || isNaN(validade.getTime())) {
                    return reply.status(400).send({ mensagem: 'Datas inválidas' });
                }
                const produto = new Produto_js_1.default({
                    nome,
                    preco,
                    dataFabricado: fabricado,
                    dataValidade: validade,
                    imagem,
                    categoria,
                    quantidade,
                });
                yield produto.save();
                return reply.status(201).send({ mensagem: 'Produto cadastrado com sucesso!!' });
            }
            catch (err) {
                console.error('🔥 ERRO AO SALVAR PRODUTO:', err);
                return reply.status(500).send({
                    mensagem: 'Erro ao cadastrar produto',
                    erro: (_a = err.message) !== null && _a !== void 0 ? _a : 'Erro desconhecido',
                });
            }
        }));
        fastify.put('/produto/:id', {
            schema: {
                params: produtoParamsSchema,
                body: produtoSchema.partial(),
                response: {
                    200: zod_1.z.object({
                        mensagem: zod_1.z.string(),
                        produto: produtoSchema.optional(),
                    }),
                    400: zod_1.z.object({ mensagem: zod_1.z.string() }),
                    404: zod_1.z.object({ mensagem: zod_1.z.string() }),
                },
            },
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
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
                const produtoAtualizado = yield Produto_js_1.default.findByIdAndUpdate(id, dadosAtualizados, {
                    new: true,
                });
                if (!produtoAtualizado) {
                    return reply.status(404).send({ mensagem: 'Produto não encontrado' });
                }
                const produtoObj = produtoAtualizado.toObject();
                const produtoFormatado = Object.assign(Object.assign({}, produtoObj), { dataFabricado: produtoObj.dataFabricado.toISOString(), dataValidade: produtoObj.dataValidade.toISOString() });
                return reply.status(200).send({
                    mensagem: 'Produto alterado com sucesso!',
                    produto: produtoFormatado,
                });
            }
            catch (err) {
                console.error('Erro ao alterar produto:', err);
                return reply.status(500).send({ mensagem: 'Erro ao alterar produto', erro: err.message });
            }
        }));
        fastify.delete('/produto/:id', {
            schema: {
                params: produtoParamsSchema,
                response: {
                    200: zod_1.z.object({ mensagem: zod_1.z.string() }),
                    400: zod_1.z.object({ mensagem: zod_1.z.string(), erro: zod_1.z.string().optional() }),
                },
            },
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            if (!id) {
                return reply.status(400).send({ mensagem: 'ID Não encontrado...' });
            }
            try {
                yield Produto_js_1.default.findByIdAndDelete(id);
                reply.status(200).send({ mensagem: 'Produto deletado com sucesso!!' });
            }
            catch (err) {
                console.error('Erro ao deletar produto:', err);
                reply.status(400).send({ mensagem: 'Erro ao deletar o produto', erro: err.message });
            }
        }));
    });
}
