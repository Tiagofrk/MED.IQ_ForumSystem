# MED.IQ_ForumSystem
Sistema que permite a interação entre usuários e moderadores através de funcionalidades essenciais, como cadastro de usuários, criação de postagens, gerenciamento de grupos e administração de conteúdo.

MED.IQ_ForumSystem
Versão: 1.0.0

Descrição
O MED.IQ_ForumSystem é um sistema que permite a interação entre usuários e moderadores através de funcionalidades essenciais, como cadastro de usuários, criação de postagens, gerenciamento de grupos e administração de conteúdo.

Funcionalidades Principais
Cadastro de usuários
Criação de postagens
Gerenciamento de grupos
Administração de conteúdo
Tecnologias Utilizadas
O projeto utiliza um conjunto moderno de ferramentas para desenvolvimento web:

Hono: Framework para criação de servidores rápidos e minimalistas.
tRPC: Framework para comunicação entre cliente e servidor via RPC, com forte tipagem em TypeScript.
Kysely: Biblioteca de consultas SQL tipadas.
PostgreSQL: Banco de dados relacional utilizado.
React: Biblioteca JavaScript para criação de interfaces de usuário.
TypeScript: Superset do JavaScript que adiciona tipagem estática ao código.
Zod: Biblioteca de validação de esquemas e parsing.
Pré-requisitos
Antes de rodar a aplicação, certifique-se de ter as seguintes dependências instaladas em sua máquina:

Node.js (v16 ou superior)
PostgreSQL
Instalação
Para instalar as dependências do projeto, execute:

bash
Copiar código
npm install
Este comando instala todas as bibliotecas listadas nas seções dependencies e devDependencies do arquivo package.json. Isso inclui bibliotecas de produção como react, hono, kysely e pg, além de ferramentas de desenvolvimento como typescript e ts-node-dev.

Scripts
No arquivo package.json, estão definidos três scripts principais:

start:

bash
Copiar código
npm run start
Este comando faz a transpilação do código TypeScript para JavaScript utilizando o tsc (TypeScript Compiler) e, em seguida, inicia o servidor com o arquivo dist/index.js. Deve ser usado em ambientes de produção.

dev:

bash
Copiar código
npm run dev
Utiliza o ts-node-dev para rodar o servidor em modo de desenvolvimento. Ele recompila o código automaticamente sempre que alterações são feitas. Isso é útil para agilizar o desenvolvimento, pois evita a necessidade de compilar manualmente a cada mudança.

test:

bash
Copiar código
npm run test
Por enquanto, este script apenas exibe uma mensagem de erro, já que nenhum teste foi configurado no projeto.

Como Executar
Instale as dependências:

bash
Copiar código
npm install
Inicie o servidor em modo de desenvolvimento:

bash
Copiar código
npm run dev
Isso iniciará o servidor, que será automaticamente recarregado sempre que houver mudanças no código.

Para iniciar em modo de produção:

bash
Copiar código
npm run start
Isso compilará o código TypeScript para JavaScript e iniciará o servidor em um ambiente de produção.

Dependências de Produção
As seguintes bibliotecas serão instaladas para que o sistema funcione corretamente:

@hono/node-server: Servidor Node para o framework Hono.
@trpc/client: Biblioteca cliente para tRPC, usada para chamadas RPC do front-end.
@trpc/react: Integração do tRPC com o React.
@trpc/server: Biblioteca do servidor tRPC para comunicação tipada.
hono: Framework web minimalista e rápido.
kysely: Biblioteca SQL tipada para consultas ao banco de dados.
pg: Driver do PostgreSQL.
react e react-dom: Bibliotecas para a criação de interfaces de usuário.
reflect-metadata: Suporte para metadados, necessário para decorators em TypeScript.
trpc: Framework RPC.
typescript: Linguagem usada para tipagem estática no JavaScript.
zod: Biblioteca para validação e parsing de esquemas.
Dependências de Desenvolvimento
Estas ferramentas são instaladas para auxiliar o desenvolvimento:

@types/node: Tipagens para Node.js.
@types/react: Tipagens para React.
ts-node: Ferramenta para rodar código TypeScript diretamente no Node.js.
ts-node-dev: Similar ao ts-node, mas com recarga automática em caso de mudanças no código.
Licença
ISC
