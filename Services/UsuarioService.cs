using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using NutritionalAppAPI.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


namespace NutritionalAppAPI.Services
{
    public class UsuarioService
    {
        private readonly string _connectionString;

        // Construtor para obter a string de conexão do arquivo appsettings.json
        public UsuarioService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Função para criptografar a senha antes de armazená-la
        private string CriptografarSenha(string senha)
        {
            // Gerando um "salt" aleatório para a criptografia
            using (var hmac = new HMACSHA256())
            {
                var salt = hmac.Key;
                var hash = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                    password: senha,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA256,
                    iterationCount: 10000,
                    numBytesRequested: 256 / 8)); // 256 bits de hash

                return hash;
            }
        }

        // Função para cadastrar um novo usuário
        public async Task<bool> CadastrarUsuario(Usuario usuario)
        {
            // Usando MySQL para inserir um novo usuário no banco
            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var query = "INSERT INTO usuarios (Nome, Email, Senha, Turma, IsAdmin) VALUES (@Nome, @Email, @Senha, @Turma, @IsAdmin)";
                var command = new MySqlCommand(query, connection);

                command.Parameters.AddWithValue("@Nome", usuario.Nome);
                command.Parameters.AddWithValue("@Email", usuario.Email);
                command.Parameters.AddWithValue("@Senha", CriptografarSenha(usuario.Senha));
                command.Parameters.AddWithValue("@Turma", usuario.Turma);
                command.Parameters.AddWithValue("@IsAdmin", usuario.IsAdmin);

                var result = await command.ExecuteNonQueryAsync();
                return result > 0; // Se a inserção for bem-sucedida, retorna true
            }
        }

        // Função para buscar todos os usuários no banco de dados
        public async Task<List<Usuario>> GetUsuarios()
        {
            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var query = "SELECT * FROM usuarios";
                var command = new MySqlCommand(query, connection);

                using (var reader = await command.ExecuteReaderAsync())
                {
                    var usuarios = new List<Usuario>();
                    while (await reader.ReadAsync())
                    {
                        usuarios.Add(new Usuario
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            Nome = reader.GetString(reader.GetOrdinal("Nome")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            Senha = reader.GetString(reader.GetOrdinal("Senha")),
                            Turma = reader.GetString(reader.GetOrdinal("Turma")),
                            IsAdmin = reader.GetBoolean(reader.GetOrdinal("IsAdmin"))
                        });
                    }
                    return usuarios;
                }
            }
        }

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }
        private readonly AppDbContext _context;

        public async Task<Usuario?> ValidarCredenciais(string email, string senha)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == email && u.Senha == senha);
        }
    }
}
