using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public class Music
{
    public required Guid Id { get; set; }
    public required uint Oid { get; set; }
    [MaxLength(255)] public required string Title { get; set; } = string.Empty;
    public required Guid OwnerId { get; set; }
}