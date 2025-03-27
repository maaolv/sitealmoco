using Microsoft.AspNetCore.Mvc;
using NutritionalAppAPI.Models;
using NutritionalAppAPI.Services;
using System.Threading.Tasks;

namespace NutritionalAppAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuariosController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // POST: api/usuarios/cadastrar
        [HttpPost("cadastrar")]
        public async Task<IActionResult> CadastrarUsuario([FromBody] Usuario usuario)
        {
            var sucesso = await _usuarioService.CadastrarUsuario(usuario);
            if (sucesso)
                return Ok("Usuário cadastrado com sucesso!");
            return BadRequest("Erro ao cadastrar usuário.");
        }

        // POST: api/usuarios/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var usuario = await _usuarioService.ValidarCredenciais(loginModel.Email, loginModel.Senha);
            if (usuario != null)
                return Ok(new { mensagem = "Login realizado com sucesso!", usuario });
            return Unauthorized("Credenciais inválidas.");
        }

        // GET: api/usuarios
        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarios = await _usuarioService.GetUsuarios();
            return Ok(usuarios);
        }
    }
}
