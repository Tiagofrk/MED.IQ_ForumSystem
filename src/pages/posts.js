"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreatePost;
const react_1 = __importStar(require("react"));
const trpc_1 = require("../utils/trpc");
function CreatePost() {
    const [title, setTitle] = (0, react_1.useState)('');
    const [content, setContent] = (0, react_1.useState)('');
    // Usar o hook useMutation para criar a postagem
    const createPostMutation = trpc_1.trpc.createPost.useMutation();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            yield createPostMutation.mutateAsync({ title, content });
            alert('Postagem criada com sucesso!');
            setTitle(''); // Limpar o título após criar o post
            setContent(''); // Limpar o conteúdo após criar o post
        }
        catch (error) {
            alert('Erro ao criar postagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    });
    return (<form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required/>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Conteúdo" required/>
      <button type="submit" disabled={createPostMutation.isLoading}>
        {createPostMutation.isLoading ? 'Criando...' : 'Criar Postagem'}
      </button>
      {createPostMutation.isError && (<p style={{ color: 'red' }}>Erro: {createPostMutation.error.message}</p>)}
    </form>);
}
