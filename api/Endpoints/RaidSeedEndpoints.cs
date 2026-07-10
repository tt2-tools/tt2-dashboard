using api.Services;

namespace api.Endpoints;

public static class RaidSeedEndpoints
{
    public static void MapRaidSeedEndpoints(this WebApplication app)
    {
        app.MapGet("/seed/meta", async (RaidSeedService svc, CancellationToken ct) =>
            await Forward(await svc.GetMetaAsync(ct)));

        app.MapGet("/seed/raids", async (RaidSeedService svc, CancellationToken ct) =>
            await Forward(await svc.GetRaidsAsync(ct)));

        app.MapGet("/seed/raids/{tier:int}/{level:int}", async (RaidSeedService svc, int tier, int level, CancellationToken ct) =>
            await Forward(await svc.GetRaidAsync(tier, level, ct)));
    }

    private static async Task<IResult> Forward(HttpResponseMessage response)
    {
        var body = await response.Content.ReadAsStringAsync();
        var contentType = response.Content.Headers.ContentType?.ToString() ?? "application/json";
        return Results.Content(body, contentType, statusCode: (int)response.StatusCode);
    }
}
