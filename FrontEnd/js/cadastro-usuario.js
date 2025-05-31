
document.addEventListener('DOMContentLoaded', () => {

    const cadastroForm = document.querySelector('.cadastro-form');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (event) => {
            event.preventDefault();


            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const novaSenha = document.getElementById('nova-senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            if (novaSenha !== confirmarSenha) {
                alert('As senhas não coincidem! Por favor, verifique.');
                return; 
            }

            if (novaSenha.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }


            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Por favor, insira um endereço de e-mail válido.');
                return;
            }
            if (!nome.trim()) { 
                alert('O campo nome é obrigatório.');
                return;
            }
            const userData = {
                nome: nome,
                email: email,
                senha: novaSenha
            };

            
            try {
                
                const apiUrl = 'http://localhost/N-708AtividadeFinal-EcoSaude/BackEnd/api/auth/register.php';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();
                if (response.ok) { 
                    alert(result.message || 'Usuário cadastrado com sucesso!');
                    cadastroForm.reset();
                } else {
                    alert(result.message || `Erro ao cadastrar: Status ${response.status}`);
                }
            } catch (error) {
                console.error('Erro ao enviar dados para o backend ou processar resposta:', error);
                alert('Ocorreu um erro de comunicação ao tentar cadastrar. Verifique o console.');
            }
        });
    } else {
        console.error("Elemento de formulário com a classe '.cadastro-form' não foi encontrado na página.");
    }
});