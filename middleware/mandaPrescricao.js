const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Caminho para o banco de dados SQLite
const dbPath = path.resolve(__dirname, '..', 'db', 'database.db'); // Alteração aqui para voltar um nível acima

// Banco de dados SQLite
const db = new sqlite3.Database(dbPath);

// Função para consultar o banco de dados e enviar SMS e WhatsApp para prescrições específicas
async function mandaPrescricao() {
    try {
        // Consulta o banco de dados para obter todas as prescrições
        const prescricoes = await consultarPrescricoes();
        console.log(prescricoes);

        // Função auxiliar para aguardar um certo tempo
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // Percorre todas as prescrições
        // Percorre todas as prescrições
        for (let i = 0; i < prescricoes.length; i++) {
            const prescricao = prescricoes[i];
            // Verifica se a data inicial é menor ou igual à data final
            if (prescricao.data_inicio <= prescricao.data_fim) {

                if (prescricao.receber_whatsapp == 1 && prescricao.receber_sms == 1){
                // Envia SMS e WhatsApp para o número da prescrição
                await enviarMensagem(prescricao.telefone_cliente, prescricao.descricao);
                // Aguarda 10 segundos antes de prosseguir para a próxima prescrição
                } else if (prescricao.receber_whatsapp == 1){
                    await enviarWhatsApp(prescricao.telefone_cliente, prescricao.descricao)
                } else if (prescricao.receber_sms == 1){
                    await enviarSMS(prescricao.telefone_cliente, prescricao.descricao)
                }
                await wait(1000); // 10 segundos em milissegundos
            }
        }
        await atualizarDataInicio()

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
        // Envia mensagem via SMS
        await enviarSMS(numero, mensagem);
        // Envia mensagem via WhatsApp
        await enviarWhatsApp(numero, mensagem);
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao enviar mensagem: ' + error.message);
    }
}

// Função para enviar SMS
async function enviarSMS(telefone, mensagem) {
    console.log("TESTE SMS")
}

// Função para enviar mensagem via WhatsApp
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
