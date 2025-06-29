"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SenhaSchema = new mongoose_1.default.Schema({
    senha: {
        type: String,
        required: true,
    },
    novaSenha: {
        type: String,
        required: true,
    },
});
const Senha = mongoose_1.default.model('Senha', SenhaSchema);
exports.default = Senha;
