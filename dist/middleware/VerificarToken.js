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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isJwtPayloadCustom(payload) {
    return (typeof payload === 'object' &&
        payload !== null &&
        'usuario' in payload &&
        typeof payload.usuario === 'string');
}
function verifyToken(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Pega token do header Authorization: Bearer <token>
            const authHeader = request.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return reply.status(401).send({ mensagem: 'Token não encontrado, faça login' });
            }
            const token = authHeader.substring(7); // remove 'Bearer '
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!isJwtPayloadCustom(decoded)) {
                return reply.status(401).send({ mensagem: 'Token malformado' });
            }
            request.user = decoded; // Tipagem reconhecida
            return true;
        }
        catch (err) {
            return reply.status(401).send({ mensagem: 'Token inválido ou expirado' });
        }
    });
}
exports.default = verifyToken;
