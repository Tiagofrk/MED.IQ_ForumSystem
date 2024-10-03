"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const pg_1 = require("pg");
// Instância do Kysely tipada com a interface Database
const db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({
        pool: new pg_1.Pool({
            database: 'MED.IQ_ForumSystem',
            host: 'localhost',
            user: 'postgres',
            password: 'root'
        })
    })
});
exports.default = db;
