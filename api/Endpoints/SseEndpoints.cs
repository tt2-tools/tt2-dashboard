using api.Services;

namespace api.Endpoints;

public static class SseEndpoints
{
    public static void MapSseEndpoints(this WebApplication app)
    {
        app.MapGet("/live", async (HttpContext ctx, LiveEventBroadcaster broadcaster, CancellationToken ct) =>
        {
            ctx.Response.Headers["Content-Type"] = "text/event-stream";
            ctx.Response.Headers["Cache-Control"] = "no-cache";
            ctx.Response.Headers["X-Accel-Buffering"] = "no";

            var (id, channel) = broadcaster.Subscribe();
            try
            {
                await foreach (var message in channel.Reader.ReadAllAsync(ct))
                {
                    await ctx.Response.WriteAsync($"data: {message}\n\n", ct);
                    await ctx.Response.Body.FlushAsync(ct);
                }
            }
            finally
            {
                broadcaster.Unsubscribe(id);
            }
        });
    }
}
