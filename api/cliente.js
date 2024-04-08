const express = require('express');
const router = express.Router();

// Middleware para lidar com JSON
router.use(express.json());

// Caminho para o banco de dados SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '..', 'database.db'); // Supondo que o arquivo database.db esteja um diretório acima

// Banco de dados SQLite
const db = new sqlite3.Database(dbPath);

// Rotas CRUD para clientes
// Create
router.post('/', (req, res) => {
    const { nome, telefone } = req.body;
    db.run(`INSERT INTO clientes (nome, telefone) VALUES (?, ?)`, [nome, telefone], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            nome: nome,
            telefone: telefone
        });
    });
});

// Read
router.get('/', (req, res) => {
    db.all("SELECT * FROM clientes", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Update
router.put('/:id', (req, res) => {
    const { nome, telefone } = req.body;
    const { id } = req.params;
    db.run(`UPDATE clientes SET nome = ?, telefone = ? WHERE id = ?`, [nome, telefone, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: id,
            nome: nome,
            telefone: telefone
        });
    });
});

// Delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM clientes WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Cliente deletado com sucesso!' });
    });
});

module.exports = router;
