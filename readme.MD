# Node et Express

## Creer un dossier node-express-pg

### Initialiser un depot git et creer le fichier .gitignore

`git init`

### creer le fichier .gitignore et y ajouter :

```
node_modules
.env
```

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
    console.log(`Example app listening on port http://localhost:${port}`)
})
```

### Dans le terminal, taper cette commande pour lancer le serveur:

`node index.js`

### Ou alors, on installe nodemon

`npm i nodemon`

puis on peut modifier la partie script de package.json
```json
"scripts": {
    "start": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```



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

### Creer une route qui recoit des données venant du client
```js
app.post('/todos', async (req, res) => {
    console.log(req.body);

    try
    {
        const name = req.body.name;

        const data = await client.query('INSERT INTO tablename (name) VALUES ($1)', [name]);

        res.json(data.rows);
    } 
    catch (err)
    {
        console.log(err.stack)
    }
})

```

### Pour creer une requete avec un parametre

```js
app.get('/games/:id', async (req, res) =>
{
    console.log(req.params)
    const id = req.params.id;

    try
    {
        const data = await client.query('SELECT * FROM tablename where id = $1', [id]);

        res.json(data.rows);
    } 
    catch (err)
    {
        console.log(err.stack)
    }
})
```
## Pour masquer les infos de connexion de postgreSQL dans le code

### creer un fichier .env avec ce contenu (en completant les informations)
```
DB_HOST='localhost'
DB_PORT=5432
DB_USERNAME=''
DB_PASSWORD=''
DB_NAME=''
```

### Pour utiliser ce fichier il faut module dotenv

`npm i dotenv`

### puis dans index.js
```
// imports
// ...
require('dotenv').config()
```

### et modifier

```js
const client = new Client({
    user: '',
    host: 'localhost',
    database: '', 
    password: '',
    port: 5432,
});
```

### EN

```js
const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: 5432,
});
```

## Executer un fichier sql
### Ces script sql peuvent servir a creer des tables, inserer de la data, etc etc
### En general on les lance que au besoin
```js
// imports
// ...
const fs = require('fs'); // permet a node de lire des fichiers

// declarations
// ...
const scriptSql = fs.readFileSync('./sql/script.sql').toString();
client.query(scriptSql);
```
