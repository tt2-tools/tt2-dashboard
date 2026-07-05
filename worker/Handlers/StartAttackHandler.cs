using System.Text.Json;
using StackExchange.Redis;

namespace worker.Handlers;

public class StartAttackHandler(IConnectionMultiplexer redis) : IEventHandler
{
    public string EventName => "start_attack";

    public async Task HandleAsync(JsonElement data, CancellationToken ct)
    {
        var db = redis.GetDatabase();
        var message = JsonSerializer.Serialize(new { event_name = "start_attack", data });
        await db.PublishAsync(RedisChannel.Literal("live_events"), message);
    }
}
