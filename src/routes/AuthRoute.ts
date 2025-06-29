import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

type LoginType = {
  usuario: string;
  senha: string;
};

async function AuthRoute(fastify: FastifyInstance) {
  // Rota de login simples (sem token)
  fastify.post('/login', async (request: FastifyRequest<{ Body: LoginType }>, reply: FastifyReply) => {
    const { usuario, senha } = request.body;

    const usuarioValido = 'izaias25';
    const senhaValida = '92423542';

    if (usuario === usuarioValido && senha === senhaValida) {
      return reply.send({ mensagem: 'Login realizado com sucesso!' });
    } else {
      return reply.status(401).send({ mensagem: 'Usuário ou senha inválidos!' });
    }
  });

  // Rota pública de teste (sem verificação de token)
  fastify.get('/produtos', async (request, reply: FastifyReply) => {
    reply.send({ mensagem: 'Acesso autorizado ao perfil! (sem token)' });
  });
}

export default AuthRoute;
