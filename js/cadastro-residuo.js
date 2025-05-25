// js/cadastro-residuo.js

document.addEventListener('DOMContentLoaded', () => {
    const cadastroResiduoForm = document.querySelector('.cadastro-residuo-form');

    cadastroResiduoForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        
        const tipoResiduo = document.getElementById('tipo-residuo').value;
        const peso = document.getElementById('peso').value;
        const unidadeMedida = document.getElementById('unidade-medida').value;
        const descricao = document.getElementById('descricao').value;

        
        if (!tipoResiduo || tipoResiduo === "") {
            alert('Por favor, selecione o tipo de resíduo.');
            return;
        }

        if (peso <= 0) {
            alert('O peso do resíduo deve ser um valor positivo.');
            return;
        }

        if (!unidadeMedida || unidadeMedida === "") {
            alert('Por favor, selecione a unidade de medida.');
            return;
        }

        // Simulação de envio para o "backend"
        console.log('--- Dados do Resíduo para Envio ---');
        console.log('Tipo de Resíduo:', tipoResiduo);
        console.log('Peso:', peso, unidadeMedida);
        console.log('Descrição:', descricao);
        console.log('----------------------------------');

        alert('Resíduo cadastrado com sucesso (simulação)!');

        
        cadastroResiduoForm.reset();

        
    });
});