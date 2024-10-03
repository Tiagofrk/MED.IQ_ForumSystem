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
exports.default = Register;
const react_1 = __importStar(require("react"));
const trpc_1 = require("../utils/trpc");
function Register() {
    const [username, setUsername] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    // Usar o hook useMutation para registrar a mutação
    const registerUserMutation = trpc_1.trpc.registerUser.useMutation();
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            yield registerUserMutation.mutateAsync({ username, email, password });
            alert('User created successfully!');
        }
        catch (error) {
            alert('Error creating user: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    });
    return (<form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"/>
      <button type="submit">Register</button>
    </form>);
}
