function createDeleteButton(clienteTelefone) {
    const buttonWrapper = document.createElement('div'); // Criar a div de envolvimento
    buttonWrapper.style.textAlign = 'center'; // Centralizar conteúdo

    const button = document.createElement('button');
    button.textContent = 'Deletar';
    button.style.backgroundColor = '#ff4444'; // Cor de fundo vermelha
    button.style.color = '#fff'; // Cor do texto branca
    button.style.border = 'none'; // Sem borda
    button.style.borderRadius = '4px'; // Borda arredondada
    button.style.padding = '5px 10px'; // Preenchimento interno
    button.style.cursor = 'pointer'; // Cursor ao passar por cima
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

    buttonWrapper.appendChild(button); // Adicionar o botão à div de envolvimento
    return buttonWrapper; // Retornar a div de envolvimento com o botão centralizado
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
            li.style.padding = '15px'; // Mais espaço interno
            li.style.border = '1px solid #ccc'; // Borda para separar os clientes
            li.style.borderRadius = '8px'; // Borda arredondada
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
            li.innerHTML = `
                <b>Nome:</b> ${item.nome}<br> 
                <b>Telefone:</b> ${item.telefone}
                <b>CPF:</b> ${item.cpf} <br> 
                <b>E-mail:</b> ${item.email}
                <b>Sexo:</b> ${item.sexo}<br> 
                <b>Nascimento</b> ${item.nascimento}<br>
                `;
            li.style.padding = '15px'; // Mais espaço interno
            li.style.border = '1px solid #ccc'; // Borda para separar os clientes
            li.style.borderRadius = '8px'; // Borda arredondada
            li.appendChild(createDeleteButton(item.telefone));
            dataList.appendChild(li);
        });
    })
    .catch(error => console.error('Erro:', error));
