using System.Text.Json;

namespace worker;

public class EventDispatcher(IEnumerable<IEventHandler> handlers, DefaultEventHandler defaultHandler)
{
    private readonly Dictionary<string, IEventHandler> _handlers = handlers
        .Where(h => h.EventName != "*")
        .ToDictionary(h => h.EventName);

    public Task DispatchAsync(string eventName, JsonElement data, CancellationToken ct)
    {
        var handler = _handlers.GetValueOrDefault(eventName, defaultHandler);
        return handler.HandleAsync(data, ct);
    }
}
