const express = require('express');
const router = express.Router();

// Middleware para lidar com JSON
router.use(express.json());

// Caminho para o banco de dados SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../', 'db', 'database.db'); // Supondo que o arquivo database.db esteja um diretório acima

// Banco de dados SQLite
const db = new sqlite3.Database(dbPath);

// Rotas CRUD para produtos
// Create
router.post('/', (req, res) => {
    const { nome, tipo_uso, informacoes } = req.body;
    db.run(`INSERT INTO produtos (nome, tipo_uso, informacoes) VALUES (?, ?, ?)`, [nome, tipo_uso, informacoes], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            nome: nome,
            tipo_uso: tipo_uso,
            informacoes: informacoes
        });
    });
});

// Read
router.get('/', (req, res) => {
    db.all("SELECT * FROM produtos", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Update
router.put('/:id', (req, res) => {
    const { nome, tipo_uso, informacoes } = req.body;
    const { id } = req.params;
    db.run(`UPDATE produtos SET nome = ?, tipo_uso = ?, informacoes = ? WHERE id = ?`, [nome, tipo_uso, informacoes, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: id,
            nome: nome,
            tipo_uso: tipo_uso,
            informacoes: informacoes
        });
    });
});

// Delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM produtos WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Produto deletado com sucesso!' });
    });
});

module.exports = router;
