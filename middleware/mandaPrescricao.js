const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '..', 'db', 'database.db');

const db = new sqlite3.Database(dbPath);

async function mandaPrescricao() {
    try {
        const prescricoes = await consultarPrescricoes();
        console.log(prescricoes);

        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < prescricoes.length; i++) {
            const prescricao = prescricoes[i];

            if (prescricao.data_inicio <= prescricao.data_fim) {

                if (prescricao.receber_whatsapp == 1 && prescricao.receber_sms == 1){

                await enviarMensagem(prescricao.telefone_cliente, prescricao.descricao);
                } else if (prescricao.receber_whatsapp == 1){
                    await enviarWhatsApp(prescricao.telefone_cliente, prescricao.descricao)
                } else if (prescricao.receber_sms == 1){
                    await enviarSMS(prescricao.telefone_cliente, prescricao.descricao)
                }
                await wait(1000);
            }
        }
        await atualizarDataInicio()

    } catch (error) {
        throw new Error('Erro ao consultar prescrições ou enviar mensagens: ' + error.message);
    }
}

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

async function atualizarDataInicio() {
    try {
        await new Promise((resolve, reject) => {
            db.run('UPDATE prescricoes SET data_inicio = DATE(data_inicio, "+1 day") WHERE data_inicio <= data_fim', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } catch (error) {
        throw new Error('Erro ao atualizar data de início da prescrição: ' + error.message);
    }
}

async function enviarMensagem(numero, mensagem) {
    try {
        await enviarSMS(numero, mensagem);
        await enviarWhatsApp(numero, mensagem);
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao enviar mensagem: ' + error.message);
    }
}

async function enviarSMS(telefone, mensagem) {
    try {
            const response = await axios.get(`http://api.smsdev.com.br/v1/send?key=${process.env.SMSDEV}&type=9&number=${process.env.telefone}&msg=${encodeURIComponent(mensagem)}`);
            console.log(response.data);
        } catch (error) {
            throw new Error('Erro ao enviar SMS: ' + error.message);
        }
    }

async function enviarWhatsApp(numero, mensagem) {
    try {
        let options = {
            method: 'POST',
            url: 'https://api.wzap.chat/v1/messages',
            headers: {
                'Content-Type': 'application/json',
                Token: process.env.WPPDEV
            },
            data: {phone: `+55${numero}`, message: mensagem}
        };

        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        throw new Error('Erro ao enviar mensagem via WhatsApp: ' + error.message);
    }
}

module.exports = mandaPrescricao;
