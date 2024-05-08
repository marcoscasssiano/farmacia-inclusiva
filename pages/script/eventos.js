document.getElementById('scheduleForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const imagem = document.getElementById('imagem').files[0];
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const sms = document.getElementById('sms').checked;
    const whatsapp = document.getElementById('whatsapp').checked;
    const descricao = document.getElementById('descricao').value;

    const formData = new FormData();
    formData.append('imagem', imagem);
    formData.append('dataInicio', dataInicio);
    formData.append('dataFim', dataFim);
    formData.append('sms', sms);
    formData.append('whatsapp', whatsapp);
    formData.append('descricao', descricao);

    fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            alert('Evento agendado com sucesso!');
            // Limpar o formulário após o agendamento
            document.getElementById('imagem').value = '';
            document.getElementById('dataInicio').value = '';
            document.getElementById('dataFim').value = '';
            document.getElementById('sms').checked = false;
            document.getElementById('whatsapp').checked = false;
            document.getElementById('descricao').value = '';
        })
        .catch(error => console.error('Erro:', error));
});
