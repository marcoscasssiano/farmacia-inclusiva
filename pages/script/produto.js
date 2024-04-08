function createDeleteButton(produtoId) {
    const button = document.createElement('button');
    button.textContent = 'Deletar';
    button.addEventListener('click', function () {
        fetch(`http://localhost:3000/api/produto/${produtoId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload(); // Atualizar a página após a exclusão bem-sucedida
                } else {
                    throw new Error('Erro ao deletar o produto');
                }
            })
            .catch(error => console.error('Erro:', error));
    });
    return button;
}

document.getElementById('addProductForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const tipoUso = document.getElementById('tipo_uso').value;
    const informacoes = document.getElementById('informacoes').value;

    fetch('http://localhost:3000/api/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, tipo_uso: tipoUso, informacoes })
    })
        .then(response => response.json())
        .then(data => {
            const dataList = document.getElementById('dataList');
            const li = document.createElement('li');
            li.textContent = `ID: ${data.id}, Nome: ${data.nome}, Tipo de Uso: ${data.tipo_uso}, Informações: ${data.informacoes}`;
            li.appendChild(createDeleteButton(data.id)); // Adicionar o botão de deletar
            dataList.appendChild(li);
            document.getElementById('nome').value = ''; // Limpar o campo de nome
            document.getElementById('tipo_uso').value = ''; // Limpar o campo de tipo de uso
            document.getElementById('informacoes').value = ''; // Limpar o campo de informações
        })
        .catch(error => console.error('Erro:', error));
});

fetch('http://localhost:3000/api/produto')
    .then(response => response.json())
    .then(data => {
        const dataList = document.getElementById('dataList');
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `ID: ${item.id}, Nome: ${item.nome}, Tipo de Uso: ${item.tipo_uso}, Informações: ${item.informacoes}`;
            li.appendChild(createDeleteButton(item.id)); // Adicionar o botão de deletar
            dataList.appendChild(li);
        });
    })
    .catch(error => console.error('Erro:', error));
