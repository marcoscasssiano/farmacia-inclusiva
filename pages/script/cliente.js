function createDeleteButton(clienteId) {
    const button = document.createElement('button');
    button.textContent = 'Deletar';
    button.addEventListener('click', function () {
        fetch(`http://localhost:3000/api/cliente/${clienteId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    throw new Error('Erro ao deletar o cliente');
                }
            })
            .catch(error => console.error('Erro:', error));
    });
    return button;
}

document.getElementById('addClientForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;

    fetch('http://localhost:3000/api/cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, telefone })
    })
        .then(response => response.json())
        .then(data => {
            const dataList = document.getElementById('dataList');
            const li = document.createElement('li');
            li.textContent = `ID: ${data.id}, Nome: ${data.nome}, Telefone: ${data.telefone}`;
            li.appendChild(createDeleteButton(data.id));
            dataList.appendChild(li);
            document.getElementById('nome').value = '';
            document.getElementById('telefone').value = '';
        })
        .catch(error => console.error('Erro:', error));
});

fetch('http://localhost:3000/api/cliente')
    .then(response => response.json())
    .then(data => {
        const dataList = document.getElementById('dataList');
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `ID: ${item.id}, Nome: ${item.nome}, Telefone: ${item.telefone}`;
            li.appendChild(createDeleteButton(item.id));
            dataList.appendChild(li);
        });
    })
    .catch(error => console.error('Erro:', error));
