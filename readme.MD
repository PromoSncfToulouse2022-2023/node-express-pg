# Node et Express

## Creer un dossier node-express-pg

### Initialiser un depot git et creer le fichier .gitignore

`git init`

### Initialiser un projet node:

`npm init`

### Installer le framework express:

`npm i express`

### Creer un fichier index.js a la racine du projet et coller ce code:

```js
// imports
const express = require('express');

// declarations
const app = express();
const port = 8000;

// routes
app.get('/', (req, res) =>
{
    res.send('Hello World!')
})

app.get('/user', (req, res) =>
{
    res.send('Hello User page!')
})

// ecoute le port 8000
app.listen(port, () =>
{
    console.log(`Example app listening on port ${port}`)
})
```

### Dans le terminal, taper cette commande pour lancer le serveur:

`node index.js`


# POSTGRESQL

## Installer le client postgreSQL pour node:

`npm i pg`

### Modifier le index.js et y inclure ces lignes aux bon endroits, en complétant les infos de connexion

```js
// imports
// ...
const { Client } = require('pg');

// declarations
// ...
const client = new Client({
    user: 'username',
    host: 'localhost',
    database: 'database name', 
    password: 'password',
    port: 5432,
});

client.connect();
```

### Creer une nouvelle route qui fait une requete
```js
// routes
// ...
app.get('/mydb', async (req, res) =>
{
    try
    {
        const data = await client.query('SELECT * FROM tablename');

        res.json(data.rows);
    } 
    catch (err)
    {
        console.log(err.stack)
    }
})
```

Executer un fichier sql, BDDIX par exemple
```js
// imports
// ...
const fs = require('fs'); // permet a node de lire des fichiers

// declarations
// ...
const scriptSql = fs.readFileSync('./sql/script.sql').toString();
client.query(scriptSql);
```
