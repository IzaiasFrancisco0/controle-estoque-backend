import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import mongoose from 'mongoose';
import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
dotenv.config(); // Carrega as variáveis de ambiente
import routes from './routes/Produtos.js';
import AuthRoute from './routes/AuthRoute.js';
import Conta from './routes/Conta.js';
async function main() {
    const app = Fastify().withTypeProvider();
    // Configura Zod
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    // Habilita CORS apenas para o frontend
    await app.register(fastifyCors, {
        origin: 'http://localhost:5173',
        credentials: true, // NÃO vamos mais usar cookies
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // garanta que PUT e DELETE estejam aqui
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    // Registra rotas
    await app.register(routes);
    await app.register(AuthRoute);
    await app.register(Conta);
    try {
        await mongoose.connect(process.env.DATABASE_URL);
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
}
main();
