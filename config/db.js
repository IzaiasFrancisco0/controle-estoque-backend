
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log('Conexão ao MongoDB estabelecida');
    return conn;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

export default connectDB;
