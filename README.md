# EcoSaúde - API de Coleta de Resíduos Hospitalares

Este repositório contém o desenvolvimento da API multiplataforma **EcoSaúde**, focada na gestão e coleta de resíduos hospitalares.

Desenvolvido como parte da Atividade Parcial 1 da disciplina N708 - Projeto Aplicado Multiplataforma 2.

Orientação para rodar o projeto:

Programas Necessários:
XAMPP: Pacote que inclui o servidor web Apache, PHP e o banco de dados MySQL.
Baixem em: https://www.apachefriends.org/download.html (escolham uma versão com PHP 8.0 ou superior, como a "8.0.30 / PHP 8.0" se disponível, para manter a consistência).
Git: Para baixar (clonar) o código do projeto do GitHub.
Baixem em: https://git-scm.com/downloads
Navegador Web: Chrome, Firefox, Edge, etc.

 Passos para Configuração:

a. Instalar o XAMPP:
Instale o XAMPP em seu computador. Podem manter as opções padrão durante a instalação. O local comum de instalação é C:\xampp\.

b. Baixar o Projeto Diretamente no htdocs:
Abram o terminal.
Naveguem diretamente para a pasta htdocs do XAMPP no terminal:

cd C:\xampp\htdocs\

(Se o seu XAMPP estiver instalado em outro local, ajuste o caminho acima).
Agora, dentro da pasta htdocs, clonem o nosso repositório:

git clone git@github.com:jota-neto/N-708AtividadeFinal-EcoSaude.git

Isso criará a pasta N-708AtividadeFinal-EcoSaude diretamente dentro de C:\xampp\htdocs\.

c. Iniciar o Apache e o MySQL no XAMPP:
Abram o "XAMPP Control Panel" (Painel de Controle do XAMPP).
Cliquem em "Start" para os módulos Apache e MySQL.

d. Configurar o Banco de Dados MySQL:
No navegador, acessem o phpMyAdmin: http://localhost/phpmyadmin/
