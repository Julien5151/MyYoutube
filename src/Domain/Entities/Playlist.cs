using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Playlist
{
    public required Guid Id { get; set; }
    public required Guid UserId { get; set; }
    [MaxLength(255)] public required string Title { get; set; } = string.Empty;
}