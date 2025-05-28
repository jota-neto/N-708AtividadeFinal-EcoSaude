

document.addEventListener('DOMContentLoaded', () => {
    const agendamentoForm = document.querySelector('.agendamento-form');

    agendamentoForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        
        const dataColeta = document.getElementById('data-coleta').value;
        const horaColeta = document.getElementById('hora-coleta').value;
        const tipoResiduoAgendado = document.getElementById('tipo-residuo-agendado').value;
        const observacoes = document.getElementById('observacoes').value;

      
        if (!dataColeta) {
            alert('Por favor, selecione a data da coleta.');
            return;
        }

        if (!horaColeta) {
            alert('Por favor, selecione a hora da coleta.');
            return;
        }

        if (!tipoResiduoAgendado || tipoResiduoAgendado === "") {
            alert('Por favor, selecione o tipo de resíduo para agendamento.');
            return;
        }

      
        const dataAtual = new Date();
       
        dataAtual.setHours(0, 0, 0, 0); 

        const dataSelecionada = new Date(dataColeta);
        
        dataSelecionada.setHours(0, 0, 0, 0);

        if (dataSelecionada < dataAtual) {
            alert('A data da coleta não pode ser no passado.');
            return;
        }
        
        // Simulação de envio para o "backend"
        console.log('--- Dados do Agendamento de Coleta para Envio ---');
        console.log('Data da Coleta:', dataColeta);
        console.log('Hora da Coleta:', horaColeta);
        console.log('Tipo de Resíduo Agendado:', tipoResiduoAgendado);
        console.log('Observações:', observacoes);
        console.log('------------------------------------------------');

        alert('Coleta agendada com sucesso (simulação)!');

        
        agendamentoForm.reset();

        
    });
});