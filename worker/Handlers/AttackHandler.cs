using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using worker.Entities;

namespace worker.Handlers;

public class AttackHandler(ILogger<AttackHandler> logger, IDbContextFactory<AppDbContext> dbFactory, IConnectionMultiplexer redis) : IEventHandler
{
    public string EventName => "attack";

    public async Task HandleAsync(JsonElement data, CancellationToken ct)
    {
        var evt = data.Deserialize<AttackEvent>();
        if (evt is null) return;

        await using var db = await dbFactory.CreateDbContextAsync(ct);

        await db.Database.ExecuteSqlAsync(
            $"INSERT INTO clans (clan_code) VALUES ({evt.ClanCode}) ON CONFLICT DO NOTHING", ct);

        await db.Database.ExecuteSqlAsync(
            $"INSERT INTO players (player_code, clan_code, name) VALUES ({evt.Player.PlayerCode}, {evt.ClanCode}, {evt.Player.Name}) ON CONFLICT (player_code) DO UPDATE SET name = EXCLUDED.name", ct);

        await db.Database.ExecuteSqlAsync(
            $"INSERT INTO raids (raid_id, clan_code, enemy_id) VALUES ({evt.RaidId}, {evt.ClanCode}, {evt.RaidState.Current.EnemyId}) ON CONFLICT (raid_id) DO NOTHING", ct);

        foreach (var card in evt.AttackLog.CardsLevel)
        {
            await db.Database.ExecuteSqlAsync(
                $"INSERT INTO player_card_levels (player_code, card_id, level, updated_at) VALUES ({evt.Player.PlayerCode}, {card.Id}, {card.Level}, NOW()) ON CONFLICT (player_code, card_id) DO UPDATE SET level = EXCLUDED.level, updated_at = NOW() WHERE player_card_levels.level != EXCLUDED.level", ct);
        }

        var totalDamage = evt.AttackLog.CardsDamage
            .SelectMany(c => c.DamageLog)
            .Sum(d => d.Value);

        db.Attacks.Add(new Attack
        {
            RaidId = evt.RaidId,
            PlayerCode = evt.Player.PlayerCode,
            Cycle = evt.Cycle,
            AttacksRemaining = evt.Player.AttacksRemaining,
            TotalDamage = totalDamage,
            AttackLog = JsonDocument.Parse(data.GetProperty("attack_log").GetRawText()),
            RaidState = JsonDocument.Parse(data.GetProperty("raid_state").GetRawText()),
            AttackDatetime = DateTime.Parse(evt.AttackLog.AttackDatetime, null, System.Globalization.DateTimeStyles.AdjustToUniversal),
        });

        await db.SaveChangesAsync(ct);

        var message = JsonSerializer.Serialize(new { event_name = "attack", data });
        await redis.GetDatabase().PublishAsync(RedisChannel.Literal("live_events"), message);

        logger.LogInformation(
            "[{ClanCode}] Raid {RaidId} cycle {Cycle} — {PlayerCode} dealt {Damage:N0} damage",
            evt.ClanCode, evt.RaidId, evt.Cycle, evt.Player.PlayerCode, totalDamage);
    }
}

file record AttackEvent(
    [property: JsonPropertyName("cycle")] int Cycle,
    [property: JsonPropertyName("player")] AttackPlayer Player,
    [property: JsonPropertyName("raid_id")] int RaidId,
    [property: JsonPropertyName("clan_code")] string ClanCode,
    [property: JsonPropertyName("attack_log")] AttackLog AttackLog,
    [property: JsonPropertyName("raid_state")] AttackRaidState RaidState
);

file record AttackPlayer(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("player_code")] string PlayerCode,
    [property: JsonPropertyName("attacks_remaining")] int AttacksRemaining
);

file record AttackLog(
    [property: JsonPropertyName("cards_level")] List<CardLevel> CardsLevel,
    [property: JsonPropertyName("cards_damage")] List<CardDamage> CardsDamage,
    [property: JsonPropertyName("attack_datetime")] string AttackDatetime
);

file record CardLevel(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("value")] int Level
);

file record CardDamage(
    [property: JsonPropertyName("damage_log")] List<DamageEntry> DamageLog
);

file record DamageEntry(
    [property: JsonPropertyName("value")] long Value
);

file record AttackRaidState(
    [property: JsonPropertyName("current")] RaidStateCurrent Current
);

file record RaidStateCurrent(
    [property: JsonPropertyName("enemy_id")] string EnemyId
);
