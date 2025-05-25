

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log('--- Tentativa de Login ---');
        console.log('Usuário:', username);
        console.log('Senha:', password);
        console.log('--------------------------');

        if (username === 'admin' && password === 'admin') {
            alert('Login bem-sucedido! Bem-vindo(a), EcoSaúde!');
            window.location.href = 'principal.html'; 
        } else {
            alert('Usuário ou senha incorretos.');
        }
    });
});