const { Pool } = require('pg');

class Db {
    static instance;
    constructor(options) {
        this.pool = new Pool({
            user: options.user,  
            password: options.password,  
            port: options.port,  
            host: options.host, 
            database: options.database 
        });
    }
    static getInstance() {
        if (!Db.instance) {
            const options = {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
                host: process.env.DB_HOST,
                database: process.env.DB_DATABASE
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
            console.log(`Error on query: ${error}`.red);
            throw error;
        }
    }
    async transaction(callback) {
        const client = await this.pool.connect();
        let isTransactionSuccessfully = false;
        let result; 
    
        try {
            console.log("Starting transaction...");
            await client.query('BEGIN');
            
            await callback(client);

            await client.query('COMMIT');
            isTransactionSuccessfully = true;
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error(`Error on transaction: ${error}`.red);
            throw error; 
        } finally {
            client.release();
            if (isTransactionSuccessfully) {
                console.log('Transaction committed successfully!');
            } else {
                console.log('Transaction was rolled back!'.red);
                return null;  
            }
        }
    }
    
}

const db = Db.getInstance();
const dbPool = db.getPool();

module.exports = {
    db,
    dbPool
}; 