"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
// Instância do Kysely tipada com a interface Database
const db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({
        pool: new Pool({
            database: 'MED.IQ_ForumSystem',
            host: 'localhost',
            user: 'postgres',
            password: 'root'
        })
    })
});
exports.default = db;
