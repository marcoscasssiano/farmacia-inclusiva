const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = process.env.USERADMIN;
const PASSWORD = process.env.PASSWORD;

console.log(USERNAME, PASSWORD);

// Variável de sessão para controlar o status de autenticação
let isAuthenticated = false;

// Função para definir isAuthenticated como false após 15 minutos
const resetAuthentication = () => {
    isAuthenticated = false;
    console.log('Autenticação expirada');
};

// Definir temporizador para redefinir a autenticação após 15 minutos (em milissegundos)
let authenticationTimer = setTimeout(resetAuthentication, 15 * 60 * 1000);

// Middleware para autenticar as rotas privadas
const authenticate = (req, res, next) => {
    if (isAuthenticated) {
        // Reiniciar o temporizador quando a autenticação é bem-sucedida
        clearTimeout(authenticationTimer);
        authenticationTimer = setTimeout(resetAuthentication, 15 * 60 * 1000);
        next(); // Continue para a próxima rota se a autenticação for bem-sucedida
    } else {
        res.sendStatus(401); // Não autorizado
    }
};

// Middleware para lidar com JSON
app.use(express.json());

// Rota para o login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        isAuthenticated = true; // Definir autenticação como verdadeira
        // Reiniciar o temporizador quando o login é bem-sucedido
        clearTimeout(authenticationTimer);
        authenticationTimer = setTimeout(resetAuthentication, 15 * 60 * 1000);
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.use(express.static('pages'));

const clienteRoutes = require('./api/cliente');
const prescricaoRoutes = require('./api/prescricao');
const eventosRoutes = require('./api/eventos')

app.use('/api/cliente', authenticate, clienteRoutes);
app.use('/api/prescricao', authenticate, prescricaoRoutes);
app.use('/api/eventos', authenticate, eventosRoutes);

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

    db.run(`CREATE TABLE IF NOT EXISTS eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imagem BLOB,
        data_inicio DATE,
        data_fim DATE,
        receber_sms BOOLEAN,
        receber_whatsapp BOOLEAN,
        descricao TEXT
    )`);
});

// Rota para renderizar a página HTML quando acessar /cliente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/cliente', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cliente.html'));
});

app.get('/prescricao', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'prescricao.html'));
});

app.get('/eventos', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'eventos.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
