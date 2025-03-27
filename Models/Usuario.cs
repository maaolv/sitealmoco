namespace NutritionalAppAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }
        public string? Turma { get; set; }
        public bool IsAdmin { get; set; }
    }
}

