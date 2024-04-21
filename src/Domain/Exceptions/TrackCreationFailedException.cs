namespace Domain.Exceptions;

public class TrackCreationFailedException(string reason) : Exception(reason);