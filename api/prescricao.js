const express = require('express');
const router = express.Router();

// Middleware para lidar com JSON
router.use(express.json());

// Caminho para o banco de dados SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../', 'db', 'database.db'); // Supondo que o arquivo database.db esteja um diretório acima, conferir como funciona no render

// Banco de dados SQLite
const db = new sqlite3.Database(dbPath);

// Rotas CRUD para prescrições
// Create
router.post('/', (req, res) => {
    const { nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao } = req.body;
    db.run(`INSERT INTO prescricoes (nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao) VALUES (?, ?, ?, ?, ?, ?)`, [nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            nome_cliente: nome_cliente,
            data_inicio: data_inicio,
            data_fim: data_fim,
            receber_sms: receber_sms,
            receber_whatsapp: receber_whatsapp,
            descricao: descricao
        });
    });
});

// Read
router.get('/', (req, res) => {
    db.all("SELECT * FROM prescricoes", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Update
router.put('/:id', (req, res) => {
    const { nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao } = req.body;
    const { id } = req.params;
    db.run(`UPDATE prescricoes SET nome_cliente = ?, data_inicio = ?, data_fim = ?, receber_sms = ?, receber_whatsapp = ?, descricao = ? WHERE id = ?`, [nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: id,
            nome_cliente: nome_cliente,
            data_inicio: data_inicio,
            data_fim: data_fim,
            receber_sms: receber_sms,
            receber_whatsapp: receber_whatsapp,
            descricao: descricao
        });
    });
});

// Delete
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM prescricoes WHERE id = ?`, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Prescrição deletada com sucesso!' });
    });
});

module.exports = router;
