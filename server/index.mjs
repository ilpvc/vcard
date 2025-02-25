// Step 1: Import required modules using ES6 imports
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as person from './sql/person.mjs'; 

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'v-card',
    waitForConnections: true, // Wait for available connection if the pool is full
    connectionLimit: 10, // Maximum number of connections in the pool
    queueLimit: 0 // Unlimited queue length for waiting connections
};

let pool;

// 创建连接池
function createPool() {
    pool = mysql.createPool(dbConfig);

    pool.on('acquire', (connection) => {
        console.log('Connection %d acquired', connection.threadId);
    });

    pool.on('release', (connection) => {
        console.log('Connection %d released', connection.threadId);
    });

    // 检查连接池中的连接是否健康
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error acquiring connection:', err);
            setTimeout(createPool, 5000); // 连接失败时重试
        } else {
            console.log('Pool connected, connection is live');
            connection.release(); // 使用后释放连接
        }
    });
}

createPool();

// 获取一个连接并执行查询
function queryDatabase(query, params, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return callback(err);
        }

        connection.query(query, params, (queryErr, results) => {
            connection.release(); // 查询完成后释放连接
            if (queryErr) {
                console.error('Error executing query:', queryErr);
                return callback(queryErr);
            }
            callback(null, results);
        });
    });
}

// Step 5: Define CRUD routes for a table (e.g., "person")

// Get all records
app.get('/person/:code', (req, res) => {
    const { code } = req.params;
    const query = `SELECT * FROM v_person where code = '${code}'`;
    queryDatabase(query, [], (err, results) => {
        if (err) {
            console.error('Error fetching person data:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results[0] || {});
        }
    });
});

// Create a new record
app.post('/person/add', (req, res) => {
    console.log(req.body);
    const personData = req.body;
    const query = person.addPerson();
    const { params, code } = person.getParam(personData);
    const userQuerySQL = `select * from v_user where user_id = ? and email = ?`;

    queryDatabase(userQuerySQL, [personData.employ_number, personData.email], (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        } else {
            const user = results[0];
            if (user) {
                queryDatabase(query, params, (err, result) => {
                    if (err) {
                        console.error('Error creating user:', err);
                        res.status(500).send('Error creating user');
                    } else {
                        res.status(201).json({
                            id: result.insertId,
                            message: 'success',
                            code: code
                        });
                    }
                });
            } else {
                res.status(200).json({
                    message: '非授权人员，无法创建',
                    code: 406
                });
            }
        }
    });
});

// Step 6: Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

