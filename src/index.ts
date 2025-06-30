import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import mongoose from 'mongoose';
import { validatorCompiler, serializerCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import dotenv from 'dotenv';
dotenv.config();

import routes from './routes/Produtos.js';
import AuthRoute from './routes/AuthRoute.js';
import Conta from './routes/Conta.js';

async function main() {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifyCors, {
    origin: 'https://controle-estoque-frontend-theta.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.register(routes);
  await app.register(AuthRoute);
  await app.register(Conta);

  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('✅ Conectado ao MongoDB');

    app.listen({ port: 5000, host: '0.0.0.0' }, (err) => {
      if (err) {
        console.error('Erro ao iniciar servidor:', err);
        process.exit(1);
      }
      console.log('Servidor rodando em http://localhost:5000');
    });
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
  }
}

main();
