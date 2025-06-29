"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const produtoSchema = new mongoose_1.default.Schema({
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
const Produto = mongoose_1.default.model('Produto', produtoSchema);
exports.default = Produto;
