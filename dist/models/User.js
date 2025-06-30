import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('senha'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});
userSchema.methods.comparePassword = async function (senha) {
    return bcrypt.compare(senha, this.senha);
};
const User = mongoose.model('User', userSchema);
export default User;
