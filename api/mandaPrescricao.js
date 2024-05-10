const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados SQLite
const dbPath = path.resolve(__dirname, '..', 'db', 'database.db'); // Alteração aqui para voltar um nível acima

// Banco de dados SQLite
const db = new sqlite3.Database(dbPath);

// Função para consultar o banco de dados e enviar SMS e WhatsApp para prescrições específicas
async function mandaPrescricao() {
    try {
        // Consulta o banco de dados para obter todas as prescrições
        const prescricoes = await consultarPrescricoes();

        // Percorre todas as prescrições
        for (const prescricao of prescricoes) {
            // Verifica se a data inicial é menor que a data final
            if (prescricao.data_inicio < prescricao.data_fim) {
                // Se receber SMS e receber WhatsApp forem iguais a 1, envia ambos
                if (prescricao.receber_sms === 1 && prescricao.receber_whatsapp === 1) {
                    await enviarSMS(prescricao.telefone_cliente, prescricao.descricao);
                    await enviarWhatsApp(prescricao.telefone_cliente, prescricao.descricao);
                } else if (prescricao.receber_sms === 1) { // Se receber SMS for igual a 1, envia SMS
                    await enviarSMS(prescricao.telefone_cliente, prescricao.descricao);
                } else if (prescricao.receber_whatsapp === 1) { // Se receber WhatsApp for igual a 1, envia WhatsApp
                    await enviarWhatsApp(prescricao.telefone_cliente, prescricao.descricao);
                }
            }
        }
    } catch (error) {
        throw new Error('Erro ao consultar prescrições ou enviar mensagens: ' + error.message);
    }
}

// Função para consultar todas as prescrições do banco de dados
async function consultarPrescricoes() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM prescricoes', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Função para enviar SMS
async function enviarSMS(telefone, mensagem) {
    // try {
    //     const response = await axios.get(`http://api.smsdev.com.br/v1/send?key=${process.env.SMSDEV}&type=9&number=${process.env.telefone}&msg=${encodeURIComponent(mensagem)}`);
    //     console.log(response.data);
    // } catch (error) {
    //     throw new Error('Erro ao enviar SMS: ' + error.message);
    // }

    console.log("SMS")
}

// Função para enviar mensagem via WhatsApp
async function enviarWhatsApp(numero, mensagem) {
        let options = {
            method: 'POST',
            url: 'https://api.wzap.chat/v1/messages',
            headers: {
              'Content-Type': 'application/json',
              Token: `${process.env.WPPDEV}`
            },
            data: {phone: `+55'${numero}'`, message: `'${mensagem}'`}
          };

        await axios.request(options).then(function (response) {
            console.log(response.data);
          }).catch(function (error) {
            console.error(error);
          });
    
}

module.exports = mandaPrescricao;
