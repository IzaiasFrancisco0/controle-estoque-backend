import mongoose from 'mongoose';
const SenhaSchema = new mongoose.Schema({
    senha: {
        type: String,
        required: true,
    },
    novaSenha: {
        type: String,
        required: true,
    },
});
const Senha = mongoose.model('Senha', SenhaSchema);
export default Senha;
