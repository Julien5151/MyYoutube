namespace Infrastructure.Utils;

internal static class VersionExtensions
{
    /// <summary>
    ///     Allocation free helper function to find if version is greater than expected
    /// </summary>
    public static bool IsGreaterOrEqual(this Version version, int major, int minor = 0)
    {
        return version.Major != major
            ? version.Major > major
            : version.Minor >= minor;
    }
}