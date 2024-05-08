const express = require('express');
const router = express.Router();
const multer = require('multer'); // Middleware para upload de arquivos
const path = require('path');

// Middleware para lidar com JSON
router.use(express.json());

// Caminho para o banco de dados SQLite
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, '../', 'db', 'database.db');

// Banco de dados SQLite
const db = new sqlite3.Database(dbPath);

// Configuração do Multer para lidar com uploads de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../', 'uploads')); // Salva as imagens na pasta 'uploads'
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Define o nome do arquivo como um timestamp para evitar duplicatas
    }
});
const upload = multer({ storage: storage });

// Rotas CRUD para eventos
// Create
router.post('/', upload.array('imagens', 5), (req, res) => {
    const imagens = req.files.map(file => file.path);
    const { dataInicio, dataFim, sms, whatsapp, descricao } = req.body;

    db.run(`INSERT INTO eventos (imagens, data_inicio, data_fim, receber_sms, receber_whatsapp, descricao) VALUES (?, ?, ?, ?, ?, ?)`, [imagens.join(','), dataInicio, dataFim, sms, whatsapp, descricao], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            imagens: imagens,
            data_inicio: dataInicio,
            data_fim: dataFim,
            receber_sms: sms,
            receber_whatsapp: whatsapp,
            descricao: descricao
        });
    });
});

// Read
router.get('/', (req, res) => {
    db.all("SELECT * FROM eventos", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;
