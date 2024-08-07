const express = require('express');
const router = express.Router();

router.use(express.json());

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../', 'db', 'database.db'); 
const db = new sqlite3.Database(dbPath);

router.post('/', (req, res) => {
    const { telefone_cliente, nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao } = req.body;
    db.run(`INSERT INTO prescricoes (telefone_cliente, nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao) VALUES (?, ?, ?, ?, ?, ?, ?)`, [telefone_cliente, nome_cliente, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            telefone_cliente: telefone_cliente,
            nome_cliente: nome_cliente,
            data_inicio: data_inicio,
            data_fim: data_fim,
            receber_sms: receber_sms,
            receber_whatsapp: receber_whatsapp,
            descricao: descricao
        });
    });

});

router.get('/', (req, res) => {
    db.all("SELECT * FROM prescricoes", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

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

router.delete('/:telefone_cliente', (req, res) => {
    const { telefone_cliente } = req.params;
    db.run(`DELETE FROM prescricoes WHERE telefone_cliente = ?`, telefone_cliente, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Prescrição deletada com sucesso!' });
    });
});
module.exports = router;
