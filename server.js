const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = process.env.USER;
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
const produtoRoutes = require('./api/produto');
const prescricaoRoutes = require('./api/prescricao');

app.use('/api/cliente', authenticate, clienteRoutes);
app.use('/api/produto', authenticate, produtoRoutes);
app.use('/api/prescricao', authenticate, prescricaoRoutes);

const dbPath = path.resolve(__dirname, '.', 'db', 'database.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS clientes (telefone NUMBER PRIMARY KEY, nome TEXT NOT NULL, cpf NUMBER, email TEXT, sexo TEXT, nascimento DATE)");
    //db.run("CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, telefone TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, tipo_uso TEXT NOT NULL, informacoes TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS prescricoes (telefone NUMBER PRIMARY KEY, data_inicio DATE, data_fim DATE, sms BOOLEAN, app BOOLEAN, prescricao TEXT)");
    //db.run("CREATE TABLE IF NOT EXISTS prescricoes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_cliente TEXT NOT NULL, telefone_cliente TEXT NOT NULL, produto_nome TEXT, vezes_uso NUMBER NOT NULL, hora TEXT NOT_NULL)");
});

// Rota para renderizar a página HTML quando acessar /cliente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/cliente', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cliente.html'));
});

app.get('/produto', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'produto.html'));
});

app.get('/prescricao', authenticate, (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'prescricao.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
