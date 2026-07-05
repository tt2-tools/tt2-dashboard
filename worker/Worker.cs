using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System.Text.Json;
using worker.Entities;

namespace worker;

public class Worker(ILogger<Worker> logger, IConnectionMultiplexer redis, IDbContextFactory<AppDbContext> dbFactory, EventDispatcher dispatcher) : BackgroundService
{
    private const string QueueName = "api_event";

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await using (var db = await dbFactory.CreateDbContextAsync(stoppingToken))
            await db.Database.MigrateAsync(stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            await ConsumeEvents(stoppingToken);
            await Task.Delay(1000, stoppingToken);
        }
    }

    private async Task ConsumeEvents(CancellationToken stoppingToken)
    {
        var redisDb = redis.GetDatabase();

        RedisValue entry;
        while ((entry = await redisDb.ListRightPopAsync(QueueName)) != RedisValue.Null)
        {
            stoppingToken.ThrowIfCancellationRequested();

            try
            {
                var evt = JsonSerializer.Deserialize<ApiEvent>(entry.ToString());
                if (evt is null) continue;

                await InsertRawEvent(evt, stoppingToken);
                await dispatcher.DispatchAsync(evt.EventName ?? "", evt.Data, stoppingToken);
                logger.LogInformation("Processed event: {EventName}", evt.EventName);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to process event: {Entry}", entry);
            }
        }
    }

    private async Task InsertRawEvent(ApiEvent evt, CancellationToken ct)
    {
        await using var db = await dbFactory.CreateDbContextAsync(ct);
        db.Events.Add(new RawEvent
        {
            EventName = evt.EventName ?? "",
            EventData = JsonDocument.Parse(evt.Data.GetRawText()),
        });
        await db.SaveChangesAsync(ct);
    }
}

public class RedisSettings
{
    public string Host { get; set; } = "redis";
}

public class PostgresSettings
{
    public string ConnectionString { get; set; } = "";
}

public record ApiEvent(
    [property: System.Text.Json.Serialization.JsonPropertyName("event_name")] string? EventName,
    [property: System.Text.Json.Serialization.JsonPropertyName("data")] JsonElement Data
);
