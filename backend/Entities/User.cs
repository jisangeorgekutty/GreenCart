using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class User
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiryTime { get; set; }
    
    public string Role { get; set; } = "User"; // Default role is User, can be Admin or User
}
