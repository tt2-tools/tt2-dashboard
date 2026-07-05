using System.Text.Json;

namespace worker;

public interface IEventHandler
{
    string EventName { get; }
    Task HandleAsync(JsonElement data, CancellationToken ct);
}
