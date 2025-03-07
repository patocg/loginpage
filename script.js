// Função para abrir popups
function abrirPopup(id) {
    document.getElementById(id).style.display = 'flex';
}

// Função para fechar popups
function fecharPopup(id) {
    document.getElementById(id).style.display = 'none';
}

// Evento de Cadastro
document.getElementById('cadastroForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita recarregar a página

    const cpf = document.getElementById('cpf').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const dados = { cpf, nome, email, senha };

    try {
        const response = await fetch('http://localhost:3307/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        alert(result.message); // Mostra resposta do servidor

        if (result.success) {
            fecharPopup('cadastroPopup'); // Fecha popup após cadastro
            document.getElementById('cadastroForm').reset(); // Limpa formulário
        }
    } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao cadastrar usuário!");
    }
});

// Evento de Login
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita recarregar a página

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    const dados = { email, senha };

    try {
        const response = await fetch('http://localhost:3307/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        alert(result.message); // Mostra resposta do servidor

        if (result.success) {
            fecharPopup('loginPopup'); // Fecha popup após login
            window.location.href = "dashboard.html"; // Redireciona para outra página após login bem-sucedido
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao autenticar usuário!");
    }
});
