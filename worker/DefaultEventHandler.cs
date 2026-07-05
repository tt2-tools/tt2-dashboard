using System.Text.Json;

namespace worker;

public class DefaultEventHandler(ILogger<DefaultEventHandler> logger) : IEventHandler
{
    public string EventName => "*";

    public Task HandleAsync(JsonElement data, CancellationToken ct)
    {
        logger.LogInformation("Unhandled event data: {Data}", data.ToString());
        return Task.CompletedTask;
    }
}
