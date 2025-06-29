import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  preco: {
    type: Number,
    required: true,
  },
  dataFabricado: {
    type: Date,
    required: true,
  },
  dataValidade: {
    type: Date,
    required: true,
  },
  imagem: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  quantidade: {
    type: Number,
    required: true,
  }
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;