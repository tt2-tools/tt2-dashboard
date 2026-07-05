using Dapper;
using Npgsql;

namespace api.Endpoints;

public static class PlayerEndpoints
{
    public static void MapPlayerEndpoints(this WebApplication app)
    {
        app.MapGet("/clans/{clanCode}/players", async (string clanCode, NpgsqlDataSource db) =>
        {
            const string sql = """
                SELECT player_code, name, clan_code, created_at
                FROM players
                WHERE clan_code = @clanCode
                ORDER BY name
                """;
            await using var conn = await db.OpenConnectionAsync();
            var players = await conn.QueryAsync(sql, new { clanCode });
            return Results.Ok(players);
        });

        app.MapGet("/players/{playerCode}", async (string playerCode, NpgsqlDataSource db) =>
        {
            await using var conn = await db.OpenConnectionAsync();

            const string playerSql = """
                SELECT player_code, name, clan_code, created_at
                FROM players
                WHERE player_code = @playerCode
                """;
            var player = await conn.QueryFirstOrDefaultAsync(playerSql, new { playerCode });
            if (player is null) return Results.NotFound();

            const string cardsSql = """
                SELECT card_id, level, updated_at
                FROM player_card_levels
                WHERE player_code = @playerCode
                ORDER BY card_id
                """;
            var cards = await conn.QueryAsync(cardsSql, new { playerCode });

            const string attacksSql = """
                SELECT a.id, a.raid_id, a.cycle, a.attacks_remaining,
                       a.total_damage, a.attack_datetime
                FROM attacks a
                WHERE a.player_code = @playerCode
                ORDER BY a.attack_datetime DESC
                LIMIT 50
                """;
            var attacks = await conn.QueryAsync(attacksSql, new { playerCode });

            return Results.Ok(new { player, cards, attacks });
        });
    }
}
