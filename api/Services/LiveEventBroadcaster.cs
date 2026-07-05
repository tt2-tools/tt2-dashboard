using System.Collections.Concurrent;
using System.Threading.Channels;
using StackExchange.Redis;

namespace api.Services;

public class LiveEventBroadcaster(IConnectionMultiplexer redis, ILogger<LiveEventBroadcaster> logger) : IHostedService
{
    private readonly ConcurrentDictionary<Guid, Channel<string>> _clients = new();

    public async Task StartAsync(CancellationToken ct)
    {
        var sub = redis.GetSubscriber();
        await sub.SubscribeAsync(RedisChannel.Literal("live_events"), (_, message) =>
        {
            if (message.IsNullOrEmpty) return;
            var text = message.ToString();
            foreach (var (id, channel) in _clients)
            {
                if (!channel.Writer.TryWrite(text))
                    logger.LogWarning("Dropped event for slow client {ClientId}", id);
            }
        });
    }

    public async Task StopAsync(CancellationToken ct)
    {
        await redis.GetSubscriber().UnsubscribeAllAsync();
        foreach (var (_, channel) in _clients)
            channel.Writer.TryComplete();
    }

    public (Guid Id, Channel<string> Channel) Subscribe()
    {
        var id = Guid.NewGuid();
        var channel = Channel.CreateBounded<string>(new BoundedChannelOptions(100)
        {
            FullMode = BoundedChannelFullMode.DropOldest,
        });
        _clients[id] = channel;
        return (id, channel);
    }

    public void Unsubscribe(Guid id)
    {
        if (_clients.TryRemove(id, out var channel))
            channel.Writer.TryComplete();
    }
}
