import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  usuario: string;
  senha: string;
}

interface IUserDocument extends IUser, Document {
  comparePassword(senha: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema<IUserDocument>({
  usuario: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
});

userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('senha')) return next();

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

userSchema.methods.comparePassword = async function (senha: string): Promise<boolean> {
  return bcrypt.compare(senha, this.senha);
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
