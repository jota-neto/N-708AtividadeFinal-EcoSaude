document.addEventListener('DOMContentLoaded', () => {
    const agendamentoForm = document.querySelector('.agendamento-form');

    if (agendamentoForm) {
        agendamentoForm.addEventListener('submit', async (event) => { 
            event.preventDefault();

            const dataColeta = document.getElementById('data-coleta').value;
            const horaColeta = document.getElementById('hora-coleta').value;
            const tipoResiduoAgendado = document.getElementById('tipo-residuo-agendado').value;
            const observacoes = document.getElementById('observacoes').value;

            // Validações básicas do frontend
            if (!dataColeta) { alert('Por favor, selecione a data da coleta.'); return; }
            if (!horaColeta) { alert('Por favor, selecione a hora da coleta.'); return; }
            if (!tipoResiduoAgendado || tipoResiduoAgendado === "") { alert('Por favor, selecione o tipo de resíduo para agendamento.'); return; }
            
            const dataAtual = new Date();
            const dataSelecionadaParaComparacao = new Date(dataColeta + "T00:00:00");
            const dataAtualParaComparacao = new Date();
            dataAtualParaComparacao.setHours(0, 0, 0, 0);

            if (dataSelecionadaParaComparacao < dataAtualParaComparacao) {
                alert('A data da coleta não pode ser em um dia passado.');
                return;
            }
            
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                alert('Sessão expirada ou usuário não logado. Faça o login novamente.');
                window.location.href = 'index.html'; 
                return;
            }

            const dadosParaEnviar = {
                data_coleta: dataColeta,
                hora_coleta: horaColeta,
                tipo_residuo_agendado: tipoResiduoAgendado,
                observacoes: observacoes
            };

            try {
              
                const apiUrl = 'http://localhost/N-708AtividadeFinal-EcoSaude/BackEnd/api/coletas/create.php';
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dadosParaEnviar),
                });

                const result = await response.json();

                if (response.ok) { 
                    alert(result.message || 'Coleta agendada com sucesso!');
                    agendamentoForm.reset(); 
                } else {
                    if (response.status === 401) {
                        alert(result.message || 'Sessão expirada ou token inválido. Faça login novamente.');
                        localStorage.removeItem('jwtToken'); 
                        window.location.href = 'index.html'; 
                    } else {
                        alert(result.message || `Erro ao agendar coleta: Status ${response.status}`);
                    }
                }
            } catch (error) {
                console.error('Erro na comunicação com o backend:', error);
                alert('Ocorreu um erro de comunicação ao tentar agendar a coleta. Verifique o console.');
            }
        });
    } else {
        console.error("Formulário com a classe '.agendamento-form' não foi encontrado.");
    }
});