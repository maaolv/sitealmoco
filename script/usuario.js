document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('cadastroBtn').addEventListener('click', cadastrar);

function mostrarCadastro() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('cadastro').style.display = 'block';
}

function mostrarLogin() {
    document.getElementById('cadastro').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

async function cadastrar() {
    const nome = document.getElementById('cadastroNome').value;
    const email = document.getElementById('cadastroEmail').value;
    const senha = document.getElementById('cadastroPassword').value;
    const turma = document.getElementById('cadastroTurma').value;

    const response = await fetch('http://localhost:5076/api/usuarios/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, turma })
    });

    if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        mostrarLogin();
    } else {
        alert('Erro ao cadastrar!');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:5076/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
        const data = await response.json();
        alert('Login realizado com sucesso!');
        // Redirecionar ou carregar outra tela
    } else {
        alert('Email ou senha inválidos!');
    }
}

async function verificarCadastroELogin(userId, email, senha) {
    try {
        // Verifica se o usuário já está cadastrado pelo ID
        const respostaCadastro = await fetch(`https://localhost:5076/api/usuarios/${id}`);
        if (!respostaCadastro.ok) {
            throw new Error("Usuário não encontrado. Por favor, cadastre-se antes de fazer login.");
        }

        // Se o usuário existe, tenta realizar o login
        const respostaLogin = await fetch("https://localhost:5076/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const dadosLogin = await respostaLogin.json();

        if (respostaLogin.ok) {
            console.log("Login realizado com sucesso!", dadosLogin);
            return dadosLogin; // Aqui você pode redirecionar o usuário ou armazenar tokens
        } else {
            throw new Error(dadosLogin.mensagem || "Falha no login. Verifique suas credenciais.");
        }
    } catch (erro) {
        console.error(erro.message);
        return { erro: erro.message };
    }
}

verificarCadastroELogin(id, email, senha)
    .then(res => console.log("Resultado:", res))
    .catch(err => console.error("Erro:", err));