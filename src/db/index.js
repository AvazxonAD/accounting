const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

class Db {
    static instance;

    constructor(options) {
        this.pool = new Pool({
            user: options.user,
            password: options.password,
            port: options.port,
            host: options.host,
            database: options.database,
        });
    }

    static getInstance() {
        if (!Db.instance) {
            const options = {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
                host: process.env.DB_HOST,
                database: process.env.DB_DATABASE,
            };
            Db.instance = new Db(options);
        }
        return Db.instance;
    }

    getPool() {
        return this.pool;
    }

    async query(query, params) {
        try {
            const results = await this.pool.query(query, params);
            return results.rows;
        } catch (error) {
            console.error(`Error on query: ${error.message}`.red);
            throw error;
        }
    }

    async transaction(callback) {
        const client = await this.pool.connect();
        let isTransactionSuccessfully = false;
        try {
            console.log("Starting transaction...");
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            isTransactionSuccessfully = true;
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error(`Error on transaction: ${error.message}`.red);
            throw error;
        } finally {
            client.release();
            if (isTransactionSuccessfully) {
                console.log('Transaction committed successfully!');
            } else {
                console.log('Transaction was rolled back!'.red);
            }
        }
    }

    static async connectDB() {
        const db = Db.getInstance();
        const dbPool = db.getPool();  // Use the instance's pool
        await db.query(`
            CREATE TABLE IF NOT EXISTS "migrations"
            (
                "id"        SERIAL PRIMARY KEY NOT NULL,
                "version"   SERIAL  NOT NULL,
                "file_name" VARCHAR NOT NULL UNIQUE
            );
        `);
        const folderPath = path.join(__dirname, './migrations');
        const files = fs.readdirSync(folderPath);
        const sqlFiles = files.filter(file => file.endsWith('.sql'));

        if (sqlFiles.length === 0) {
            throw new Error('No .sql files found in the directory');
        }

        const latestFile = sqlFiles[sqlFiles.length - 1];

        const version = await db.query(`SELECT * FROM migrations ORDER BY id DESC LIMIT 1`);

        if (!version[0] || version[0].file_name !== latestFile) {
            const client = await dbPool.connect();
            try {
                await client.query('BEGIN');
                await client.query(`INSERT INTO migrations(file_name) VALUES($1)`, [latestFile]);
                const filePath = `${folderPath}/${latestFile}`;
                const sqlQuery = await fs.promises.readFile(filePath, 'utf-8');
                await client.query(sqlQuery);
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                throw new Error(error);
            } finally {
                client.release();
            }
        }
        return { db, dbPool };
    }
}

module.exports = (async () => {
    try {
        const { db, dbPool } = await Db.connectDB();
        console.log('Connect DB'.blue);
        return { db, dbPool };
    } catch (error) {
        console.error(`Error db connect: error.message`.red);
        throw new Error(error);
    }
})();
