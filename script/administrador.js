document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('cadastroBtn').addEventListener('click', cadastrar);
document.getElementById('addCardapioBtn').addEventListener('click', adicionarCardapio);

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
        if (data.isAdmin) {
            mostrarAdmin();
        } else {
            alert('Login realizado com sucesso!');
            // Redirect to student dashboard or main page
        }
    } else {
        alert('Email ou senha inválidos!');
    }
}

function mostrarAdmin() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('cadastro').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    listarAlunos();
}

async function listarAlunos() {
    const response = await fetch('http://localhost:5076/api/usuarios');
    const alunos = await response.json();
    const alunosList = document.getElementById('alunosList');

    alunosList.innerHTML = ''; // Clear the list first

    alunos.forEach(aluno => {
        const li = document.createElement('li');
        li.textContent = `${aluno.nome} - ${aluno.turma}`;
        alunosList.appendChild(li);
    });
}

async function adicionarCardapio() {
    const cardapio = document.getElementById('cardapioInput').value;

    const response = await fetch('http://localhost:5076/api/usuarios/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });

    if (response.ok) {
        alert('Cardápio adicionado com sucesso!');
        document.getElementById('cardapioInput').value = ''; // Clear input
    } else {
        alert('Erro ao adicionar cardápio!');
    }
}

function logout() {
    document.getElementById('adminPage').style.display = 'none';
    mostrarLogin(); // Redirect back to login page
}
