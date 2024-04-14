function createDeleteButton(clienteTelefone) {
    const button = document.createElement('button');
    button.textContent = 'Deletar';
    button.addEventListener('click', function () {
        fetch(`http://localhost:3000/api/cliente/${clienteTelefone}`, {
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
    const cpf = document.getElementById('cpf').value
    const email = document.getElementById('email').value
    const sexo = document.getElementById('sexo').value
    const nascimento = document.getElementById('nascimento').value


    fetch('http://localhost:3000/api/cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { 
                nome, 
                telefone,
                cpf,
                email,
                sexo,
                nascimento
            })
    })
        .then(response => response.json())
        .then(data => {
            const dataList = document.getElementById('dataList');
            const li = document.createElement('li');
            li.textContent = `
                Nome: ${data.nome}, 
                Telefone: ${data.telefone}, 
                CPF: ${item.cpf}, 
                E-mail: ${item.email}, 
                Sexo: ${item.sexo} 
                Nascimento: ${item.nascimento}
            `;
            li.appendChild(createDeleteButton(data.telefone));
            dataList.appendChild(li);
            document.getElementById('nome').value = '';
            document.getElementById('telefone').value = '';
            document.getElementById('cpf').value = '';
            document.getElementById('email').value = '';
            document.getElementById('sexo').value = '';
            document.getElementById('nascimento').value = '';
        })
        .catch(error => console.error('Erro:', error));
        window.location.reload() 
});

fetch('http://localhost:3000/api/cliente')
    .then(response => response.json())
    .then(data => {
        const dataList = document.getElementById('dataList');
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `
                Nome: ${item.nome}, 
                Telefone: ${item.telefone}, 
                CPF: ${item.cpf}, 
                E-mail: ${item.email},
                Sexo: ${item.sexo}
                Nascimento ${item.nascimento}
                `;
            li.appendChild(createDeleteButton(item.telefone));
            dataList.appendChild(li);
        });
    })
    .catch(error => console.error('Erro:', error));
