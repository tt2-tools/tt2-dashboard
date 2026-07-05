using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using worker.Entities;

namespace worker.Handlers;

public class MoraleHandler(ILogger<MoraleHandler> logger, IDbContextFactory<AppDbContext> dbFactory) : IEventHandler
{
    public string EventName => "morale";

    public async Task HandleAsync(JsonElement data, CancellationToken ct)
    {
        var evt = data.Deserialize<MoraleEvent>();
        if (evt is null) return;

        await using var db = await dbFactory.CreateDbContextAsync(ct);

        await db.Database.ExecuteSqlAsync(
            $"INSERT INTO clans (clan_code) VALUES ({evt.ClanCode}) ON CONFLICT DO NOTHING", ct);

        await db.Database.ExecuteSqlAsync(
            $"INSERT INTO players (player_code, clan_code, name) VALUES ({evt.Player.PlayerCode}, {evt.ClanCode}, {evt.Player.Name}) ON CONFLICT (player_code) DO UPDATE SET name = EXCLUDED.name", ct);

        db.MoraleTransactions.Add(new MoraleTransaction
        {
            ClanCode = evt.ClanCode,
            PlayerCode = evt.Player.PlayerCode,
            Amount = evt.Amount,
            TotalAmount = evt.TotalAmount,
            EventType = MoraleEventType.Contribution,
        });

        await db.SaveChangesAsync(ct);

        logger.LogInformation(
            "[{ClanCode}] {PlayerCode} contributed {Amount} morale (total: {Total})",
            evt.ClanCode, evt.Player.PlayerCode, evt.Amount, evt.TotalAmount);
    }
}

file record MoraleEvent(
    [property: JsonPropertyName("amount")] int Amount,
    [property: JsonPropertyName("player")] MoralePlayer Player,
    [property: JsonPropertyName("clan_code")] string ClanCode,
    [property: JsonPropertyName("total_amount")] int TotalAmount
);

file record MoralePlayer(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("player_code")] string PlayerCode
);
