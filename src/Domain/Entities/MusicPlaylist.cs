namespace Domain.Entities;

public class MusicPlaylist
{
    public required Guid PlaylistId { get; set; }
    public required Guid MusicId { get; set; }
}