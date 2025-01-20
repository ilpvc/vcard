// Step 1: Import required modules using ES6 imports
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as person from './sql/person.mjs'; // 修改为 .mjs 扩展名

// Step 2: Initialize express app
const app = express();
const port = 3000;

// Step 3: Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Step 4: Setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // Replace with your MySQL password
    database: 'v-card' // Replace with your MySQL database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Step 5: Define CRUD routes for a table (e.g., "users")

// Get all records
app.get('/person/:code', (req, res) => {
    const { code } = req.params;
    const query = `SELECT * FROM v_person where code = '${code}'`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(results[0] || {});
        }
    });
});

// // Get a single record by ID
// app.get('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const query = 'SELECT * FROM users WHERE id = ?';
//     db.query(query, [id], (err, results) => {
//         if (err) {
//             console.error('Error fetching user:', err);
//             res.status(500).send('Error fetching user');
//         } else {
//             res.json(results[0] || {});
//         }
//     });
// });

// Create a new record
app.post('/person/add', (req, res) => {
    console.log(req.body);
    const personData = req.body;
    const query = person.addPerson();
    const { params, code } = person.getParam(personData);
    db.query(query, params, (err, result) => {
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
});

// // Update a record by ID
// app.put('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const { name, email } = req.body;
//     const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
//     db.query(query, [name, email, id], (err, result) => {
//         if (err) {
//             console.error('Error updating user:', err);
//             res.status(500).send('Error updating user');
//         } else {
//             res.send('User updated successfully');
//         }
//     });
// });

// // Delete a record by ID
// app.delete('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const query = 'DELETE FROM users WHERE id = ?';
//     db.query(query, [id], (err, result) => {
//         if (err) {
//             console.error('Error deleting user:', err);
//             res.status(500).send('Error deleting user');
//         } else {
//             res.send('User deleted successfully');
//         }
//     });
// });

// Step 6: Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
