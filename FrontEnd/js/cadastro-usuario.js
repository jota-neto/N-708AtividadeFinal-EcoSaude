
document.addEventListener('DOMContentLoaded', () => {
    
    const cadastroForm = document.querySelector('.cadastro-form');

   
    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const novaSenha = document.getElementById('nova-senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        // --- Validações básicas no frontend ---
        // 1. Verifica se as senhas coincidem
        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem! Por favor, verifique.');
            return; // Interrompe a execução da função se as senhas não coincidirem
        }

        // 2. Exemplo: Validação de comprimento mínimo da senha
        if (novaSenha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return; // Interrompe a execução
        }

        // 3. Exemplo: Validação simples de formato de e-mail
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Por favor, insira um endereço de e-mail válido.');
            return;
        }

        // --- Simulação de envio para o "backend" (apenas loga no console e dá um alerta) ---
        console.log('--- Dados do Novo Usuário para Envio ---');
        console.log('Nome:', nome);
        console.log('E-mail:', email);
        console.log('Senha: ', novaSenha); 
        console.log('----------------------------------------');

        alert('Usuário cadastrado com sucesso (simulação)!');

       
        cadastroForm.reset();

        
    });
});