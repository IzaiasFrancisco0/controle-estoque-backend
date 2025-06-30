import Senha from '../models/Senha.js';
const Conta = async (fastify, _opts) => {
    fastify.get('/conta', async (request, reply) => {
        try {
            const conta = await Senha.findOne({});
            if (!conta) {
                return reply.status(404).send({ mensagem: 'Nenhuma senha cadastrada.' });
            }
            reply.send({ senha: conta.novaSenha || conta.senha });
        }
        catch (error) {
            console.error(error);
            reply.status(500).send({ mensagem: 'Erro ao buscar senha.' });
        }
    });
    fastify.post('/conta', async (request, reply) => {
        const { novaSenha, senha } = request.body;
        if (!novaSenha || !senha) {
            reply.status(401).send({ mensagem: 'Campos obrigatórios ausentes' });
            return;
        }
        try {
            const registroExistente = await Senha.findOne();
            if (!registroExistente) {
                const nova = new Senha({ senha, novaSenha });
                await nova.save();
                return reply.status(201).send({ mensagem: 'Senha cadastrada com sucesso.' });
            }
            if (registroExistente.senha !== senha) {
                return reply.status(401).send({ mensagem: 'Senha atual incorreta.' });
            }
            registroExistente.senha = novaSenha;
            registroExistente.novaSenha = novaSenha;
            await registroExistente.save();
            return reply.status(200).send({ mensagem: 'Senha atualizada com sucesso.' });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ mensagem: 'Erro no servidor.' });
        }
    });
    fastify.delete('/conta/resetar', async (request, reply) => {
        try {
            await Senha.deleteMany({});
            reply.send({ mensagem: 'Senha(s) resetada(s) com sucesso.' });
        }
        catch (error) {
            console.error(error);
            reply.status(500).send({ mensagem: 'Erro ao resetar as senhas.' });
        }
    });
};
export default Conta;
