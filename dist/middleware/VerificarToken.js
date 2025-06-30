import jwt from 'jsonwebtoken';
function isJwtPayloadCustom(payload) {
    return (typeof payload === 'object' &&
        payload !== null &&
        'usuario' in payload &&
        typeof payload.usuario === 'string');
}
async function verifyToken(request, reply) {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({ mensagem: 'Token não encontrado, faça login' });
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!isJwtPayloadCustom(decoded)) {
            return reply.status(401).send({ mensagem: 'Token malformado' });
        }
        request.user = decoded;
        return true;
    }
    catch (err) {
        return reply.status(401).send({ mensagem: 'Token inválido ou expirado' });
    }
}
export default verifyToken;
