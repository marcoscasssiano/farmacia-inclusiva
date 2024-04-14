document.getElementById('scheduleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const clienteNome = document.getElementById('cliente').value;
    const clienteTelefone = document.getElementById('cliente').selectedOptions[0].dataset.telefone;
    const produtoNome = document.getElementById('produto').value;
    const vezes = document.getElementById('vezes').value;
    const hora = document.getElementById('hora').value;

    fetch('http://localhost:3000/api/prescricao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome_cliente: clienteNome,
            telefone_cliente: clienteTelefone,
            produto_nome: produtoNome,
            vezes_uso: vezes,
            hora: hora
        })
    })
        .then(response => response.json())
        .then(data => {
            alert('Prescrição agendada com sucesso!');
            // Limpar o formulário após o agendamento
            document.getElementById('cliente').selectedIndex = 0;
            document.getElementById('produto').selectedIndex = 0;
            document.getElementById('vezes').value = '';
            document.getElementById('hora').value = '';
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

// Função para popular dinamicamente a lista de produtos
// function populateProdutos() {
//     fetch('http://localhost:3000/api/produto')
//         .then(response => response.json())
//         .then(data => {
//             const selectProduto = document.getElementById('produto');
//             selectProduto.innerHTML = ""; // Limpar o conteúdo anterior
//             data.forEach(produto => {
//                 const option = document.createElement('option');
//                 option.value = produto.nome;
//                 option.textContent = produto.nome;
//                 selectProduto.appendChild(option);
//             });
//         })
//     .catch(error => console.error('Erro:', error));
// }

// Chamar as funções para popular as listas de clientes e produtos
populateClientes();
// populateProdutos();
