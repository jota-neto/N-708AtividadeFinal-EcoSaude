// frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form'); // Certifique-se que a classe do formulário é esta

    if (loginForm) { // Verifica se o formulário existe na página
        loginForm.addEventListener('submit', async (event) => { // Adiciona async
            event.preventDefault();

            const emailInput = document.getElementById('username'); // O HTML usa 'username' para email
            const passwordInput = document.getElementById('password');

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert('Por favor, preencha o email e a senha.');
                return;
            }

            try {
                const response = await fetch('http://localhost/N-708AtividadeFinal-EcoSaude/BackEnd/api/auth/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, senha: password }),
                });

                const result = await response.json();

                if (response.ok) { // Status 200-299
                    alert(result.message || 'Login bem-sucedido!');
                    
                    // Armazenar o token JWT (e talvez dados do usuário) no localStorage
                    if (result.data && result.data.token) {
                        localStorage.setItem('jwtToken', result.data.token);
                        // Você pode querer armazenar o objeto do usuário também, se útil
                        // localStorage.setItem('userData', JSON.stringify(result.data.user));
                        console.log('Token armazenado:', result.data.token);
                    }
                    
                    window.location.href = 'principal.html'; // Redireciona para a página principal
                } else {
                    alert(result.message || `Erro no login: ${response.statusText}`);
                }

            } catch (error) {
                console.error('Erro ao tentar fazer login:', error);
                alert('Ocorreu um erro ao tentar fazer login. Verifique o console para mais detalhes.');
            }
        });
    } else {
        console.error('Formulário de login não encontrado na página.');
    }
});