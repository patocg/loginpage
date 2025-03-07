require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3307;

app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Permite envio de JSON no body

// Criando conexão com o MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Conectando ao MySQL
connection.connect((err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao MySQL:", err);
        return;
    }
    console.log("✅ Conectado ao MySQL com sucesso!");
});

// Rota de Cadastro
app.post('/api/register', (req, res) => {
    const { cpf, nome, email, senha } = req.body;

    if (!cpf || !nome || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos!' });
    }

    const sql = "INSERT INTO users (cpf, nome, email, senha) VALUES (?, ?, ?, ?)";
    connection.query(sql, [cpf, nome, email, senha], (err, result) => {
        if (err) {
            console.error('❌ Erro ao cadastrar usuário:', err);
            return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
        }
        console.log("✅ Usuário cadastrado com sucesso!", result);
        res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    });
});

// Rota de Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Preencha todos os campos!' });
    }

    const sql = "SELECT * FROM users WHERE email = ? AND senha = ?";
    connection.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error('❌ Erro ao verificar login:', err);
            return res.status(500).json({ success: false, message: 'Erro ao processar login.' });
        }

        if (results.length > 0) {
            console.log("✅ Login bem-sucedido!", results);
            res.json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            res.json({ success: false, message: 'Usuário ou senha incorretos.' });
        }
    });
});

// Rota para buscar usuários (sem senha)
app.get("/api/users", (req, res) => {
    const sql = "SELECT id, cpf, nome, email FROM users"; // Removemos a senha
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
        res.status(200).json(results);
    });
});

// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
