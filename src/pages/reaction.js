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
exports.default = PostList;
const react_1 = __importStar(require("react"));
const trpc_1 = require("../utils/trpc");
function PostList() {
    const { data: posts, isLoading, error } = trpc_1.trpc.listPostsWithReactions.useQuery();
    const addReactionMutation = trpc_1.trpc.addReaction.useMutation();
    const [selectedReaction, setSelectedReaction] = (0, react_1.useState)({});
    const handleReaction = (postId, reaction) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield addReactionMutation.mutateAsync({ postId, type: reaction });
            setSelectedReaction((prev) => (Object.assign(Object.assign({}, prev), { [postId]: reaction })));
            alert('Reação registrada com sucesso!');
        }
        catch (error) {
            alert('Erro ao registrar reação: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    });
    if (isLoading)
        return <p>Carregando...</p>;
    if (error)
        return <p>Erro ao carregar postagens</p>;
    return (<div>
      {posts === null || posts === void 0 ? void 0 : posts.map((post) => (<div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Reações: {post.reactions_count}</p>
          <button onClick={() => handleReaction(post.id, 'like')} disabled={selectedReaction[post.id] === 'like'}>
            Like
          </button>
          <button onClick={() => handleReaction(post.id, 'dislike')} disabled={selectedReaction[post.id] === 'dislike'}>
            Dislike
          </button>
        </div>))}
    </div>);
}
