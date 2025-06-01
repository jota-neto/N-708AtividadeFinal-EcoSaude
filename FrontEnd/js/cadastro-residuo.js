// js/cadastro-residuo.js

document.addEventListener('DOMContentLoaded', () => {
    const cadastroResiduoForm = document.querySelector('.cadastro-residuo-form');

    if (cadastroResiduoForm) {
    cadastroResiduoForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        
        const tipoResiduo = document.getElementById('tipo').value;
        const peso = document.getElementById('peso').value;
        const unidadeMedida = document.getElementById('unidade').value;
        const descricao = document.getElementById('descricao').value;

        
        if (!tipoResiduo || tipoResiduo === "") {
            alert('Por favor, selecione o tipo de resíduo.');
            return;
        }

        if (isNaN(peso) || peso <= 0) {
            alert('O peso do resíduo deve ser um valor positivo.');
            return;
        }

        if (!unidadeMedida || unidadeMedida === "") {
            alert('Por favor, selecione a unidade de medida.');
            return;
        }

  const token = localStorage.getItem('jwtToken');
            if (!token) {
                alert('Sessão expirada ou usuário não logado. Faça o login novamente.');
                window.location.href = 'index.html';
                return;
            }

            try {
                const response = await fetch('http://localhost/N-708AtividadeFinal-EcoSaude/BackEnd/api/residuos/create.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ 
                        tipo_residuo: tipoResiduo, 
                        peso: peso, 
                        unidade_medida: unidadeMedida,
                        descricao: descricao 
                    }),
                });

                const result = await response.json();

                if (response.ok) { 
                    alert(result.message || 'Resíduo cadastrado com sucesso!');
                    cadastroResiduoForm.reset();
                } else {
                    
                    if (response.status === 401) {
                        alert(result.message || 'Sessão expirada ou token inválido. Faça login novamente.');
                        localStorage.removeItem('jwtToken'); 
                        window.location.href = 'index.html'; 
                    } else {
                        alert(result.message || `Erro ao cadastrar resíduo: ${response.statusText}`);
                    }
                }
            } catch (error) {
                console.error('Erro ao enviar dados para o backend:', error);
                alert('Ocorreu um erro de comunicação ao tentar cadastrar o resíduo.');
            }
        });
    } else {
        console.error("Formulário de cadastro de resíduo não encontrado.");
}});