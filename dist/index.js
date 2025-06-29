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
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carrega as variáveis de ambiente
const Produtos_js_1 = __importDefault(require("./routes/Produtos.js"));
const AuthRoute_js_1 = __importDefault(require("./routes/AuthRoute.js"));
const Conta_js_1 = __importDefault(require("./routes/Conta.js"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, fastify_1.default)().withTypeProvider();
        // Configura Zod
        app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
        app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
        // Habilita CORS apenas para o frontend
        yield app.register(cors_1.default, {
            origin: 'http://localhost:5173',
            credentials: true, // NÃO vamos mais usar cookies
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // garanta que PUT e DELETE estejam aqui
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
        // Registra rotas
        yield app.register(Produtos_js_1.default);
        yield app.register(AuthRoute_js_1.default);
        yield app.register(Conta_js_1.default);
        try {
            yield mongoose_1.default.connect(process.env.DATABASE_URL);
            console.log('✅ Conectado ao MongoDB');
            app.listen({ port: 5000, host: '0.0.0.0' }, (err) => {
                if (err) {
                    console.error('Erro ao iniciar servidor:', err);
                    process.exit(1);
                }
                console.log('🚀 Servidor rodando em http://localhost:5000');
            });
        }
        catch (err) {
            console.error('❌ Erro ao conectar ao MongoDB:', err);
        }
    });
}
main();
