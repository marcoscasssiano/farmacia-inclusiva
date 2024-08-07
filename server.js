const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = process.env.USERADMIN;
const PASSWORD = process.env.PASSWORD;
console.log(process.env.BASE_URL)
console.log(USERNAME, PASSWORD);

let isAuthenticated = false;

const resetAuthentication = () => {
    isAuthenticated = false;
    console.log('Autenticação expirada');
};

let authenticationTimer = setTimeout(resetAuthentication, 15 * 60 * 1000);

const authenticate = (req, res, next) => {
    if (isAuthenticated) {
        clearTimeout(authenticationTimer);
        authenticationTimer = setTimeout(resetAuthentication, 15 * 60 * 1000);
        next();
    } else {
        res.sendStatus(401);
    }
};

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        isAuthenticated = true;
        clearTimeout(authenticationTimer);
        authenticationTimer = setTimeout(resetAuthentication, 15 * 60 * 1000);
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.use(express.static('pages'));

const clienteRoutes = require('./middleware/cliente');
const prescricaoRoutes = require('./middleware/prescricao');
const mandaPrescricao = require('./middleware/mandaPrescricao')

app.use('/middleware/mandaPrescricao', mandaPrescricao);
app.use('/middleware/cliente', authenticate, clienteRoutes);
app.use('/middleware/prescricao', authenticate, prescricaoRoutes);

const dbPath = path.resolve(__dirname, '.', 'db', 'database.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        telefone NUMBER PRIMARY KEY, 
        nome TEXT NOT NULL, 
        cpf NUMBER, 
        email TEXT, 
        sexo TEXT, 
        nascimento DATE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS prescricoes (
        telefone_cliente NUMBER PRIMARY KEY,
        nome_cliente TEXT, data_inicio DATE,
        data_fim DATE, receber_sms BOOLEAN,
        receber_whatsapp BOOLEAN, descricao TEXT,
        enviado BOOLEAN
    )`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/cliente', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cliente.html'));
});

app.get('/prescricao', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'prescricao.html'));
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});