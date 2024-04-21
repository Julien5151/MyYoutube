namespace Domain.Exceptions;

public class MusicPlaylistConflictException() : Exception("Music to playlist association already exists");