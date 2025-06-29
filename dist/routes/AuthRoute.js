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
Object.defineProperty(exports, "__esModule", { value: true });
function AuthRoute(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        // Rota de login simples (sem token)
        fastify.post('/login', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { usuario, senha } = request.body;
            const usuarioValido = 'izaias25';
            const senhaValida = '92423542';
            if (usuario === usuarioValido && senha === senhaValida) {
                return reply.send({ mensagem: 'Login realizado com sucesso!' });
            }
            else {
                return reply.status(401).send({ mensagem: 'Usuário ou senha inválidos!' });
            }
        }));
        // Rota pública de teste (sem verificação de token)
        fastify.get('/produtos', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            reply.send({ mensagem: 'Acesso autorizado ao perfil! (sem token)' });
        }));
    });
}
exports.default = AuthRoute;
