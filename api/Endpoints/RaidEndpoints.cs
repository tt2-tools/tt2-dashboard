using Dapper;
using Npgsql;

namespace api.Endpoints;

public static class RaidEndpoints
{
    public static void MapRaidEndpoints(this WebApplication app)
    {
        app.MapGet("/clans/{clanCode}/raids", async (string clanCode, NpgsqlDataSource db) =>
        {
            const string sql = """
                SELECT raid_id, clan_code, enemy_id, created_at
                FROM raids
                WHERE clan_code = @clanCode
                ORDER BY raid_id DESC
                """;
            await using var conn = await db.OpenConnectionAsync();
            var raids = await conn.QueryAsync(sql, new { clanCode });
            return Results.Ok(raids);
        });

        app.MapGet("/raids/{raidId:int}", async (int raidId, NpgsqlDataSource db) =>
        {
            await using var conn = await db.OpenConnectionAsync();

            const string raidSql = """
                SELECT raid_id, clan_code, enemy_id, created_at
                FROM raids
                WHERE raid_id = @raidId
                """;
            var raid = await conn.QueryFirstOrDefaultAsync(raidSql, new { raidId });
            if (raid is null) return Results.NotFound();

            const string attacksSql = """
                SELECT a.id, a.player_code, p.name as player_name, a.cycle,
                       a.attacks_remaining, a.total_damage, a.attack_datetime
                FROM attacks a
                JOIN players p ON p.player_code = a.player_code
                WHERE a.raid_id = @raidId
                ORDER BY a.attack_datetime
                """;
            var attacks = await conn.QueryAsync(attacksSql, new { raidId });

            return Results.Ok(new { raid, attacks });
        });
    }
}
