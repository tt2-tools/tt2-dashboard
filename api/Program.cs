using api.Endpoints;
using api.Services;
using Npgsql;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect($"{builder.Configuration["Redis:Host"]}:6379"));

builder.Services.AddSingleton(_ =>
    NpgsqlDataSource.Create(builder.Configuration["Postgres:ConnectionString"]!));

builder.Services.AddSingleton<LiveEventBroadcaster>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<LiveEventBroadcaster>());

var app = builder.Build();

app.MapRaidEndpoints();
app.MapPlayerEndpoints();
app.MapSseEndpoints();

app.Run();
