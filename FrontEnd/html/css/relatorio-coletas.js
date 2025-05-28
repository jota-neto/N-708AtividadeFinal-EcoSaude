

document.addEventListener('DOMContentLoaded', () => {
    
    const relatorioForm = document.querySelector('.relatorio-form');
    const btnGerarPdf = document.getElementById('btn-gerar-pdf');
    const btnGerarExcel = document.getElementById('btn-gerar-excel');

    
    const getParametrosRelatorio = () => {
        const dataInicio = document.getElementById('data-inicio').value;
        const dataFim = document.getElementById('data-fim').value;
        const tipoResiduo = document.getElementById('tipo-residuo-relatorio').value;

        
        if (!dataInicio) {
            alert('Por favor, selecione a data de início.');
            return null;
        }
        if (!dataFim) {
            alert('Por favor, selecione a data de fim.');
            return null;
        }
        if (new Date(dataFim) < new Date(dataInicio)) {
            alert('A data de fim não pode ser anterior à data de início.');
            return null;
        }

        return {
            dataInicio: dataInicio,
            dataFim: dataFim,
            tipoResiduo: tipoResiduo 
        };
    };

    // Função que simula a chamada ao backend para gerar o relatório
    const simularGeracaoRelatorio = (formato) => {
        const parametros = getParametrosRelatorio();
        if (!parametros) {
            return; // 
        }

        console.log(`--- Solicitando Relatório em ${formato.toUpperCase()} ---`);
        console.log('Parâmetros:', parametros);
        console.log('----------------------------------------------------');

        
     
        alert(`Relatório em ${formato.toUpperCase()} gerado com sucesso (simulação)!`);
    };

    btnGerarPdf.addEventListener('click', () => {
        simularGeracaoRelatorio('pdf');
    });

    btnGerarExcel.addEventListener('click', () => {
        simularGeracaoRelatorio('excel');
    });
});