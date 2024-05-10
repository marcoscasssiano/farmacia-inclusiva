document.getElementById('scheduleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const clienteNome = document.getElementById('cliente').value;
    const clienteTelefone = document.getElementById('cliente').selectedOptions[0].dataset.telefone;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const sms = document.getElementById('sms').checked;
    const whatsapp = document.getElementById('whatsapp').checked;
    const descricao = document.getElementById('descricao').value;

    fetch('http://localhost:3000/api/prescricao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            telefone_cliente: clienteTelefone,
            nome_cliente: clienteNome,
            data_inicio: dataInicio,
            data_fim: dataFim,
            receber_sms: sms,
            receber_whatsapp: whatsapp,
            descricao: descricao
        })
    })
        .then(response => response.json())
        .then(data => {
            alert('Prescrição agendada com sucesso!');
            // Limpar o formulário após o agendamento
            document.getElementById('cliente').selectedIndex = 0;
            document.getElementById('dataInicio').value = '';
            document.getElementById('dataFim').value = '';
            document.getElementById('sms').checked = false;
            document.getElementById('whatsapp').checked = false;
            document.getElementById('descricao').value = '';
        })
        .catch(error => console.error('Erro:', error));

});


// Função para popular dinamicamente a lista de clientes
function populateClientes() {
    fetch('http://localhost:3000/api/cliente')
        .then(response => response.json())
        .then(data => {
            const selectCliente = document.getElementById('cliente');
            selectCliente.innerHTML = ""; // Limpar o conteúdo anterior
            data.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.nome;
                option.textContent = cliente.nome;
                option.dataset.telefone = cliente.telefone; // Armazenar telefone como um atributo de dados
                selectCliente.appendChild(option);
            });
        })
        .catch(error => console.error('Erro:', error));
}
populateClientes();
