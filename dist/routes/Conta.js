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
const Senha_js_1 = __importDefault(require("../models/Senha.js"));
const Conta = (fastify, _opts) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get('/conta', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conta = yield Senha_js_1.default.findOne({});
            if (!conta) {
                return reply.status(404).send({ mensagem: 'Nenhuma senha cadastrada.' });
            }
            reply.send({ senha: conta.novaSenha || conta.senha });
        }
        catch (error) {
            console.error(error);
            reply.status(500).send({ mensagem: 'Erro ao buscar senha.' });
        }
    }));
    fastify.post('/conta', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { novaSenha, senha } = request.body;
        if (!novaSenha || !senha) {
            reply.status(401).send({ mensagem: 'Campos obrigatórios ausentes' });
            return;
        }
        try {
            const registroExistente = yield Senha_js_1.default.findOne();
            if (!registroExistente) {
                const nova = new Senha_js_1.default({ senha, novaSenha });
                yield nova.save();
                return reply.status(201).send({ mensagem: 'Senha cadastrada com sucesso.' });
            }
            if (registroExistente.senha !== senha) {
                return reply.status(401).send({ mensagem: 'Senha atual incorreta.' });
            }
            registroExistente.senha = novaSenha;
            registroExistente.novaSenha = novaSenha;
            yield registroExistente.save();
            return reply.status(200).send({ mensagem: 'Senha atualizada com sucesso.' });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ mensagem: 'Erro no servidor.' });
        }
    }));
    fastify.delete('/conta/resetar', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Senha_js_1.default.deleteMany({});
            reply.send({ mensagem: 'Senha(s) resetada(s) com sucesso.' });
        }
        catch (error) {
            console.error(error);
            reply.status(500).send({ mensagem: 'Erro ao resetar as senhas.' });
        }
    }));
});
exports.default = Conta;
