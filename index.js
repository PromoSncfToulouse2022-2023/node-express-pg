// imports
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const fs = require('fs');


// declarations
const app = express();
const port = 8000;
const client = new Client({
    user: '',
    host: 'localhost',
    database: '',
    password: '',
    port: 5432,
});

client.connect();

// for parsing application/json
app.use(bodyParser.json());

// Add headers before the routes are defined
app.use(function (req, res, next)
{

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// const structure = fs.readFileSync('./sql/structure.sql').toString();
// const data = fs.readFileSync('./sql/data.sql').toString();
// console.log(structure);
// client.query(data);

// routes
app.get('/', (req, res) =>
{
    res.send('Hello World!')
})


/**
 * Return all the todos
 */
app.get('/games', async (req, res) =>
{
    try
    {
        const data = await client.query('SELECT * FROM games ORDER BY id');

        res.json(data.rows);
    }
    catch (err)
    {
        console.log(err.stack)
    }
})

/**
 * Return a todo by id
 */
app.get('/games/:id', async (req, res) =>
{
    console.log(req.params)
    const id = req.params.id;

    try
    {
        const data = await client.query('SELECT * FROM games where id = $1', [id]);

        res.json(data.rows);
    }
    catch (err)
    {
        console.log(err.stack)
    }
})

/**
 * Add a todo and return it
 */
app.post('/games', async (req, res) =>
{
    console.log(req.body);

    try
    {
        const name = req.body.name;

        const data = await client.query('INSERT INTO games (name, done) VALUES ($1, $2) RETURNING *', [name, false]);

        console.log(data);
        res.json(data.rows);
    }
    catch (err)
    {
        console.log(err.stack)
    }
})

/**
 * Delete a todo and return true if succesfull
 */
app.delete('/games/:id', async (req, res) =>
{
    console.log(req.params);
    const id = req.params.id;

    const data = await client.query('DELETE FROM games WHERE id = $1', [id]);

    if(data.rowCount === 1)
    {
        res.json({deleted: true});
    }
    else
    {
        res.json({deleted: false});
    }
})

/**
 * Update a todo and return true if successfull
 */
app.put('/games/:id', async (req,res) => {
    console.log(req.params);
    const id = req.params.id;

    const todo = await client.query('SELECT * FROM games WHERE id = $1', [id]);

    const data = await client.query('UPDATE games SET done = $2 WHERE id = $1', [id, !todo.rows[0].done]);

    if(data.rowCount === 1)
    {
        res.json({done: true})
    }
    else
    {
        res.json({done: false})
    }
})

// ecoute le port 8000
app.listen(port, () =>
{
    console.log(`Example app listening on port http://localhost:${port}`)
})